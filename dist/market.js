// Marketplace state is added without resetting existing projects or decisions.
const id=()=>crypto.randomUUID(),at=()=>new Date().toISOString();
const ok=(v,m)=>{if(!v)throw Error(m);};
const str=(v,max=200)=>{ok(typeof v==='string'&&v.trim()&&v.length<=max,'Проверьте текстовые поля');return v.trim();};
const num=(v,min=0,max=1e9)=>{ok(typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max,'Проверьте числовые значения');return v;};
const sum=lines=>Math.round(lines.reduce((s,l)=>s+Math.round(l.qty*l.price*100),0))/100;
export const repairClasses=['Эконом','Стандарт','Премиум'];
export const requestStatuses={requested:'Ожидает предложения',quoted:'Предложение получено',accepted:'Проект создан',declined:'Отклонено'};
export function ensureMarketplace(s){
 if(s.marketVersion===1)return s;
 s.profiles??=[];s.requests??=[];s.reviews??=[];
 const samples=[
  ['studio','contractor-demo','Reno Studio','Бригада','Алматы','Ремонт под ключ',8,28000,['Стандарт','Премиум'],40,250,'Продуманный ремонт квартир: от черновых работ до чистовой отделки. Один ответственный за весь проект.','sage'],
  ['comfort','comfort-demo','Комфорт Ремонт','Бригада','Алматы','Ремонт под ключ',12,16000,['Эконом','Стандарт'],20,180,'Практичный ремонт без лишних расходов. Поможем выбрать материалы и зафиксировать состав работ.','sand'],
  ['forma','forma-demo','FORMA Interiors','Бригада','Астана','Ремонт под ключ',10,45000,['Премиум'],60,400,'Реализация дизайнерских интерьеров, сложные материалы и внимание к деталям.','clay'],
  ['electric','electric-demo','Данияр · электрик','Специалист','Алматы','Электрика',9,4500,['Эконом','Стандарт','Премиум'],10,300,'Электромонтаж в квартирах и домах: разводка, щиты, розетки и освещение.','blue'],
  ['finish','finish-demo','Марат · отделочные работы','Специалист','Астана','Отделка стен',6,6500,['Эконом','Стандарт'],15,150,'Подготовка стен, штукатурка и покраска. Работаю с небольшими объектами и отдельными комнатами.','sage'],
  ['tilepro','tile-demo','Tile Pro','Специалист','Алматы','Плитка и санузлы',11,12000,['Стандарт','Премиум'],5,100,'Укладка плитки и керамогранита, подготовка основания и отделка санузлов.','sand']
 ];
 for(const [pid,ownerId,name,type,city,specialty,experience,rate,classes,minArea,maxArea,bio,palette] of samples){
  if(!s.users.some(u=>u.id===ownerId))s.users.push({id:ownerId,name,email:ownerId+'@renolock.demo',role:'contractor'});
  s.profiles.push({id:pid,ownerId,name,type,city,specialty,experience,rate,repairClasses:classes,minArea,maxArea,bio,active:true,demo:true,portfolio:[{id:id(),title:specialty==='Ремонт под ключ'?'Квартира для семьи':'Завершённый объект',description:`${city} · ${specialty} · пример портфолио`,palette},{id:id(),title:'Детали отделки',description:'Пример визуального оформления проекта',palette:palette==='sage'?'sand':'sage'}]});
  // Synthetic reviews are labelled separately from completed-project reviews.
  for(const [j,rating] of [5,5,4].entries())s.reviews.push({id:id(),profileId:pid,author:['Алия','Ерлан','Мария'][j],rating:pid==='comfort'&&j===0?4:rating,text:['Понятная смета и внимательное отношение к деталям.','Все дополнительные работы обсуждали заранее.','Понравилось, что изменения бюджета были прозрачными.'][j],demo:true,at:at()});
 }
 s.marketVersion=1;return s;
}
export function marketplaceView(s,user){ensureMarketplace(s);return {profiles:s.profiles.filter(p=>(p.active&&!p.moderationHidden&&!s.users.find(u=>u.id===p.ownerId)?.blocked)||p.ownerId===user.id),requests:s.requests.filter(r=>r.clientId===user.id||r.contractorId===user.id),reviews:s.reviews.filter(r=>!r.hidden)};}
export function findProfiles(profiles,reviews,f={}){
 return profiles.filter(p=>p.active&&!p.moderationHidden&&(!f.q||(p.name+' '+p.specialty+' '+p.bio).toLowerCase().includes(f.q.toLowerCase()))&&(!f.city||p.city===f.city)&&(!f.type||p.type===f.type)&&(!f.specialty||p.specialty===f.specialty)&&(!f.repairClass||p.repairClasses.includes(f.repairClass))&&(!f.maxRate||p.rate<=Number(f.maxRate))&&(!f.area||(Number(f.area)>=p.minArea&&Number(f.area)<=p.maxArea))).sort((a,b)=>f.sort==='price'?a.rate-b.rate:f.sort==='rating'?ratingOf(b,reviews).average-ratingOf(a,reviews).average:b.experience-a.experience);
}
export function ratingOf(p,reviews){const rows=reviews.filter(r=>r.profileId===p.id&&!r.hidden);return {count:rows.length,average:rows.length?rows.reduce((s,r)=>s+r.rating,0)/rows.length:0,verified:rows.filter(r=>!r.demo).length};}
export function marketMutate(s,user,action,d){ensureMarketplace(s);
 const client=()=>ok(user.role==='client','Доступно только заказчику');const contractor=()=>ok(user.role==='contractor','Доступно только подрядчику');
 if(action==='profile.save'){
  contractor();const p=s.profiles.find(p=>p.ownerId===user.id);const classes=d.repairClasses;ok(Array.isArray(classes)&&classes.length&&classes.every(c=>repairClasses.includes(c)),'Выберите класс ремонта');ok(['Бригада','Специалист'].includes(d.type),'Выберите тип исполнителя');
  const values={name:str(d.name),type:d.type,city:str(d.city,80),specialty:str(d.specialty,100),experience:num(d.experience,0,60),rate:num(d.rate,.01),minArea:num(d.minArea,1,1e5),maxArea:num(d.maxArea,1,1e5),bio:str(d.bio,2000),repairClasses:[...new Set(classes)],active:d.active!==false};ok(values.maxArea>=values.minArea,'Максимальная площадь меньше минимальной');
  if(p){Object.assign(p,values);return p;}const created={id:id(),ownerId:user.id,...values,portfolio:[],demo:false};s.profiles.push(created);return created;
 }
 if(action==='portfolio.add'){
  contractor();const p=s.profiles.find(p=>p.ownerId===user.id);ok(p,'Сначала создайте профиль');ok(p.portfolio.length<12,'Не более 12 работ');ok(['sage','sand','clay','blue'].includes(d.palette),'Выберите оформление');
  let image='';if(d.image){ok(typeof d.image==='string'&&d.image.length<=550000&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(d.image),'Допускаются PNG, JPEG, WebP до 400 КБ');const raw=atob(d.image.split(',')[1]);ok(raw.startsWith('\x89PNG\r\n\x1a\n')||raw.startsWith('\xff\xd8\xff')||(raw.startsWith('RIFF')&&raw.slice(8,12)==='WEBP'),'Некорректное изображение');image=d.image;}
  const entry={id:id(),title:str(d.title),description:str(d.description,1000),palette:d.palette,image};p.portfolio.push(entry);return entry;
 }
 if(action==='request.create'){
  client();const p=s.profiles.find(p=>p.id===d.profileId&&p.active&&!p.moderationHidden&&!s.users.find(u=>u.id===p.ownerId)?.blocked);ok(p,'Исполнитель недоступен');const area=num(d.area,1,1e5);ok(area>=p.minArea&&area<=p.maxArea,'Площадь не входит в диапазон исполнителя');ok(p.repairClasses.includes(d.repairClass),'Этот класс ремонта не предлагается');
  const r={id:id(),profileId:p.id,contractorId:p.ownerId,clientId:user.id,clientName:user.name,clientEmail:user.email,contractorName:p.name,title:str(d.title),address:str(d.address),description:str(d.description,3000),area,repairClass:d.repairClass,targetBudget:num(d.targetBudget,1),status:'requested',revision:1,events:[],createdAt:at(),updatedAt:at()};r.events.push({actor:user.name,status:r.status,at:at(),comment:r.description});s.requests.push(r);return r;
 }
 if(action.startsWith('request.')){
  const r=s.requests.find(r=>r.id===d.id);ok(r&&(r.clientId===user.id||r.contractorId===user.id),'Заявка недоступна');ok(d.revision===r.revision,'Заявка уже изменена. Обновите данные.');
  if(action==='request.quote'){
   contractor();ok(r.contractorId===user.id&&r.status==='requested','Нельзя отправить предложение');ok(Array.isArray(d.lines)&&d.lines.length>0&&d.lines.length<=100,'Добавьте от 1 до 100 строк сметы');
   const lines=d.lines.map(l=>({name:str(l.name),unit:str(l.unit,20),qty:num(l.qty,.01,1e6),price:num(l.price,.01)}));r.quote={lines,comment:str(d.comment,2000),amount:sum(lines)};r.status='quoted';
  }else if(action==='request.accept'){
   client();ok(r.clientId===user.id&&r.status==='quoted'&&r.quote,'Нет предложения для принятия');
   const p={id:id(),name:r.title,address:r.address,contractorId:r.contractorId,clientId:r.clientId,clientEmail:r.clientEmail,area:r.area,repairClass:r.repairClass,sourceRequestId:r.id,baseline:structuredClone(r.quote.lines),createdAt:at()};s.projects.push(p);r.projectId=p.id;r.status='accepted';
   s.logs.push({id:id(),projectId:p.id,estimateId:null,actor:user.name,action:'project',comment:'Заказчик выбрал исполнителя и принял первоначальную смету',revision:1,amount:sum(p.baseline),snapshot:structuredClone(p.baseline),at:at()});
  }else if(action==='request.decline'){
   ok(['requested','quoted'].includes(r.status),'Заявка уже завершена');str(d.comment,1000);r.status='declined';
  }else throw Error('Неизвестное действие');
  r.revision++;r.updatedAt=at();r.events.push({actor:user.name,status:r.status,comment:action==='request.quote'?r.quote.comment:d.comment||'Первоначальная смета принята',at:at(),amount:r.quote?.amount});return r;
 }
 if(action==='project.complete'){
  client();const p=s.projects.find(p=>p.id===d.id&&p.clientId===user.id);ok(p,'Проект недоступен');ok(!p.completedAt,'Проект уже завершён');ok(!s.estimates.some(e=>e.projectId===p.id&&['pending','changes','draft'].includes(e.status)),'Сначала завершите согласование всех дополнительных смет');ok(!s.estimates.some(e=>e.projectId===p.id&&e.status==='approved'&&e.execution?.status!=='done'),'Сначала подрядчик должен завершить согласованные работы');p.completedAt=at();return p;
 }
 if(action==='review.create'){
  client();const p=s.projects.find(p=>p.id===d.projectId&&p.clientId===user.id);ok(p?.completedAt,'Отзыв доступен после завершения совместного проекта');const profile=s.profiles.find(x=>x.ownerId===p.contractorId);ok(profile,'Профиль исполнителя не найден');ok(!s.reviews.some(r=>r.projectId===p.id),'Отзыв на этот проект уже оставлен');num(d.rating,1,5);ok(Number.isInteger(d.rating),'Выберите целую оценку от 1 до 5');const review={id:id(),projectId:p.id,profileId:profile.id,author:user.name,rating:d.rating,text:str(d.text,2000),demo:false,at:at()};s.reviews.push(review);return review;
 }
 throw Error('Неизвестное действие');
}
