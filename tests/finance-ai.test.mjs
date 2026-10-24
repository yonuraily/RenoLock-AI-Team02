import {test} from 'node:test';import assert from 'node:assert/strict';
import {seed,ensurePlatform,view,mutate,budget} from '../dist/core.js';
import {validateAIResult,loadLocalAI} from '../dist/local-ai.js';
test('Contractor finance is private, persistent and never changes approved budget',()=>{
 const s=ensurePlatform(seed()),u=s.users.find(u=>u.role==='contractor'),client=s.users.find(u=>u.role==='client'),p=s.projects[0],before=budget(p,s.estimates);
 mutate(s,u,'finance.save',{projectId:p.id,plannedCost:1800000,actualCost:700000,received:900000});
 assert.equal(view(s,u).contractorFinance[0].plannedCost,1800000);assert.deepEqual(budget(p,s.estimates),before);
 assert.deepEqual(view(s,client).contractorFinance,[]);assert.equal(view(s,s.users.find(u=>u.role==='manager')).contractorFinance,undefined);
 assert.throws(()=>mutate(s,client,'finance.save',{projectId:p.id,plannedCost:0,actualCost:0,received:0}));
 const other={id:'other',name:'Other',email:'other@test.com',role:'contractor'};s.users.push(other);assert.throws(()=>mutate(s,other,'finance.save',{projectId:p.id,plannedCost:0,actualCost:0,received:0}));
 assert.throws(()=>mutate(s,u,'finance.save',{projectId:p.id,plannedCost:-1,actualCost:0,received:0}));
 assert.throws(()=>mutate(s,u,'finance.save',{projectId:p.id,plannedCost:NaN,actualCost:0,received:0}));
 mutate(s,u,'finance.save',{projectId:p.id,plannedCost:2000000,actualCost:800000,received:1000000});assert.equal(s.contractorFinance.length,1);assert.equal(s.contractorFinance[0].received,1000000);
 assert.equal(view(JSON.parse(JSON.stringify(s)),u).contractorFinance[0].actualCost,800000);
});
test('AI output cannot invent prices, quantities, units, IDs or duplicate items',()=>{
 const s=seed(),prices=s.prices,description='Выровнять 20 м2 стен; розетки 6 шт';
 const parse=items=>validateAIResult(JSON.stringify({items}),description,prices);
 const good=parse([{priceId:'wall',qty:20,evidence:'Выровнять 20 м2 стен',price:1}]);assert.equal(good.lines[0].price,2500);assert.ok(good.unresolved.length);
 for(const item of [{priceId:'unknown',qty:20,evidence:description},{priceId:'wall',qty:999,evidence:'Выровнять 20 м2 стен'},{priceId:'wall',qty:20,evidence:'invented 20 м2'},{priceId:'wall',qty:6,evidence:'розетки 6 шт'}])assert.equal(parse([item]).lines.length,0);
 assert.equal(parse([{priceId:'wall',qty:20,evidence:'Выровнять 20 м2 стен'},{priceId:'wall',qty:20,evidence:'Выровнять 20 м2 стен'}]).lines.length,1);
 assert.throws(()=>validateAIResult('not json',description,prices));
});
test('AI without WebGPU fails explicitly without pretending to generate',async()=>{
 if(!globalThis.navigator?.gpu)await assert.rejects(loadLocalAI(()=>{}),/WebGPU/);
});
