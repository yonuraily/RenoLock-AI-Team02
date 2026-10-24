import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
const root=new URL('../',import.meta.url);
test('HTTP accounts, isolation, full workflow and persistence',async()=>{
 const data=mkdtempSync(path.join(tmpdir(),'renolock-test-'));
 let child;let port;
 async function start(){child=spawn(process.execPath,['server.mjs'],{cwd:root,env:{...process.env,PORT:'0',RENOLOCK_DATA:data},stdio:['ignore','pipe','pipe']});port=await new Promise((resolve,reject)=>{let out='';child.stdout.on('data',chunk=>{out+=chunk;const match=out.match(/127\.0\.0\.1:(\d+)/);if(match)resolve(match[1]);});child.once('error',reject);child.once('exit',code=>reject(Error('Server exit '+code)));setTimeout(()=>reject(Error('Server timeout')),10000).unref();});}
 // Use an allocated port from a small readiness message; server prints actual bound port.
 const cookies={};
 async function request(route,{method='GET',body,as,origin}={}){const res=await fetch(`http://127.0.0.1:${port}/api/${route}`,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(as&&cookies[as]?{cookie:cookies[as]}:{}),...(origin?{origin}:{})},body:body?JSON.stringify(body):undefined});const cookie=res.headers.get('set-cookie');if(cookie&&as)cookies[as]=cookie.split(';')[0];return {status:res.status,data:await res.json(),cookie};}
 async function stop(){await new Promise(resolve=>{child.once('exit',resolve);child.kill();});}
 try{
  await start();assert.equal((await request('state')).status,401);
  for(const role of ['contractor','client']){const r=await request('auth',{method:'POST',as:role,body:{email:role+'@renolock.demo',password:'RenoDemo2026!'}});assert.equal(r.status,200);assert.match(r.cookie,/HttpOnly/);}
  const get=(as)=>request('state',{as});const call=(as,action,data)=>request('action',{method:'POST',as,body:{action,data}});
  assert.equal((await get('client')).data.estimates.length,2);
  assert.equal((await call('contractor','estimate.transition',{id:'estimate-012',revision:1,status:'approved'})).status,400);
  assert.equal((await request('action',{method:'POST',as:'client',origin:'http://evil.example',body:{action:'estimate.transition',data:{id:'estimate-012',revision:1,status:'approved'}}})).status,403);
  assert.equal((await call('client','estimate.transition',{id:'estimate-012',revision:1,status:'approved',comment:'Проверено'})).status,200);
  const repeats=await Promise.all([call('client','estimate.transition',{id:'estimate-012',revision:1,status:'approved'}),call('client','estimate.transition',{id:'estimate-012',revision:2,status:'approved'})]);assert(repeats.every(r=>r.status===400));
  const reg=await request('auth',{method:'POST',as:'new',body:{register:true,name:'Новый клиент',email:'new@example.com',password:'SecurePassword123!',role:'client'}});assert.equal(reg.status,200);assert.equal((await get('new')).data.projects.length,0);
  assert.equal((await call('new','estimate.transition',{id:'estimate-012',revision:2,status:'approved'})).status,400);
  assert.equal((await request('auth',{method:'POST',as:'bad',body:{email:'new@example.com',password:'wrongpassword'}})).status,401);
  for(const role of ['manager','admin'])assert.equal((await request('auth',{method:'POST',as:role,body:{email:role+'@renolock.demo',password:'RenoDemo2026!'}})).status,200);
  assert.equal((await get('manager')).data.projects.length,2);assert.equal((await get('admin')).data.accounts.length,10);
  assert.equal((await request('auth',{method:'POST',as:'attack',body:{register:true,name:'Admin',email:'attack@example.com',password:'SecurePassword123!',role:'admin'}})).status,400);
  assert.equal((await call('manager','estimate.transition',{id:'estimate-012',revision:2,status:'approved'})).status,400);
  const newId=reg.data.user.id;
  assert.equal((await call('admin','admin.user.status',{id:newId,blocked:true,comment:'Test access block'})).status,200);
  assert.equal((await get('new')).status,401);
  assert.equal((await request('auth',{method:'POST',as:'new',body:{email:'new@example.com',password:'SecurePassword123!'}})).status,403);
  assert.equal((await call('admin','admin.user.status',{id:newId,blocked:false,comment:'Access restored'})).status,200);
  assert.equal((await request('auth',{method:'POST',as:'new',body:{email:'new@example.com',password:'SecurePassword123!'}})).status,200);
  assert.equal((await call('admin','admin.user.role',{id:newId,role:'manager',comment:'New staff member'})).status,200);
  assert.equal((await get('new')).status,401);
  assert.equal((await request('auth',{method:'POST',as:'new',body:{email:'new@example.com',password:'SecurePassword123!'}})).data.user.role,'manager');
  assert.equal((await get('new')).data.projects.length,0);
  await stop();await start();const persisted=await get('client');assert.equal(persisted.data.estimates.find(e=>e.id==='estimate-012').status,'approved');
  assert.equal((await request('logout',{method:'POST',as:'client',body:{}})).status,200);assert.equal((await get('client')).status,401);
 }finally{if(child?.exitCode===null)await stop();rmSync(data,{recursive:true,force:true});}
});
