import {validateFile,fileLimit} from '../dist/attachments.js';
export async function handleFiles(request,env,identity){
 const url=new URL(request.url),send=(status,error)=>Response.json({error},{status,headers:{'Cache-Control':'no-store'}});
 if(!['GET','POST'].includes(request.method))return send(405,'Метод не поддерживается');
 if(request.method==='POST'&&(request.headers.get('origin')!==url.origin||request.headers.get('content-type')!=='application/octet-stream'))return send(403,'Недопустимый источник загрузки');
 if(!env.DB||!env.BUCKET)return send(503,'Хранилище вложений временно недоступно');
 let key=null,committed=false;
 try{
  const load=()=>env.DB.prepare('SELECT json,version FROM renolock_state WHERE id=1').first();
  const row=await load();if(!row)return send(401,'Войдите в аккаунт');let s=JSON.parse(row.json),u=s.users.find(u=>u.id===identity);if(!u||u.blocked)return send(403,'Аккаунт недоступен');
  const member=p=>p&&['client','contractor'].includes(u.role)&&[p.clientId,p.contractorId].includes(u.id);
  if(request.method==='GET'){
   const id=url.pathname.slice('/api/files/'.length),f=(s.files||[]).find(f=>f.id===id),p=s.projects.find(p=>p.id===f?.projectId);
   if(!f||!member(p)||!(f.ownerId===u.id||(s.messages||[]).some(m=>m.projectId===p.id&&m.attachments?.includes(f.id))))return send(404,'Вложение недоступно');
   const object=await env.BUCKET.get(f.key);if(!object)return send(404,'Файл не найден');
   const encoded=encodeURIComponent(f.name).replace(/['()*]/g,c=>'%'+c.charCodeAt(0).toString(16));
   return new Response(object.body,{headers:{'Content-Type':f.type,'Content-Length':String(f.size),'Content-Disposition':`${f.type.startsWith('image/')&&url.searchParams.get('download')!=='1'?'inline':'attachment'}; filename="attachment"; filename*=UTF-8''${encoded}`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"sandbox; default-src 'none'",'Referrer-Policy':'no-referrer'}});
  }
  const projectId=url.searchParams.get('projectId'),p=s.projects.find(p=>p.id===projectId);if(!member(p))return send(403,'Чат доступен только заказчику и подрядчику проекта');if(p.completedAt)return send(403,'Проект завершён. Переписка доступна только для чтения');
  if(Number(request.headers.get('content-length'))>fileLimit)return send(413,'Файл должен быть от 1 байта до 5 МБ');
  const reader=request.body?.getReader();if(!reader)return send(400,'Выберите файл');let length=0;const chunks=[];while(true){const r=await reader.read();if(r.done)break;length+=r.value.length;if(length>fileLimit){await reader.cancel();return send(413,'Файл должен быть от 1 байта до 5 МБ');}chunks.push(r.value);}const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  const info=validateFile(url.searchParams.get('name'),bytes),id=crypto.randomUUID();key=`chat/${projectId}/${id}`;await env.BUCKET.put(key,bytes);
  const f={id,projectId,ownerId:u.id,key,...info,at:new Date().toISOString()};
  for(let attempt=0;attempt<8;attempt++){
   const current=await load();s=JSON.parse(current.json);u=s.users.find(x=>x.id===identity);const project=s.projects.find(x=>x.id===projectId);if(!u||u.blocked||!member(project)||project.completedAt)return send(403,'Загрузка больше недоступна');
   s.files??=[];if(s.files.filter(f=>f.ownerId===u.id&&!s.messages?.some(m=>m.attachments?.includes(f.id))).length>=30)return send(429,'Слишком много неотправленных вложений');s.files.push(f);
   const json=JSON.stringify(s);if(json.length>10000000)return send(413,'Достигнут лимит данных MVP');
   const result=await env.DB.prepare('UPDATE renolock_state SET json=?,version=version+1 WHERE id=1 AND version=?').bind(json,current.version).run();if(result.meta.changes===1){committed=true;return Response.json({file:{id,...info}},{headers:{'Cache-Control':'no-store'}});}
  }
  return send(409,'Данные обновляются. Повторите загрузку');
 }catch(e){return send(400,e.message||'Не удалось загрузить файл');}finally{if(key&&!committed)try{await env.BUCKET.delete(key);}catch{}}
}
