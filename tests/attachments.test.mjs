import {test} from 'node:test';import assert from 'node:assert/strict';import {DatabaseSync} from 'node:sqlite';
import worker from '../dist/server/index.js';import {seed,ensurePlatform,mutate,view} from '../dist/core.js';import {validateFile,fileLimit} from '../dist/attachments.js';
const png=Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jX1sAAAAASUVORK5CYII=','base64'));
const origin='https://renolock.test';
function environment(){const db=new DatabaseSync(':memory:');db.exec('CREATE TABLE renolock_state(id INTEGER PRIMARY KEY,json TEXT NOT NULL,version INTEGER NOT NULL DEFAULT 0)');db.prepare('INSERT INTO renolock_state VALUES(1,?,0)').run(JSON.stringify(ensurePlatform(seed())));const objects=new Map();return {objects,db,env:{DB:{prepare(sql){let args=[];const statement={bind(...values){args=values;return statement;},async first(){return db.prepare(sql).get(...args);},async run(){return {meta:{changes:Number(db.prepare(sql).run(...args).changes)}};}};return statement;}},BUCKET:{async put(key,bytes){objects.set(key,bytes.slice());},async get(key){return objects.has(key)?{body:objects.get(key)}:null;},async delete(key){objects.delete(key);}}}};}
function request(path,user='contractor-demo',body=null,headers={}){return new Request(origin+path,{method:body?'POST':'GET',headers:{'oai-authenticated-user-id':user,'oai-authenticated-user-email':user+'@demo.test',...(body?{origin,'content-type':'application/octet-stream'}:{}),...headers},...(body?{body}: {})});}
const upload=(env,name='photo.png',user='contractor-demo',bytes=png)=>worker.fetch(request('/api/files?projectId=nova&name='+encodeURIComponent(name),user,bytes),env);
test('Private cloud upload, message linkage, protected preview and download survive reload',async()=>{
 const {env,db,objects}=environment();const response=await upload(env);assert.equal(response.status,200);const {file}=await response.json();assert.equal(objects.size,1);
 let preview=await worker.fetch(request('/api/files/'+file.id),env);assert.equal(preview.status,200);assert.equal(preview.headers.get('content-type'),'image/png');assert.match(preview.headers.get('content-disposition'),/^inline/);assert.deepEqual(new Uint8Array(await preview.arrayBuffer()),png);
 assert.equal((await worker.fetch(request('/api/files/'+file.id,'client-demo'),env)).status,404);
 const data={action:'chat.send',data:{projectId:'nova',text:'Фото замечания',attachments:[file.id],clientMessageId:crypto.randomUUID()}};assert.equal((await worker.fetch(request('/api/action','contractor-demo',JSON.stringify(data),{'content-type':'application/json'}),env)).status,200);
 assert.equal((await worker.fetch(request('/api/files/'+file.id,'client-demo'),env)).status,200);assert.equal((await worker.fetch(request('/api/files/'+file.id,'admin-demo'),env)).status,404);assert.equal((await worker.fetch(request('/api/files/'+file.id,'comfort-demo'),env)).status,404);
 const state=JSON.parse(db.prepare('SELECT json FROM renolock_state WHERE id=1').get().json),payload=view(state,state.users[1]);assert.equal(payload.messages[0].attachments[0],file.id);assert.equal(payload.files[0].key,undefined);assert.equal(payload.files[0].name,'photo.png');
 const download=await worker.fetch(request('/api/files/'+file.id+'?download=1','client-demo'),env);assert.match(download.headers.get('content-disposition'),/^attachment/);assert.match(download.headers.get('cache-control'),/no-store/);
});
test('Upload rejects staff, foreign projects, active content, wrong signatures and excess size',async()=>{
 const {env,objects}=environment();assert.equal((await upload(env,'photo.png','admin-demo')).status,403);assert.equal((await upload(env,'photo.png','comfort-demo')).status,403);
 assert.equal((await upload(env,'script.svg')).status,400);assert.equal((await upload(env,'fake.png','contractor-demo',new TextEncoder().encode('<html>bad</html>'))).status,400);
 const tooBig=request('/api/files?projectId=nova&name=large.png','contractor-demo',png,{'content-length':String(fileLimit+1)});assert.equal((await worker.fetch(tooBig,env)).status,413);assert.equal(objects.size,0);
 assert.throws(()=>validateFile('../photo.png',png));assert.throws(()=>validateFile('bad\nname.png',png));
});
test('Attachment-only messages require own uploaded files in same project and at most three',()=>{
 const s=ensurePlatform(seed()),c=s.users[0],u=s.users[1];s.files=[{id:'file-a',projectId:'nova',ownerId:c.id,name:'Photo.png',type:'image/png',size:100},{id:'file-other',projectId:'terrace',ownerId:c.id}];
 const body={projectId:'nova',text:'',attachments:['file-a'],clientMessageId:crypto.randomUUID()};mutate(s,c,'chat.send',body);assert.equal(s.messages[0].text,'');assert.equal(view(s,u).files.length,1);
 assert.throws(()=>mutate(s,u,'chat.send',{...body,clientMessageId:crypto.randomUUID()}));assert.throws(()=>mutate(s,c,'chat.send',{...body,attachments:['file-other'],clientMessageId:crypto.randomUUID()}));assert.throws(()=>mutate(s,c,'chat.send',{...body,attachments:['file-a','file-a'],clientMessageId:crypto.randomUUID()}));assert.throws(()=>mutate(s,c,'chat.send',{...body,attachments:['1','2','3','4'],clientMessageId:crypto.randomUUID()}));
});
test('Uncommitted R2 object is removed when metadata cannot be saved',async()=>{
 const {env,objects}=environment(),original=env.DB.prepare;env.DB.prepare=function(sql){const q=original.call(this,sql);if(sql.startsWith('UPDATE'))q.run=async()=>({meta:{changes:0}});return q;};const response=await upload(env);assert.equal(response.status,409);assert.equal(objects.size,0);
});
