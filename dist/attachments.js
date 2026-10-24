export const fileLimit=5*1024*1024;
export const fileAccept='.jpg,.jpeg,.png,.webp,.pdf,.docx,.xlsx,.txt,.csv';
export function validateFile(name,bytes){
 if(typeof name!=='string'||!name.trim()||name.length>180||/[\x00-\x1f\x7f/\\]/.test(name))throw Error('Некорректное имя файла');
 if(!bytes.length||bytes.length>fileLimit)throw Error('Файл должен быть от 1 байта до 5 МБ');
 const ext=name.split('.').pop().toLowerCase(),b=bytes,starts=(...v)=>v.every((n,i)=>b[i]===n),types={jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',pdf:'application/pdf',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',txt:'text/plain',csv:'text/csv'};
 if(!types[ext])throw Error('Разрешены JPG, PNG, WebP, PDF, DOCX, XLSX, TXT и CSV');
 const valid=['jpg','jpeg'].includes(ext)?starts(255,216,255):ext==='png'?starts(137,80,78,71,13,10,26,10):ext==='webp'?starts(82,73,70,70)&&b[8]===87&&b[9]===69&&b[10]===66&&b[11]===80:ext==='pdf'?starts(37,80,68,70,45):['docx','xlsx'].includes(ext)?starts(80,75,3,4):!b.includes(0);
 if(!valid)throw Error('Содержимое не соответствует типу файла');return {name:name.trim(),type:types[ext],size:b.length};
}
