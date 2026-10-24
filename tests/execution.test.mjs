import {test} from 'node:test';import assert from 'node:assert/strict';import {seed,ensurePlatform,view,mutate,budget} from '../dist/core.js';
test('Approved work has independent versioned progress and delay reason; no budget changes',()=>{
 const s=ensurePlatform(seed()),u=s.users.find(u=>u.role==='contractor'),client=s.users.find(u=>u.role==='client'),e=s.estimates.find(e=>e.status==='approved'),p=s.projects.find(p=>p.id===e.projectId),before=budget(p,s.estimates);
 const update=data=>mutate(s,u,'estimate.progress',{id:e.id,expectedVersion:e.executionVersion||0,...data});
 assert.throws(()=>update({status:'delayed',delayDays:0,reason:'Materials'}));assert.throws(()=>update({status:'delayed',delayDays:2,reason:''}));
 update({status:'in_progress'});assert.equal(e.executionVersion,1);
 assert.throws(()=>mutate(s,client,'estimate.progress',{id:e.id,expectedVersion:1,status:'done'}));assert.throws(()=>mutate(s,s.users.find(u=>u.role==='manager'),'estimate.progress',{id:e.id,expectedVersion:1,status:'done'}));
 update({status:'delayed',delayDays:3,reason:'Материалы приедут позже'});assert.equal(view(s,client).estimates.find(x=>x.id===e.id).execution.delayDays,3);
 assert.throws(()=>mutate(s,u,'estimate.progress',{id:e.id,expectedVersion:1,status:'done'}));
 assert.throws(()=>mutate(s,u,'estimate.progress',{id:s.estimates.find(x=>x.status==='pending').id,expectedVersion:0,status:'done'}));
 update({status:'done'});assert.equal(e.execution.delayDays,0);assert.equal(e.executionHistory[1].delayDays,3);assert.equal(e.executionHistory.length,3);assert.equal(e.status,'approved');assert.deepEqual(budget(p,s.estimates),before);
});
test('Client cannot close a project before approved work is marked done',()=>{
 const s=ensurePlatform(seed()),u=s.users.find(u=>u.role==='contractor'),client=s.users.find(u=>u.role==='client');s.estimates=s.estimates.filter(e=>e.status==='approved');const e=s.estimates[0];assert.throws(()=>mutate(s,client,'project.complete',{id:e.projectId}));mutate(s,u,'estimate.progress',{id:e.id,expectedVersion:0,status:'done'});mutate(s,client,'project.complete',{id:e.projectId});assert.throws(()=>mutate(s,u,'estimate.progress',{id:e.id,expectedVersion:1,status:'in_progress'}));
});
