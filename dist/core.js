import {ensureMarketplace,marketplaceView,marketMutate} from './market.js';
export {ensureMarketplace};
export const uid = () => globalThis.crypto.randomUUID();
export const now = () => new Date().toISOString();
export const statuses = {draft:'Черновик',pending:'На согласовании',approved:'Согласовано',rejected:'Отклонено',changes:'Нужны изменения'};
export const money = n => new Intl.NumberFormat('ru-KZ',{maximumFractionDigits:2}).format(n)+' ₸';
export const total = lines => Math.round(lines.reduce((s,l)=>s+Math.round(l.qty*l.price*100),0))/100;
export function budget(p,estimates){const rows=estimates.filter(e=>e.projectId===p.id);const approved=rows.filter(e=>e.status==='approved').reduce((s,e)=>s+total(e.lines),0);return {initial:total(p.baseline),approved,current:total(p.baseline)+approved,pending:rows.filter(e=>e.status==='pending').reduce((s,e)=>s+total(e.lines),0)};}
const assert=(condition,message)=>{if(!condition)throw Error(message);};
const text=(s,max=200)=>{assert(typeof s==='string'&&s.trim().length>0&&s.length<=max,'Проверьте текстовые поля');return s.trim();};
const number=(v,max=1e9)=>{assert(typeof v==='number'&&Number.isFinite(v)&&v>0&&v<=max,'Значение должно быть положительным числом');return v;};
const norm=s=>s.toLowerCase().replaceAll('ё','е').replace(/²/g,'2').replace(/\s+/g,' ').trim();
export function prepare(description,prices){
  text(description,5000);
  const lines=[],unresolved=[];
  // Each clause needs its own explicit quantity. Never infer one from another work item.
  const clauses=norm(description).split(/(?<!\d),(?!\d)|[;\n]|\s+и\s+/).map(s=>s.trim()).filter(Boolean);
  for(const clause of clauses){
    const matches=prices.filter(p=>p.active&&[p.name,...p.aliases].some(a=>clause.includes(norm(a))));
    if(matches.length!==1){unresolved.push({text:clause,reason:matches.length?'Неоднозначная работа — выберите позицию вручную':'Работа отсутствует в прайсе'});continue;}
    const p=matches[0], unit=p.unit==='м²'?'(?:м2|м\\^2|кв\\.?\\s*м)':p.unit==='м'?'(?:м(?!2)|метр(?:а|ов)?)':'(?:шт\\.?|штук(?:а|и)?)';
    const quantities=/-\s*\d/.test(clause)?[]:[...clause.matchAll(new RegExp('(?<![\\d.,-])(\\d+(?:[.,]\\d+)?)\\s*'+unit+'(?=\\s|$|[.,])','g'))];
    if(quantities.length!==1){unresolved.push({text:clause,reason:'Укажите один объём и единицу: например, 20 '+p.unit});continue;}
    const qty=Number(quantities[0][1].replace(',','.'));
    if(!(qty>0&&qty<=1e6)){unresolved.push({text:clause,reason:'Некорректный объём'});continue;}
    lines.push({priceId:p.id,name:p.name,unit:p.unit,qty,price:p.price,catalogPrice:p.price,overrideReason:''});
  }
  return {mode:'rules',lines,unresolved};
}
export function seed(){
 const contractor={id:'contractor-demo',name:'Александр Ким',email:'contractor@renolock.demo',role:'contractor'};
 const client={id:'client-demo',name:'Алия Садыкова',email:'client@renolock.demo',role:'client'};
 const prices=[['wall','Выравнивание стен','м²',2500,['выровнять','выравнивание']],['primer','Грунтовка стен','м²',400,['грунтовка','грунтовку','грунтование']],['paint','Покраска стен','м²',1800,['покраска','покрасить']],['socket','Установка розетки','шт',3500,['розетку','розетки','розеток']],['tile','Укладка плитки','м²',6500,['плитка','плитку','плитки']],['wire','Прокладка кабеля','м',900,['кабель','кабеля']]].map(([id,name,unit,price,aliases])=>({id,ownerId:contractor.id,name,unit,price,aliases,active:true}));
 const projects=[{id:'nova',name:'ЖК Nova · квартира 42',address:'Алматы, проспект Абая, 109',contractorId:contractor.id,clientId:client.id,clientEmail:client.email,area:78,createdAt:now(),baseline:[{name:'Черновые работы',unit:'этап',qty:1,price:1200000},{name:'Чистовая отделка',unit:'этап',qty:1,price:850000},{name:'Электрика и сантехника',unit:'этап',qty:1,price:350000}]},{id:'terrace',name:'Дом с террасой',address:'Алматы, Медеуский район',contractorId:contractor.id,clientId:client.id,clientEmail:client.email,area:145,createdAt:now(),baseline:[{name:'Ремонт по договору',unit:'этап',qty:1,price:5800000}]}];
 const item=(id,qty)=>{const p=prices.find(p=>p.id===id);return {priceId:p.id,name:p.name,unit:p.unit,qty,price:p.price,catalogPrice:p.price,overrideReason:''};};
 const estimates=[{id:'estimate-012',projectId:'nova',title:'Подготовка стен в гостиной',description:'Выровнять 20 м2 стен и грунтовка 20 м2',status:'pending',revision:1,lines:[item('wall',20),item('primer',20)],createdAt:now(),updatedAt:now()},{id:'estimate-011',projectId:'nova',title:'Дополнительные розетки на кухне',description:'Установить розетки 6 шт',status:'approved',revision:1,lines:[item('socket',6)],createdAt:now(),updatedAt:now()},{id:'estimate-010',projectId:'terrace',title:'Плитка на террасе',description:'Укладка плитки 12 м2',status:'draft',revision:1,lines:[item('tile',12)],createdAt:now(),updatedAt:now()}];
 const logs=[{id:uid(),projectId:'nova',estimateId:'estimate-012',actor:contractor.name,action:'pending',comment:'На проверку заказчику',revision:1,amount:58000,snapshot:structuredClone(estimates[0].lines),at:now()},{id:uid(),projectId:'nova',estimateId:'estimate-011',actor:client.name,action:'approved',comment:'Согласовано расположение розеток',revision:1,amount:21000,snapshot:structuredClone(estimates[1].lines),at:now()}];
 return {users:[contractor,client],projects,prices,estimates,logs};
}
export function view(state,user){
 ensureMarketplace(state);
 const projects=state.projects.filter(p=>p.contractorId===user.id||p.clientId===user.id),ids=new Set(projects.map(p=>p.id));
 const estimates=state.estimates.filter(e=>ids.has(e.projectId)&&(user.role==='contractor'||e.status!=='draft'));
 const estimateIds=new Set(estimates.map(e=>e.id));
 return {...marketplaceView(state,user),user,projects,estimates,prices:user.role==='contractor'?state.prices.filter(p=>p.ownerId===user.id):[],logs:state.logs.filter(l=>ids.has(l.projectId)&&(user.role==='contractor'||estimateIds.has(l.estimateId)||!l.estimateId)),people:state.users.filter(u=>projects.some(p=>[p.contractorId,p.clientId].includes(u.id))).map(({id,name,role})=>({id,name,role}))};
}
export function mutate(state,user,action,data){
 ensureMarketplace(state);
 if(/^(profile\.|portfolio\.|request\.|review\.|project\.complete$)/.test(action))return marketMutate(state,user,action,data);
 const contractor=()=>assert(user.role==='contractor','Доступно только подрядчику');
 const project=id=>{const p=state.projects.find(p=>p.id===id);assert(p&&(p.contractorId===user.id||p.clientId===user.id),'Проект недоступен');return p;};
 const audit=(p,e,action,comment='')=>state.logs.push({id:uid(),projectId:p.id,estimateId:e?.id||null,actor:user.name,action,comment,revision:e?.revision||1,amount:e?total(e.lines):total(p.baseline),snapshot:structuredClone(e?.lines||p.baseline),at:now()});
 const validateLines=lines=>{assert(Array.isArray(lines)&&lines.length>0&&lines.length<=100,'Добавьте от 1 до 100 позиций');return lines.map(l=>{
  const p=state.prices.find(p=>p.id===l.priceId&&p.ownerId===user.id&&p.active);assert(p,'Позиция прайса недоступна');const qty=number(l.qty,1e6),price=number(l.price);const overrideReason=price!==p.price?text(l.overrideReason,500):'';
  return {priceId:p.id,name:p.name,unit:p.unit,qty,price,catalogPrice:p.price,overrideReason};
 });};
 if(action==='price.save'){
  contractor();const existing=data.id?state.prices.find(p=>p.id===data.id&&p.ownerId===user.id):null;assert(!data.id||existing,'Позиция недоступна');
  assert(['м²','м','шт'].includes(data.unit),'Выберите единицу измерения');
  const price={id:existing?.id||uid(),ownerId:user.id,name:text(data.name),unit:data.unit,price:number(data.price),aliases:(data.aliases||'').split(',').map(a=>a.trim()).filter(Boolean).slice(0,15),active:data.active!==false};
  if(existing)Object.assign(existing,price);else state.prices.push(price);return price;
 }
 if(action==='project.create'){
  contractor();const email=text(data.clientEmail).toLowerCase();const client=state.users.find(u=>u.email===email&&u.role==='client');assert(client,'Клиент должен сначала зарегистрироваться с этим email');
  assert(Array.isArray(data.baseline)&&data.baseline.length>0&&data.baseline.length<=100,'Добавьте начальную смету');
  const baseline=data.baseline.map(l=>({name:text(l.name),unit:text(l.unit,20),qty:number(l.qty,1e6),price:number(l.price)}));
  const p={id:uid(),name:text(data.name),address:text(data.address),clientId:client.id,clientEmail:email,contractorId:user.id,area:number(data.area,1e5),baseline,createdAt:now()};state.projects.push(p);audit(p,null,'project','Создан проект и зафиксирована базовая смета');return p;
 }
 if(action==='estimate.prepare'){contractor();project(data.projectId);return prepare(data.description,state.prices.filter(p=>p.ownerId===user.id));}
 if(action==='estimate.save'){
  contractor();const p=project(data.projectId);assert(p.contractorId===user.id,'Нет доступа');
  assert(!p.completedAt,'Проект завершён');
  const e=data.id?state.estimates.find(e=>e.id===data.id&&e.projectId===p.id):null;assert(!data.id||e,'Смета не найдена');assert(!e||['draft','changes'].includes(e.status),'Эту смету нельзя редактировать');assert(!e||e.revision===data.revision,'Смета уже изменена — обновите страницу');
  const values={title:text(data.title),description:text(data.description,5000),lines:validateLines(data.lines),updatedAt:now()};
  if(e){Object.assign(e,values,{revision:e.revision+1});audit(p,e,'saved','Черновик изменён');return e;}
  const created={id:uid(),projectId:p.id,...values,status:'draft',revision:1,createdAt:now()};state.estimates.push(created);audit(p,created,'draft','Черновик подготовлен подрядчиком');return created;
 }
 if(action==='estimate.transition'){
  const e=state.estimates.find(e=>e.id===data.id);assert(e,'Смета не найдена');const p=project(e.projectId);assert(e.revision===data.revision,'Решение уже принято или смета изменена. Обновите страницу.');
  const transitions=user.role==='contractor'?{draft:['pending'],changes:['pending']}:{pending:['approved','rejected','changes']};
  assert(transitions[e.status]?.includes(data.status),'Недопустимое действие для этой роли или статуса');
  const comment=data.status==='rejected'||data.status==='changes'?text(data.comment,1000):(data.comment||'').slice(0,1000);
  assert(e.lines.length>0,'Пустую смету нельзя отправить');e.status=data.status;e.revision++;e.updatedAt=now();audit(p,e,data.status,comment);return e;
 }
 throw Error('Неизвестное действие');
}
