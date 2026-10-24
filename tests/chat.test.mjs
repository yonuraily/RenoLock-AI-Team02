import {test} from 'node:test';import assert from 'node:assert/strict';
import {seed,ensurePlatform,mutate,view,budget} from '../dist/core.js';
const setup=()=>{const s=ensurePlatform(seed());return {s,c:s.users[0],u:s.users[1],p:s.projects[0]};};
test('Project chat persists messages and creates one private notification for the other participant',()=>{
 const {s,c,u,p}=setup(),before=budget(p,s.estimates);const d={projectId:p.id,text:'Когда привезут материалы?',clientMessageId:crypto.randomUUID()};
 const sent=mutate(s,u,'chat.send',d);assert.equal(view(s,u).messages.length,1);assert.equal(view(s,c).messages[0].senderId,u.id);assert.equal(view(s,c).notifications.length,1);assert.equal(view(s,u).notifications.length,0);
 assert.equal(view(s,c).notifications[0].chat,true);assert.equal(view(s,c).notifications[0].title,'Новое сообщение в проекте');
 const retry=mutate(s,u,'chat.send',d);assert.equal(retry.id,sent.id);assert.equal(retry.duplicate,true);assert.equal(s.messages.length,1);assert.equal(s.notifications.length,1);
 assert.throws(()=>mutate(s,u,'chat.send',{...d,text:'Другой текст с тем же ключом'}));
 mutate(s,c,'chat.send',{projectId:p.id,text:'Доставка завтра утром.',clientMessageId:crypto.randomUUID()});const reloaded=JSON.parse(JSON.stringify(s));assert.equal(view(reloaded,u).messages.length,2);assert.equal(view(reloaded,c).messages[1].text,'Доставка завтра утром.');assert.deepEqual(budget(p,s.estimates),before);
 mutate(s,u,'chat.read',{projectId:p.id});assert.ok(view(s,u).notifications.every(n=>n.readAt));assert.equal(view(s,c).notifications[0].readAt,null);
});
test('Chat denies unrelated users, staff, spoofed authors and empty/oversized messages',()=>{
 const {s,c,u,p}=setup(),data={projectId:p.id,text:'<script>alert(1)</script>',clientMessageId:crypto.randomUUID(),senderId:c.id,sender:'Forged'};
 mutate(s,u,'chat.send',data);assert.equal(s.messages[0].senderId,u.id);assert.equal(s.messages[0].sender,u.name);assert.equal(s.messages[0].text,data.text);
 for(const outsider of [s.users.find(u=>u.id==='comfort-demo'),s.users.find(u=>u.role==='manager'),s.users.find(u=>u.role==='admin')]){assert.deepEqual(view(s,outsider).messages,[]);assert.throws(()=>mutate(s,outsider,'chat.send',{...data,clientMessageId:crypto.randomUUID()}));assert.throws(()=>mutate(s,outsider,'chat.read',{projectId:p.id}));}
 for(const text of ['', '   ','x'.repeat(2001)])assert.throws(()=>mutate(s,u,'chat.send',{...data,text,clientMessageId:crypto.randomUUID()}));
 assert.throws(()=>mutate(s,u,'chat.send',{...data,projectId:'foreign'}));assert.throws(()=>mutate(s,u,'chat.send',{...data,clientMessageId:'bad'}));
});
test('Completed project chat is read-only and cannot alter project or approval state',()=>{
 const {s,c,u,p}=setup();mutate(s,c,'chat.send',{projectId:p.id,text:'Финальный отчёт отправлен',clientMessageId:crypto.randomUUID()});p.completedAt=new Date().toISOString();assert.equal(view(s,u).messages.length,1);
 assert.throws(()=>mutate(s,u,'chat.send',{projectId:p.id,text:'New',clientMessageId:crypto.randomUUID()}));mutate(s,u,'chat.read',{projectId:p.id});assert.equal(s.messages.length,1);
});
