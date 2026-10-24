const check=(v,m)=>{if(!v)throw Error(m);},stamp=()=>new Date().toISOString();
const note=v=>{check(typeof v==='string'&&v.trim()&&v.length<=2000,'Добавьте комментарий до 2000 символов');return v.trim();};
export function ensureLifecycle(s){s.notifications??=[];return s;}
export function calendarToday(at=Date.now()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Qyzylorda',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(at));}
export function lateDays(end,today=calendarToday()){return /^\d{4}-\d{2}-\d{2}$/.test(end||'')?Math.max(0,Math.floor((Date.parse(today)-Date.parse(end))/86400000)):0;}
function validDate(value){check(typeof value==='string'&&/^20\d{2}-\d{2}-\d{2}$/.test(value),'Укажите дату в формате ГГГГ-ММ-ДД');const time=Date.parse(value);check(Number.isFinite(time)&&new Date(time).toISOString().slice(0,10)===value,'Некорректная календарная дата');return value;}
function target(s,u,d){
 check(['project','estimate'].includes(d.scope),'Выберите вид работ');const t=d.scope==='project'?s.projects.find(p=>p.id===d.id):s.estimates.find(e=>e.id===d.id&&e.status==='approved');check(t,'Работы недоступны');
 const p=d.scope==='project'?t:s.projects.find(p=>p.id===t.projectId);check(p&&[p.contractorId,p.clientId].includes(u.id),'Проект недоступен');check(!p.completedAt,'Проект завершён');return {t,p};
}
export function lifecycleView(s,u,payload){const projects=new Set(payload.projects.map(p=>p.id)),requests=new Set((payload.requests||[]).map(r=>r.id));return {...payload,notifications:(s.notifications||[]).filter(n=>n.userId===u.id&&(!n.projectId||projects.has(n.projectId))&&(!n.requestId||requests.has(n.requestId))).slice().reverse()};}
export function canClose(s,p){check(p.acceptance?.status==='accepted','Сначала примите основные работы проекта');check(!s.estimates.some(e=>e.projectId===p.id&&e.status==='approved'&&e.acceptance?.status!=='accepted'),'Сначала примите все согласованные дополнительные работы');}
export function lifecycleMutate(s,u,action,d){
 ensureLifecycle(s);
 if(action==='notification.read'){
  const own=s.notifications.filter(n=>n.userId===u.id&&(d.all===true||n.id===d.id));check(d.all===true||own.length,'Уведомление недоступно');for(const n of own)n.readAt??=stamp();return {ok:true};
 }
 check(['client','contractor'].includes(u.role),'Действие доступно участникам проекта');const {t,p}=target(s,u,d),contractor=()=>check(u.role==='contractor'&&p.contractorId===u.id,'Доступно только подрядчику проекта'),client=()=>check(u.role==='client'&&p.clientId===u.id,'Решение принимает только заказчик проекта');
 if(action==='schedule.propose'){
  contractor();check(!['awaiting','accepted'].includes(t.acceptance?.status),'Работы переданы на приёмку или приняты');check(d.version===(t.scheduleVersion||0),'Сроки уже изменены. Обновите данные.');const start=validDate(d.start),end=validDate(d.end);check(start<=end,'Окончание не может быть раньше начала');const reason=note(d.reason);
  t.schedule??={history:[]};t.scheduleVersion=(t.scheduleVersion||0)+1;t.schedule.pending={start,end,reason,at:stamp(),actor:u.name};t.schedule.history.push({...t.schedule.pending,event:'proposed',version:t.scheduleVersion});return {projectId:p.id};
 }
 if(action==='schedule.decide'){
  client();check(d.version===t.scheduleVersion&&t.schedule?.pending,'Предложение сроков уже изменено');check(['approved','rejected'].includes(d.decision),'Выберите решение');const proposal=t.schedule.pending,reason=d.decision==='rejected'?note(d.reason):'';
  if(d.decision==='approved'){t.schedule.start=proposal.start;t.schedule.end=proposal.end;t.schedule.agreedAt=stamp();}
  t.scheduleVersion++;t.schedule.history.push({...proposal,event:d.decision,decisionReason:reason,actor:u.name,at:stamp(),version:t.scheduleVersion});t.schedule.pending=null;return {projectId:p.id};
 }
 if(action==='work.status'){
  contractor();check(d.scope==='project','Для допработ используйте статус сметы');check(!['awaiting','accepted'].includes(t.acceptance?.status),'Работы переданы на приёмку или приняты');check(['not_started','in_progress'].includes(d.status),'Выберите статус работ');check(d.version===(t.executionVersion||0),'Работы уже изменены');t.executionVersion=(t.executionVersion||0)+1;t.execution={status:d.status,at:stamp(),actor:u.name};return {projectId:p.id};
 }
 if(action==='acceptance.submit'){
  contractor();check(!['awaiting','accepted'].includes(t.acceptance?.status),'Работы уже переданы на приёмку или приняты');check(d.version===(t.acceptanceVersion||0),'Приёмка уже изменена');check(t.schedule?.end,'Сначала согласуйте сроки работ');check(!t.schedule.pending,'Сначала завершите согласование переноса сроков');const report=note(d.report);
  t.acceptanceVersion=(t.acceptanceVersion||0)+1;t.acceptance={status:'awaiting',report,submittedAt:stamp(),actor:u.name};t.acceptanceHistory??=[];t.acceptanceHistory.push({...t.acceptance,event:'submitted',at:stamp(),version:t.acceptanceVersion});t.execution={status:'done',delayDays:0,actor:u.name,at:stamp()};t.executionVersion=(t.executionVersion||0)+1;return {projectId:p.id};
 }
 if(action==='acceptance.decide'){
  client();check(t.acceptance?.status==='awaiting'&&d.version===t.acceptanceVersion,'Запрос приёмки уже изменён');check(['accepted','changes'].includes(d.decision),'Выберите решение');const reason=d.decision==='changes'?note(d.reason):'';
  t.acceptanceVersion++;t.acceptance={...t.acceptance,status:d.decision,reason,decidedAt:stamp(),actor:u.name};t.acceptanceHistory.push({...t.acceptance,event:d.decision,at:stamp(),version:t.acceptanceVersion});return {projectId:p.id};
 }
 throw Error('Неизвестное действие');
}
export function notifyMutation(s,u,action,d,result){
 ensureLifecycle(s);let p=null,r=null,e=null,title='';
 if(action.startsWith('request.')){r=s.requests.find(r=>r.id===(result?.id||d.id));title=({'request.create':'Новая заявка на ремонт','request.quote':'Получено предложение','request.accept':'Предложение принято: проект создан','request.decline':'Заявка отклонена'})[action];if(r?.projectId)p=s.projects.find(p=>p.id===r.projectId);}
 if(action==='project.create'||action==='project.complete'){p=s.projects.find(p=>p.id===(result?.id||d.id));title=action==='project.create'?'Вы добавлены в проект':'Заказчик завершил проект';}
 if(action==='estimate.transition'||action==='estimate.progress'){e=s.estimates.find(e=>e.id===d.id);p=s.projects.find(p=>p.id===e?.projectId);title=action==='estimate.progress'?'Обновлён ход работ':({'pending':'Новая смета на согласование','approved':'Смета согласована','rejected':'Смета отклонена','changes':'Запрошены изменения сметы'})[d.status];}
 if(/^(schedule\.|acceptance\.|work\.)/.test(action)){e=d.scope==='estimate'?s.estimates.find(e=>e.id===d.id):null;p=s.projects.find(p=>p.id===(d.scope==='project'?d.id:e?.projectId));title=({'schedule.propose':'Новые сроки на согласование','schedule.decide':d.decision==='approved'?'Сроки согласованы':'Сроки отклонены','acceptance.submit':'Работы готовы к приёмке','acceptance.decide':d.decision==='accepted'?'Работы приняты':'Нужны исправления работ','work.status':'Обновлён ход основных работ'})[action];}
 if(!title||(!p&&!r))return;
 const recipients=new Set(p?[p.clientId,p.contractorId,p.managerId]:[r.clientId,r.contractorId]);recipients.delete(u.id);recipients.delete(undefined);recipients.delete(null);
 for(const userId of recipients)s.notifications.push({id:crypto.randomUUID(),userId,title,projectId:p?.id||null,requestId:!p?r?.id||null:null,estimateId:e?.id||null,context:e?.title||p?.name||r?.title||'',actor:u.name,at:stamp(),readAt:null});
}
