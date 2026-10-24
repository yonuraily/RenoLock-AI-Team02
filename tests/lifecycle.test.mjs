import {test} from 'node:test';import assert from 'node:assert/strict';
import {seed,ensurePlatform,mutate,view,budget} from '../dist/core.js';import {calendarToday,lateDays} from '../dist/lifecycle.js';
const setup=()=>{const s=ensurePlatform(seed());return {s,c:s.users[0],u:s.users[1],p:s.projects[0],e:s.estimates.find(e=>e.status==='approved')};};
export function acceptWork(s,c,u,scope,t){
 mutate(s,c,'schedule.propose',{scope,id:t.id,version:t.scheduleVersion||0,start:'2026-10-24',end:'2026-11-05',reason:'Согласуем даты'});
 mutate(s,u,'schedule.decide',{scope,id:t.id,version:t.scheduleVersion,decision:'approved'});
 mutate(s,c,'acceptance.submit',{scope,id:t.id,version:t.acceptanceVersion||0,report:'Работы завершены, результат проверен подрядчиком'});
 mutate(s,u,'acceptance.decide',{scope,id:t.id,version:t.acceptanceVersion,decision:'accepted'});
}
test('Dates require valid ordered calendar dates and client consent; transfers preserve old agreement',()=>{
 const {s,c,u,p}=setup(),base={scope:'project',id:p.id};
 assert.throws(()=>mutate(s,c,'schedule.propose',{...base,version:0,start:'2026-02-30',end:'2026-03-01',reason:'Date'}));
 assert.throws(()=>mutate(s,c,'schedule.propose',{...base,version:0,start:'2026-11-02',end:'2026-11-01',reason:'Date'}));
 assert.throws(()=>mutate(s,u,'schedule.propose',{...base,version:0,start:'2026-11-01',end:'2026-11-10',reason:'Date'}));
 mutate(s,c,'schedule.propose',{...base,version:0,start:'2026-11-01',end:'2026-11-10',reason:'План ремонта'});assert.equal(p.schedule.end,undefined);
 assert.throws(()=>mutate(s,c,'schedule.decide',{...base,version:1,decision:'approved'}));
 mutate(s,u,'schedule.decide',{...base,version:1,decision:'approved'});assert.equal(p.schedule.end,'2026-11-10');
 mutate(s,c,'schedule.propose',{...base,version:2,start:'2026-11-01',end:'2026-11-15',reason:'Материалы задержаны'});assert.equal(p.schedule.end,'2026-11-10');
 assert.throws(()=>mutate(s,u,'schedule.decide',{...base,version:2,decision:'approved'}));
 assert.throws(()=>mutate(s,u,'schedule.decide',{...base,version:3,decision:'rejected',reason:''}));
 mutate(s,u,'schedule.decide',{...base,version:3,decision:'rejected',reason:'Перенос не подходит'});assert.equal(p.schedule.end,'2026-11-10');assert.equal(p.schedule.pending,null);assert.equal(p.schedule.history.length,4);
});
test('Acceptance supports defects, resubmission, isolation, immutable acceptance and unchanged budget',()=>{
 const {s,c,u,p,e}=setup(),base={scope:'estimate',id:e.id},before=budget(p,s.estimates);
 assert.throws(()=>mutate(s,c,'acceptance.submit',{...base,version:0,report:'Готово'}));
 mutate(s,c,'schedule.propose',{...base,version:0,start:'2026-10-24',end:'2026-11-05',reason:'План'});mutate(s,u,'schedule.decide',{...base,version:1,decision:'approved'});
 mutate(s,c,'acceptance.submit',{...base,version:0,report:'Розетки установлены'});
 assert.throws(()=>mutate(s,c,'acceptance.decide',{...base,version:1,decision:'accepted'}));
 assert.throws(()=>mutate(s,c,'estimate.progress',{id:e.id,expectedVersion:e.executionVersion,status:'in_progress'}));
 assert.throws(()=>mutate(s,c,'schedule.propose',{...base,version:e.scheduleVersion,start:'2026-10-24',end:'2026-11-08',reason:'New'}));
 assert.throws(()=>mutate(s,s.users.find(x=>x.role==='manager'),'acceptance.decide',{...base,version:1,decision:'accepted'}));
 assert.throws(()=>mutate(s,u,'acceptance.decide',{...base,version:1,decision:'changes',reason:''}));
 mutate(s,u,'acceptance.decide',{...base,version:1,decision:'changes',reason:'Исправить крепление розетки'});
 mutate(s,c,'acceptance.submit',{...base,version:2,report:'Крепление исправлено'});
 assert.throws(()=>mutate(s,u,'acceptance.decide',{...base,version:1,decision:'accepted'}));
 mutate(s,u,'acceptance.decide',{...base,version:3,decision:'accepted'});assert.equal(e.acceptanceHistory.length,4);
 assert.throws(()=>mutate(s,c,'acceptance.submit',{...base,version:4,report:'Again'}));assert.deepEqual(budget(p,s.estimates),before);
 const other=s.users.find(x=>x.id==='comfort-demo');assert.throws(()=>mutate(s,other,'schedule.propose',{...base,version:e.scheduleVersion,start:'2026-11-01',end:'2026-11-02',reason:'Other'}));
});
test('End-to-end closure requires client acceptance of baseline and every approved change',()=>{
 const {s,c,u,p,e}=setup();s.estimates=s.estimates.filter(x=>x.status==='approved');
 assert.throws(()=>mutate(s,u,'project.complete',{id:p.id}));acceptWork(s,c,u,'project',p);assert.throws(()=>mutate(s,u,'project.complete',{id:p.id}));acceptWork(s,c,u,'estimate',e);mutate(s,u,'project.complete',{id:p.id});assert.ok(p.completedAt);
 assert.throws(()=>mutate(s,c,'schedule.propose',{scope:'project',id:p.id,version:p.scheduleVersion,start:'2026-11-01',end:'2026-11-02',reason:'New'}));
});
test('Notifications are recipient-private, persistent, deduplicated by successful mutation and readable only by owner',()=>{
 const {s,c,u,p}=setup();mutate(s,c,'schedule.propose',{scope:'project',id:p.id,version:0,start:'2026-10-24',end:'2026-10-30',reason:'План'});
 const own=view(s,u).notifications;assert.equal(own.length,1);assert.equal(view(s,c).notifications.length,0);assert.equal(own[0].title,'Новые сроки на согласование');
 assert.throws(()=>mutate(s,c,'notification.read',{id:own[0].id}));assert.throws(()=>mutate(s,c,'schedule.propose',{scope:'project',id:p.id,version:0,start:'2026-10-24',end:'2026-10-30',reason:'План'}));assert.equal(s.notifications.length,2);
 mutate(s,u,'notification.read',{id:own[0].id});assert.ok(view(JSON.parse(JSON.stringify(s)),u).notifications[0].readAt);
 mutate(s,u,'schedule.decide',{scope:'project',id:p.id,version:1,decision:'approved'});assert.equal(view(s,c).notifications.length,1); // contractor + assigned manager receive separate records; contractor sees one decision
});
test('Calendar lateness uses Kazakhstan date boundary and calendar days',()=>{
 assert.equal(calendarToday('2026-10-24T20:00:00Z'),'2026-10-25');assert.equal(lateDays('2026-10-22','2026-10-24'),2);assert.equal(lateDays('2026-10-25','2026-10-24'),0);assert.equal(lateDays(null),0);
});
test('Marketplace request to initial quote, extra work, acceptance, closure and verified review',()=>{
 const {s,c,u}=setup();const r=mutate(s,u,'request.create',{profileId:'studio',title:'Полный путь ремонта',address:'Алматы',description:'Ремонт квартиры',area:70,repairClass:'Стандарт',targetBudget:3000000});
 mutate(s,c,'request.quote',{id:r.id,revision:r.revision,lines:[{name:'Основной ремонт',unit:'этап',qty:1,price:2400000}],comment:'Состав работ согласуем в проекте'});
 mutate(s,u,'request.accept',{id:r.id,revision:r.revision});const p=s.projects.find(p=>p.id===r.projectId);
 const e=mutate(s,c,'estimate.save',{projectId:p.id,title:'Дополнительные стены',description:'Выровнять 20 м2 стен',lines:[{priceId:'wall',qty:20,price:2500}]});mutate(s,c,'estimate.transition',{id:e.id,revision:e.revision,status:'pending'});mutate(s,u,'estimate.transition',{id:e.id,revision:e.revision,status:'approved'});
 acceptWork(s,c,u,'project',p);acceptWork(s,c,u,'estimate',e);mutate(s,u,'project.complete',{id:p.id});mutate(s,u,'review.create',{projectId:p.id,rating:5,text:'Все работы приняты, история сохранена'});
 assert.equal(budget(p,s.estimates).current,2450000);assert.equal(s.reviews.filter(x=>x.projectId===p.id).length,1);assert.ok(view(s,u).notifications.some(n=>n.title==='Работы готовы к приёмке'));assert.ok(view(s,c).notifications.some(n=>n.title==='Заказчик завершил проект'));
});

