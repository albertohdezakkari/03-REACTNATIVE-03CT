export const LETTERS=['A','B','C','D'];
export const SESSION='DATABRIDGE-20261029';
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function digest(s){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');}
export async function assign(bank,student,session=SESSION){
 const email=student.email.trim().toLowerCase();const seed=await digest(bank.version+'|'+session+'|'+email);let x=parseInt(seed.slice(0,8),16)||1;
 const random=()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296;};
 const shuffle=items=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const questions=shuffle(bank.questions).slice(0,bank.count).map((q,i)=>({number:i+1,questionId:q.id,optionIds:shuffle(q.options.map(o=>o.id))}));
 const variant=(await digest(JSON.stringify({email,session,bankVersion:bank.version,questions}))).slice(0,12).toUpperCase();
 return {schema:'databridge-assignment-v1',bankVersion:bank.version,session,email,studentName:student.name||'',studentGroup:student.group||'',simulation:Boolean(student.simulation),variant,questions};
}
export function validateAssignment(a,bank){
 if(a.schema!=='databridge-assignment-v1'||a.bankVersion!==bank.version||a.questions?.length!==30||!a.email||!a.variant)throw Error('La asignación no corresponde al banco de 30 preguntas.');
 const ids=new Set();for(const [i,row] of a.questions.entries()){const q=bank.questions.find(q=>q.id===row.questionId);if(row.number!==i+1||!q||ids.has(q.id)||new Set(row.optionIds).size!==4||row.optionIds.some(id=>!q.options.some(o=>o.id===id)))throw Error('La asignación contiene preguntas u opciones no válidas.');ids.add(q.id);}return a;
}
export function grade(a,key,answers){
 if(key.bankVersion!==a.bankVersion)throw Error('La clave docente es de otro banco.');
 const rows=a.questions.map((row,i)=>{const k=key.questions.find(k=>k.id===row.questionId);if(!k||!row.optionIds.includes(k.correctOptionId))throw Error('Clave incompleta.');const correct=LETTERS[row.optionIds.indexOf(k.correctOptionId)],answer=answers[i]??'';return {number:i+1,questionId:row.questionId,answer,correct,status:answer==='?'?'revisar':!answer?'blanco':answer===correct?'acierto':'fallo'};});
 const correct=rows.filter(r=>r.status==='acierto').length,review=rows.filter(r=>r.status==='revisar').length;
 return {schema:'databridge-grade-v1',variant:a.variant,email:a.email,session:a.session,bankVersion:a.bankVersion,total:rows.length,correct,incorrect:rows.filter(r=>r.status==='fallo').length,blank:rows.filter(r=>r.status==='blanco').length,review,score10:Math.round(correct/rows.length*1000)/100,score20:Math.round(correct/rows.length*2000)/100,final:review===0,rows};
}
export function download(name,value){const url=URL.createObjectURL(new Blob([typeof value==='string'?value:JSON.stringify(value,null,2)],{type:typeof value==='string'?'text/plain;charset=utf-8':'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function cell(i,j){return {x:(i<15?170:650)+90*j,y:340+58*(i%15)};}
export const MARKERS=[{x:45,y:45},{x:955,y:45},{x:955,y:1355},{x:45,y:1355}];
export function sheetSVG(assignment){
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1400" role="img" aria-label="Plantilla de respuestas 1 a 30"><rect width="1000" height="1400" fill="white"/><g fill="black">'+MARKERS.map(p=>`<rect x="${p.x-15}" y="${p.y-15}" width="30" height="30"/>`).join('')+'</g><g font-family="Arial,sans-serif" fill="black"><text x="90" y="110" font-size="32" font-weight="bold">DATABRIDGE · TEST · 30 PREGUNTAS</text><text x="90" y="165" font-size="21">Correo: '+esc(assignment?.email||'________________________________________________')+'</text><text x="90" y="210" font-size="21">Versión: '+esc(assignment?.variant||'____________________')+' · Sesión: '+esc(assignment?.session||SESSION)+'</text><text x="90" y="255" font-size="18">Marca UNA X en la casilla A, B, C o D de cada fila.</text>'+[0,1].map(c=>LETTERS.map((l,j)=>`<text x="${(c?650:170)+90*j}" y="300" text-anchor="middle" font-size="23">${l}</text>`).join('')).join('')+Array.from({length:30},(_,i)=>`<text x="${i<15?100:580}" y="${cell(i,0).y+7}" text-anchor="middle" font-size="22">${i+1}</text>`+LETTERS.map((_,j)=>`<rect x="${cell(i,j).x-17}" y="${cell(i,j).y-17}" width="34" height="34" fill="none" stroke="black" stroke-width="2"/>`).join('')).join('')+'<text x="90" y="1240" font-size="17">La numeración corresponde a TU versión de preguntas y opciones.</text><text x="90" y="1275" font-size="17">Fotografía la hoja entera y conserva visibles los cuatro cuadrados negros.</text><text x="90" y="1310" font-size="17">Firma: _________________________________________________________</text></g></svg>';
}
export async function prepareOffline(){
 if(!('serviceWorker' in navigator))throw Error('Abre esta página por HTTPS o localhost para preparar el modo sin conexión.');
 const reg=await navigator.serviceWorker.register('../sw-evaluacion.js?v=20261029-student-v3',{updateViaCache:'none'});
 await reg.update();
 let worker=reg.installing||reg.waiting;
 if(worker)await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('No se ha activado la caché actualizada. Pulsa Preparar de nuevo.')),30000);const check=()=>{if(worker.state==='activated'){clearTimeout(timer);resolve();}else if(worker.state==='redundant'){clearTimeout(timer);reject(Error('No se pudo activar la caché. Recarga con Internet y prepara de nuevo.'));}};worker.addEventListener('statechange',check);check();});
 worker=reg.active;if(!worker||worker.state!=='activated')throw Error('No se ha activado la caché actualizada. Recarga con Internet y prepara de nuevo.');
 await new Promise((resolve,reject)=>{const channel=new MessageChannel();const timer=setTimeout(()=>reject(Error('No se ha confirmado la caché. Pulsa Preparar de nuevo.')),30000);channel.port1.onmessage=e=>{clearTimeout(timer);e.data.ok?resolve():reject(Error(e.data.error));};worker.postMessage({type:'PREPARE'},[channel.port2]);});return true;
}
