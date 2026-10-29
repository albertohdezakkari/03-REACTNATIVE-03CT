// Secciones 04–08 del menú lateral, ocultas por indicación del docente.
const HIDDEN_SECTIONS = new Set(['caso3', 'caso4', 'caso5', 'caso6', 'consultas', 'test', 'challenge', 'rubrica']);
const VISIBLE_PAGES = PAGES.filter(page => !HIDDEN_SECTIONS.has(page.id));
const PROGRESS_TOTAL = VISIBLE_PAGES.filter(page => page.id !== 'docente').length;
const KEY='databridge-autoria-web-v1';
function readSaved(){try{return JSON.parse(localStorage.getItem(KEY))||{done:[],notes:{},checks:{}}}catch{return {done:[],notes:{},checks:{}}}}
let state=readSaved(),quizTick,current='inicio';
state.done=Array.isArray(state.done)?state.done:[];state.notes=state.notes||{};state.checks=state.checks||{};
const $=s=>document.querySelector(s),safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));$('#saved').textContent='Guardado local'}catch{$('#saved').textContent='No se pudo guardar'}}
function toast(s){$('#toast').textContent=s;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2200)}
function download(name,data){const u=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function nav(){const done=state.done.filter(id=>VISIBLE_PAGES.some(p=>p.id===id)&&id!=='docente').length;$('#progress').max=PROGRESS_TOTAL;$('#progress').value=done;$('#progressText').textContent=done+' / '+PROGRESS_TOTAL;$('#nav').innerHTML=VISIBLE_PAGES.map((p,i)=>'<a href="#'+p.id+'" '+(p.id===current?'aria-current="page" class="active"':'')+'><span class="nav-number">'+String(PAGES.indexOf(p)).padStart(2,'0')+'</span><span>'+safe(p.title)+'</span>'+(state.done.includes(p.id)?'<span class="nav-done" aria-label="Trabajado">✓</span>':'')+'</a>').join('')}
function bindContent(){document.querySelectorAll('[data-note]').forEach(el=>{el.value=state.notes[el.dataset.note]||'';el.addEventListener('input',()=>{state.notes[el.dataset.note]=el.value;save()})});document.querySelectorAll('[data-check]').forEach(el=>{el.checked=!!state.checks[el.dataset.check];el.addEventListener('change',()=>{state.checks[el.dataset.check]=el.checked;save()})});document.querySelectorAll('.code-label').forEach(label=>{const b=document.createElement('button');b.className='copy';b.textContent='Copiar';b.onclick=async()=>{const text=label.nextElementSibling.textContent;try{await navigator.clipboard.writeText(text);toast('Código copiado')}catch{toast('Selecciona el código y cópialo con Ctrl+C')}};label.append(b)});}
function render(){
  clearInterval(quizTick);
  window.PracticeNotebook?.unmount();
  const hash=location.hash.slice(1);if(HIDDEN_SECTIONS.has(hash))history.replaceState(null,'','#inicio');current=VISIBLE_PAGES.some(p=>p.id===hash)?hash:'inicio';
  const p=VISIBLE_PAGES.find(p=>p.id===current);
  document.title=p.title+' · DataBridge';
  document.body.classList.toggle('notebook-mode',current!=='test');
  $('#contenido').innerHTML='<header class="page-head"><div class="eyebrow">'+safe(p.kicker)+'</div><h1>'+safe(p.title)+'</h1><p class="lead">'+safe(p.lead)+'</p></header>'+p.body;
  nav();
  const i=VISIBLE_PAGES.indexOf(p);
  $('#prev').disabled=i===0;$('#next').disabled=i===VISIBLE_PAGES.length-1;
  $('#prev').textContent='← Anterior';$('#next').textContent='Siguiente →';
  $('#prev').onclick=()=>{if(i>0)location.hash=VISIBLE_PAGES[i-1].id};
  $('#next').onclick=()=>{if(i<VISIBLE_PAGES.length-1)location.hash=VISIBLE_PAGES[i+1].id};
  $('#complete').textContent=state.done.includes(current)?'✓ Trabajado':'Marcar como trabajado';
  $('#complete').disabled=current==='docente';
  $('#sidebar').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');
  if(current!=='test')window.PracticeNotebook.mount({main:$('#contenido'),pageId:current,state,save,bind:bindContent});
  else{bindContent();}
  window.scrollTo(0,0);
}
$('#prev').onclick=()=>{const i=VISIBLE_PAGES.findIndex(p=>p.id===current);if(i>0)location.hash=VISIBLE_PAGES[i-1].id};$('#next').onclick=()=>{const i=VISIBLE_PAGES.findIndex(p=>p.id===current);if(i<VISIBLE_PAGES.length-1)location.hash=VISIBLE_PAGES[i+1].id};$('#complete').onclick=()=>{state.done=state.done.includes(current)?state.done.filter(p=>p!==current):[...state.done,current];save();nav();$('#complete').textContent=state.done.includes(current)?'✓ Trabajado':'Marcar como trabajado'};$('#menu').onclick=()=>{$('#sidebar').classList.toggle('open');$('#menu').setAttribute('aria-expanded',String($('#sidebar').classList.contains('open')))};$('#print').onclick=()=>window.print();$('#exportNotes').onclick=()=>download('databridge-mis-notas.json',{version:1,fecha:new Date().toISOString(),notas:state.notes,comprobaciones:state.checks,trabajado:state.done});window.addEventListener('hashchange',render);
window.addEventListener('notebook-toast',e=>toast(e.detail));
render();
