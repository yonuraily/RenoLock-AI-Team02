import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import worker from '../dist/server/index.js';
const origin='https://renolock.test';
function database(){const db=new DatabaseSync(':memory:');db.exec('CREATE TABLE renolock_state (id INTEGER PRIMARY KEY,json TEXT NOT NULL,version INTEGER NOT NULL DEFAULT 0)');return {prepare(sql){let args=[];const statement={bind(...a){args=a;return statement;},async first(){return db.prepare(sql).get(...args);},async run(){const result=db.prepare(sql).run(...args);return {meta:{changes:Number(result.changes)}};}};return statement;}};}
async function call(env,path,identity,data){const headers={};if(identity){headers['oai-authenticated-user-id']=identity;headers['oai-authenticated-user-email']=identity+'@example.test';}if(data){headers.origin=origin;headers['content-type']='application/json';}const response=await worker.fetch(new Request(origin+'/api/'+path,{method:data?'POST':'GET',headers,body:data?JSON.stringify(data):undefined}),env);return {status:response.status,data:await response.json()};}
test('Cloud registration uses verified identity, persists state and isolates project access',async()=>{
 const env={DB:database()};assert.equal((await call(env,'state')).status,401);
 assert.equal((await call(env,'auth','attacker',{name:'A',role:'admin'})).status,400);
 const c=await call(env,'auth','builder',{name:'Builder',role:'contractor',email:'forged@example.test'});assert.equal(c.status,200);assert.equal(c.data.user.email,'builder@example.test');
 await call(env,'auth','customer',{name:'Customer',role:'client'});await call(env,'auth','stranger',{name:'Stranger',role:'client'});
 const p=await call(env,'action','builder',{action:'project.create',data:{name:'Shared renovation',address:'Almaty',area:50,clientEmail:'customer@example.test',baseline:[{name:'Base',unit:'этап',qty:1,price:1000}]}});assert.equal(p.status,200);
 assert.equal((await call(env,'state','customer')).data.projects.length,1);assert.equal((await call(env,'state','stranger')).data.projects.length,0);
 assert.equal((await call(env,'state','customer')).data.projects[0].baseline[0].price,1000);
 assert.equal((await call(env,'auth','builder',{name:'New',role:'client'})).data.user.role,'contractor');
 assert.equal((await call(env,'auth','admin-demo',{name:'Pretender',role:'admin'})).status,400);
});
test('Cloud rejects cross-origin writes and never exposes anonymous state',async()=>{
 const env={DB:database()};const response=await worker.fetch(new Request(origin+'/api/auth',{method:'POST',headers:{origin:'https://evil.test','content-type':'application/json','oai-authenticated-user-id':'a','oai-authenticated-user-email':'a@example.test'},body:'{}'}),env);assert.equal(response.status,403);
 assert.equal((await call(env,'state')).status,401);assert.equal((await call(env,'health')).data.storage,'D1');
});
test('Concurrent registrations retain all users without overwriting each other',async()=>{
 const env={DB:database()};const results=await Promise.all(Array.from({length:6},(_,i)=>call(env,'auth','user'+i,{name:'User '+i,role:'client'})));assert.ok(results.every(r=>r.status===200));const row=await env.DB.prepare('SELECT json FROM renolock_state WHERE id=1').first();assert.equal(JSON.parse(row.json).users.length,6);
});
