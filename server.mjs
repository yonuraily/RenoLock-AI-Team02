import http from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {scryptSync,randomBytes,timingSafeEqual,createHash} from 'node:crypto';
import {readFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {seed,view,mutate,uid} from './dist/core.js';
const root=path.dirname(fileURLToPath(import.meta.url));
const folder=process.env.RENOLOCK_DATA||path.join(root,'data');mkdirSync(folder,{recursive:true});
const db=new DatabaseSync(path.join(folder,'renolock.sqlite'));
db.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS state (id INTEGER PRIMARY KEY CHECK(id=1),json TEXT NOT NULL); CREATE TABLE IF NOT EXISTS credentials (email TEXT PRIMARY KEY,hash TEXT NOT NULL,salt TEXT NOT NULL); CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY,user_id TEXT NOT NULL,expires INTEGER NOT NULL)');
const load=()=>JSON.parse(db.prepare('SELECT json FROM state WHERE id=1').get().json);
const save=s=>db.prepare('INSERT OR REPLACE INTO state VALUES(1,?)').run(JSON.stringify(s));
const hash=(password,salt)=>scryptSync(password,salt,64).toString('hex');
if(!db.prepare('SELECT id FROM state').get()){
 const s=seed();save(s);for(const u of s.users){const salt=randomBytes(16).toString('hex');db.prepare('INSERT INTO credentials VALUES(?,?,?)').run(u.email,hash('RenoDemo2026!',salt),salt);}
}
const digest=s=>createHash('sha256').update(s).digest('hex');
const port=Number(process.env.PORT||4173),host=process.env.HOST||'127.0.0.1';
const attempts=new Map();
const cleanUser=({id,name,email,role})=>({id,name,email,role});
const server=http.createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('X-Frame-Options','DENY');
 const send=(code,value)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
 try{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname.startsWith('/api/')){
  if(!['GET','POST'].includes(req.method))return send(405,{error:'Метод не поддерживается'});
  if(req.method==='POST'){
   if(req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`&&req.headers.origin!==`https://${req.headers.host}`)return send(403,{error:'Недопустимый источник запроса'});
   if(!req.headers['content-type']?.startsWith('application/json'))return send(415,{error:'Ожидается JSON'});
  }
  let body='';for await(const chunk of req){body+=chunk;if(body.length>1000000)return send(413,{error:'Запрос слишком большой'});}
  let data={};try{data=body?JSON.parse(body):{};}catch{return send(400,{error:'Некорректный JSON'});}
  const cookie=(req.headers.cookie||'').match(/(?:^|; )renolock=([^;]+)/)?.[1];
  const session=cookie?db.prepare('SELECT * FROM sessions WHERE token=? AND expires>?').get(digest(cookie),Date.now()):null;
  let s=load(),user=session?s.users.find(u=>u.id===session.user_id):null;
  if(url.pathname==='/api/health')return send(200,{ok:true,mode:'server',ai:'rules'});
  if(url.pathname==='/api/auth'&&req.method==='POST'){
   const key=req.socket.remoteAddress,entry=attempts.get(key)||{count:0,until:Date.now()+60000};if(entry.until<Date.now()){entry.count=0;entry.until=Date.now()+60000;}entry.count++;attempts.set(key,entry);if(entry.count>30)return send(429,{error:'Слишком много попыток. Повторите через минуту.'});
   const email=String(data.email||'').trim().toLowerCase(),password=String(data.password||'');
   if(data.register){
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>200||password.length<10||password.length>200||!['contractor','client'].includes(data.role)||typeof data.name!=='string'||!data.name.trim()||data.name.length>100)return send(400,{error:'Укажите имя, email, роль и пароль от 10 до 200 символов'});
    if(s.users.some(u=>u.email===email))return send(409,{error:'Этот email уже зарегистрирован'});
    user={id:uid(),name:data.name.trim(),email,role:data.role};const salt=randomBytes(16).toString('hex');
    db.exec('BEGIN IMMEDIATE');try{db.prepare('INSERT INTO credentials VALUES(?,?,?)').run(email,hash(password,salt),salt);s.users.push(user);save(s);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
   }else{
    const c=db.prepare('SELECT * FROM credentials WHERE email=?').get(email);
    if(!c||password.length>200||!timingSafeEqual(Buffer.from(hash(password,c.salt),'hex'),Buffer.from(c.hash,'hex')))return send(401,{error:'Неверный email или пароль'});
    user=s.users.find(u=>u.email===email);
   }
   const token=randomBytes(32).toString('hex');if(cookie)db.prepare('DELETE FROM sessions WHERE token=?').run(digest(cookie));db.prepare('DELETE FROM sessions WHERE expires<?').run(Date.now());db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(digest(token),user.id,Date.now()+86400000);
   res.setHeader('Set-Cookie',`renolock=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400${process.env.SECURE_COOKIE==='1'?'; Secure':''}`);return send(200,{user:cleanUser(user)});
  }
  if(!user)return send(401,{error:'Войдите в аккаунт'});
  if(url.pathname==='/api/logout'&&req.method==='POST'){db.prepare('DELETE FROM sessions WHERE token=?').run(digest(cookie));res.setHeader('Set-Cookie','renolock=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');return send(200,{ok:true});}
  if(url.pathname==='/api/state'&&req.method==='GET')return send(200,view(s,user));
  if(url.pathname==='/api/action'&&req.method==='POST'){
   db.exec('BEGIN IMMEDIATE');try{s=load();const result=mutate(s,user,data.action,data.data||{});save(s);db.exec('COMMIT');return send(200,{result});}catch(e){db.exec('ROLLBACK');return send(400,{error:e.message});}
  }
  return send(404,{error:'Не найдено'});
 }
 if(req.method!=='GET'&&req.method!=='HEAD')return send(405,{error:'Метод не поддерживается'});
 const files={'/':'index.html','/index.html':'index.html','/app.js':'app.js','/core.js':'core.js','/style.css':'style.css'};
 if(!files[url.pathname])return send(404,{error:'Не найдено'});
 const file=files[url.pathname],ext=path.extname(file);res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[ext]+'; charset=utf-8','Cache-Control':'no-cache','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"});res.end(req.method==='HEAD'?'':readFileSync(path.join(root,'dist',file)));
 }catch(e){console.error(e.message);if(!res.headersSent)send(500,{error:'Ошибка сервера. Данные не изменены.'});else res.end();}
});
server.listen(port,host,()=>console.log(`RenoLock AI: http://${host}:${server.address().port}\nOffline pricing mode · SQLite storage`));
process.on('SIGTERM',()=>server.close(()=>{db.close();process.exit();}));
