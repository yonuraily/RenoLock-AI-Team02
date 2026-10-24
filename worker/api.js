// Cloud identity is supplied and verified by Sites dispatch, never by browser form data.
export function emptyState(){return {marketVersion:1,staffVersion:1,users:[],projects:[],prices:[],estimates:[],logs:[],profiles:[],requests:[],reviews:[],staffAudit:[],projectNotes:[],tasks:[]};}
export async function handleAPI(request,env){
 const url=new URL(request.url),path=url.pathname;
 const send=(code,data)=>Response.json(data,{status:code,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 if(path==='/api/health')return send(200,{ok:true,mode:'server',cloud:true,identity:'chatgpt',storage:'D1',ai:'rules'});
 if(!['GET','POST'].includes(request.method))return send(405,{error:'Метод не поддерживается'});
 if(request.method==='POST'&&(request.headers.get('origin')!==url.origin||!request.headers.get('content-type')?.startsWith('application/json')))return send(403,{error:'Недопустимый источник запроса'});
 const identity=request.headers.get('oai-authenticated-user-id'),email=request.headers.get('oai-authenticated-user-email');
 if(!identity||!email)return send(401,{error:'Войдите через ChatGPT'});
 if(path==='/api/identity')return send(200,{email});
 if(!env.DB)return send(503,{error:'Облачная база временно недоступна'});
 let data={};if(request.method==='POST'){const body=await request.text();if(body.length>250000)return send(413,{error:'Запрос слишком большой'});try{data=JSON.parse(body);}catch{return send(400,{error:'Некорректный JSON'});}}
 try{
  // The version comparison prevents lost updates across Worker isolates.
  await env.DB.prepare('INSERT OR IGNORE INTO renolock_state (id,json,version) VALUES (1,?,0)').bind(JSON.stringify(emptyState())).run();
  for(let retry=0;retry<8;retry++){
   const row=await env.DB.prepare('SELECT json,version FROM renolock_state WHERE id=1').first();
   const state=JSON.parse(row.json);let user=state.users.find(u=>u.id===identity);
   if(user?.blocked)return send(403,{error:'Аккаунт заблокирован'});
   if(path==='/api/auth'&&request.method==='POST'){
    if(!user){
     if(!['client','contractor'].includes(data.role)||typeof data.name!=='string'||!data.name.trim()||data.name.length>100)return send(400,{error:'Укажите имя и роль'});
     if(state.users.some(u=>u.email.toLowerCase()===email.toLowerCase()))return send(409,{error:'Этот email уже связан с другим аккаунтом'});
     user={id:identity,email:email.toLowerCase(),name:data.name.trim(),role:'client',createdAt:new Date().toISOString()};user.role=data.role;state.users.push(user);
    }else return send(200,{user});
   }else{
    if(!user)return send(401,{error:'Завершите регистрацию: укажите имя и роль'});
    if(path==='/api/state'&&request.method==='GET')return send(200,core.view(state,user));
    if(path!=='/api/action'||request.method!=='POST')return send(404,{error:'Не найдено'});
    if(typeof data.action!=='string'||!data.data||typeof data.data!=='object')return send(400,{error:'Некорректное действие'});
   }
   const result=path==='/api/action'?core.mutate(state,user,data.action,data.data):null;
   if(JSON.stringify(state).length>10000000)return send(413,{error:'Достигнут лимит хранилища MVP. Обратитесь к администратору.'});
   const write=await env.DB.prepare('UPDATE renolock_state SET json=?,version=version+1 WHERE id=1 AND version=?').bind(JSON.stringify(state),row.version).run();
   if(write.meta.changes===1)return send(200,path==='/api/auth'?{user}:{result});
  }
  return send(409,{error:'Данные обновляются другим участником. Повторите действие.'});
 }catch(error){console.error('RenoLock API',error.message);return send(400,{error:error.message||'Ошибка сохранения'});}
}
