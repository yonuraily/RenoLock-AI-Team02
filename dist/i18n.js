import {translations} from './translations.js';
let language='ru';
try{const saved=globalThis.localStorage?.getItem('renolock-language');if(['ru','kk','en'].includes(saved))language=saved;}catch{}
export const getLanguage=()=>language;
export const getLocale=()=>({ru:'ru-KZ',kk:'kk-KZ',en:'en-KZ'})[language];
const normalized=new Map();for(const [key,value] of Object.entries(translations))if(!normalized.has(key.toLowerCase()))normalized.set(key.toLowerCase(),value);
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const phrasePattern=new RegExp('(?<![\\p{L}\\p{N}_])(?:'+Object.keys(translations).sort((a,b)=>b.length-a.length).map(escape).join('|')+')(?![\\p{L}\\p{N}_])','giu');
export function translateText(text,lang=language){
 if(lang==='ru'||!text)return text;
 return text.replace(phrasePattern,match=>{const value=normalized.get(match.toLowerCase())?.[lang]||match;return match===match.toUpperCase()?value.toUpperCase():value;});
}
export function setLanguage(lang){if(!['ru','kk','en'].includes(lang))throw Error('Unsupported language');language=lang;try{globalThis.localStorage?.setItem('renolock-language',lang);}catch{}return lang;}
export function initI18n({protectedTexts=()=>new Set()}={}){
 const originals=new WeakMap(),attributes=new WeakMap();let queued=false;
 const selector=document.createElement('nav');selector.className='language-switch';selector.setAttribute('data-no-i18n','');selector.setAttribute('aria-label','Language / Тіл / Язык');
 selector.innerHTML=['ru','kk','en'].map(code=>`<button type="button" data-language="${code}" lang="${code}" title="${({ru:'Русский',kk:'Қазақша',en:'English'})[code]}">${({ru:'RU',kk:'ҚАЗ',en:'EN'})[code]}</button>`).join('');document.body.append(selector);
 const skip=el=>el?.closest('[data-no-i18n],script,style,textarea,input,[contenteditable="true"]');
 function update(){
  observer.disconnect();queued=false;document.documentElement.lang=language;document.title=translateText('RenoLock AI — бюджет под контролем');
  // Keep language controls in the persistent top navigation so they are
  // immediately visible on every dashboard screen. Auth pages still use the
  // fixed top-right fallback because they do not render a dashboard header.
  const topbar=document.querySelector('.topbar-right'),host=topbar||document.body;
  if(selector.parentElement!==host)host.append(selector);
  const protectedSet=protectedTexts();
  // Preserve option identifiers before translating their visible labels.
  for(const option of document.querySelectorAll('option'))if(!option.hasAttribute('value'))option.setAttribute('value',option.textContent);
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
  while(node=walker.nextNode()){
   if(skip(node.parentElement))continue;
   const old=originals.get(node),current=node.nodeValue;
   const raw=old&&current===old.output?old.raw:current;
   const output=protectedSet.has(raw.trim())?raw:translateText(raw);
   if(current!==output)node.nodeValue=output;originals.set(node,{raw,output});
  }
  for(const el of document.querySelectorAll('[placeholder],[title],[aria-label]')){
   if(skip(el))continue;let saved=attributes.get(el)||{};
   for(const key of ['placeholder','title','aria-label'])if(el.hasAttribute(key)){
    const current=el.getAttribute(key),old=saved[key],raw=old&&old.output===current?old.raw:current;
    const output=translateText(raw);if(current!==output)el.setAttribute(key,output);saved[key]={raw,output};
   }attributes.set(el,saved);
  }
  for(const button of selector.querySelectorAll('button')){button.classList.toggle('selected',button.dataset.language===language);button.setAttribute('aria-pressed',String(button.dataset.language===language));}
  observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label','open']});
 }
 const observer=new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(update);}});
 selector.addEventListener('click',event=>{const button=event.target.closest('[data-language]');if(!button)return;setLanguage(button.dataset.language);update();document.dispatchEvent(new CustomEvent('renolock-language-change',{detail:{language}}));});
 update();return {update};
}
