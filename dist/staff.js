const id=()=>crypto.randomUUID(),now=()=>new Date().toISOString();
const ok=(condition,message)=>{if(!condition)throw Error(message);};
const text=(s,max=1000)=>{ok(typeof s==='string'&&s.trim()&&s.length<=max,'Проверьте текстовые поля');return s.trim();};
export const stages={planning:'Планирование',preparation:'Подготовка объекта',in_progress:'Основные работы',finishing:'Финишная отделка'};
export const taskStates={todo:'К выполнению',doing:'В процессе',done:'Выполнено'};
export const roleNames={client:'Заказчик',contractor:'Подрядчик',manager:'Менеджер',admin:'Администратор'};
export const isStaff=user=>['manager','admin'].includes(user.role);
export function ensureStaff(s){
 if(s.staffVersion===1)return s;
 for(const u of [{id:'manager-demo',name:'Дана Омарова',email:'manager@renolock.demo',role:'manager'},{id:'admin-demo',name:'Администратор RenoLock',email:'admin@renolock.demo',role:'admin'}])if(!s.users.some(x=>x.id===u.id))s.users.push(u);
 s.staffAudit??=[];s.projectNotes??=[];s.tasks??=[];
 for(const p of s.projects){p.stage??='planning';if(['nova','terrace'].includes(p.id))p.managerId??='manager-demo';}
 if(!s.tasks.length&&s.projects.some(p=>p.id==='nova'))s.tasks.push({id:id(),projectId:'nova',title:'Проверить статус согласования дополнительных работ',dueDate:new Date().toISOString().slice(0,10),status:'todo',createdBy:'manager-demo',createdAt:now()});
 s.staffVersion=1;return s;
}
export function staffView(s,u){
 const projects=s.projects.filter(p=>u.role==='admin'||p.managerId===u.id),ids=new Set(projects.map(p=>p.id));
 const estimates=s.estimates.filter(e=>ids.has(e.projectId)&&(u.role==='admin'||e.status!=='draft')),visible=new Set(estimates.map(e=>e.id));
 const userIds=new Set(projects.flatMap(p=>[p.contractorId,p.clientId,p.managerId]));userIds.add(u.id);
 return {user:u,projects,estimates,requests:s.requests.filter(r=>u.role==='admin'||ids.has(r.projectId)),prices:[],profiles:u.role==='admin'?s.profiles:s.profiles.filter(p=>userIds.has(p.ownerId)),reviews:u.role==='admin'?s.reviews:[],logs:s.logs.filter(l=>ids.has(l.projectId)&&(u.role==='admin'||!l.estimateId||visible.has(l.estimateId))),people:s.users.filter(x=>u.role==='admin'||userIds.has(x.id)).map(({id,name,email,role,blocked})=>({id,name,email,role,blocked:!!blocked})),accounts:u.role==='admin'?s.users.map(({id,name,email,role,blocked})=>({id,name,email,role,blocked:!!blocked})):[],managers:u.role==='admin'?s.users.filter(x=>x.role==='manager'&&!x.blocked).map(({id,name})=>({id,name})):[],tasks:s.tasks.filter(t=>ids.has(t.projectId)),projectNotes:s.projectNotes.filter(n=>ids.has(n.projectId)),staffAudit:s.staffAudit.filter(a=>u.role==='admin'||a.actorId===u.id)};
}
export function staffMutate(s,u,action,d){
 const admin=()=>ok(u.role==='admin','Доступно только администратору');
 const project=pid=>{const p=s.projects.find(p=>p.id===pid);ok(p&&(u.role==='admin'||(u.role==='manager'&&p.managerId===u.id)),'Проект не назначен этому менеджеру');return p;};
 const audit=(type,targetId,comment,before,after)=>s.staffAudit.push({id:id(),actorId:u.id,actor:u.name,type,targetId,comment,before,after,at:now()});
 if(action==='admin.user.status'){
  admin();const target=s.users.find(x=>x.id===d.id);ok(target&&target.id!==u.id&&target.role!=='admin','Нельзя заблокировать администратора или собственный аккаунт');ok(typeof d.blocked==='boolean','Укажите статус аккаунта');const comment=text(d.comment),before=!!target.blocked;target.blocked=d.blocked;audit('account',target.id,comment,before,d.blocked);return {id:target.id,blocked:target.blocked};
 }
 if(action==='admin.user.role'){
  admin();const target=s.users.find(x=>x.id===d.id);ok(target&&target.id!==u.id&&target.role!=='admin','Изменение этой роли недоступно');ok(['client','manager'].includes(d.role),'Доступно назначение менеджера или возврат роли клиента');
  ok(!s.projects.some(p=>[p.clientId,p.contractorId,p.managerId].includes(target.id))&&!s.requests.some(r=>[r.clientId,r.contractorId].includes(target.id))&&!s.profiles.some(p=>p.ownerId===target.id),'Сначала снимите назначения. Участнику проектов или исполнителю нельзя менять роль');const comment=text(d.comment),before=target.role;target.role=d.role;audit('role',target.id,comment,before,d.role);return {id:target.id,role:target.role};
 }
 if(action==='admin.project.assign'){
  admin();const p=project(d.projectId),manager=d.managerId?s.users.find(x=>x.id===d.managerId&&x.role==='manager'&&!x.blocked):null;ok(!d.managerId||manager,'Менеджер недоступен');const before=p.managerId||null;p.managerId=manager?.id||null;audit('assignment',p.id,'Назначение менеджера',before,p.managerId);return p;
 }
 if(action==='admin.profile.moderate'||action==='admin.review.moderate'){
  admin();const isProfile=action==='admin.profile.moderate',record=(isProfile?s.profiles:s.reviews).find(x=>x.id===d.id);ok(record,isProfile?'Профиль исполнителя не найден':'Отзыв не найден');ok(typeof d.hidden==='boolean','Укажите статус публикации');const reason=text(d.reason),key=isProfile?'moderationHidden':'hidden',before=!!record[key];record[key]=d.hidden;record.moderationReason=reason;audit(isProfile?'profile':'review',record.id,reason,before,d.hidden);return {id:record.id,hidden:record[key]};
 }
 ok(isStaff(u),'Доступно только сотруднику платформы');
 if(action==='manager.project.stage'){
  const p=project(d.id);ok(!p.completedAt,'Проект завершён');ok(Object.hasOwn(stages,d.stage),'Выберите этап проекта');const before=p.stage||'planning';p.stage=d.stage;audit('stage',p.id,'Этап проекта обновлён',before,p.stage);return p;
 }
 if(action==='manager.note.add'){
  const p=project(d.projectId),note={id:id(),projectId:p.id,actor:u.name,actorId:u.id,text:text(d.text,2000),at:now()};s.projectNotes.push(note);audit('note',p.id,'Добавлена внутренняя заметка',null,note.id);return note;
 }
 if(action==='manager.task.create'){
  const p=project(d.projectId);ok(!p.completedAt,'Проект завершён');ok(typeof d.dueDate==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d.dueDate)&&!Number.isNaN(Date.parse(d.dueDate))&&new Date(d.dueDate).toISOString().slice(0,10)===d.dueDate,'Укажите корректную дату');const task={id:id(),projectId:p.id,title:text(d.title,200),dueDate:d.dueDate,status:'todo',createdBy:u.id,createdAt:now()};s.tasks.push(task);audit('task',p.id,'Создана задача',null,task.id);return task;
 }
 if(action==='manager.task.status'){
  const task=s.tasks.find(t=>t.id===d.id);ok(task,'Задача не найдена');project(task.projectId);ok(Object.hasOwn(taskStates,d.status),'Выберите статус задачи');const before=task.status;task.status=d.status;audit('task',task.projectId,'Статус задачи обновлён',before,task.status);return task;
 }
 throw Error('Неизвестное действие');
}
