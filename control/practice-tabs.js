/* Cuaderno de altura fija: pasos y archivos en pestañas; texto y código paginados. */
window.PracticeNotebook = (() => {
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let cleanup = () => {};
  const stepNames = ['Diagrama','Preparar','Conexión','Entities','Repository / Service','Controller','Módulos','API','SQL','Pantalla','Reinicio','Repetir'];
  function codeName(label, code) {
    if (/\.(ts|tsx|json|mjs|example|gitignore)$/.test(label)) return label.split('/').pop();
    if (code.startsWith('DB_HOST')) return '.env';
    if (code.includes('curl -fsS')) return 'Git Bash / API';
    if (code.startsWith('CREATE DATABASE')) return 'Crear base';
    if (code.startsWith('psql ')) return 'Conectar psql';
    if (code.includes('SELECT ')) return 'Consultas SQL';
    if (code.includes('npm run test:persistencia')) return 'Comprobar persistencia';
    if (code.includes('npm run test:api')) return 'Probar API';
    if (code.includes('npm run web:offline')) return 'Arrancar Expo';
    if (code.includes('npm run start')) return 'Arrancar backend';
    if (code.includes('npm ci')) return 'Dependencias';
    return label.length > 25 ? label.slice(0, 24) + '…' : label;
  }
  function material(section, title) {
    const copy = section.cloneNode(true);
    const heading = copy.querySelector('h2,h3');
    if (heading) heading.remove();
    const units = [];
    copy.querySelectorAll('.copy').forEach(b => b.remove());
    copy.querySelectorAll('.code-label').forEach(label => {
      const pre = label.nextElementSibling;
      if (!pre || pre.tagName !== 'PRE') return;
      const source = label.closest('.source-file');
      const path = source?.querySelector('summary')?.textContent || label.textContent.trim();
      let previous;try{if(source?.dataset.previousCode)previous=JSON.parse(source.dataset.previousCode);}catch{}
      units.push({type:'code',previous,name:source?.dataset.tabName||codeName(path, pre.textContent),copyKind:source?.dataset.copyKind,path,code:pre.textContent,
        description:source?.querySelector('p')?.textContent || 'Ejecuta o copia este bloque en el entorno indicado.'});
    });
    copy.querySelectorAll('.source-file,.code-label,pre').forEach(el => el.remove());
    copy.querySelectorAll('details').forEach(el => { const div = document.createElement('div'); const heading = el.querySelector('summary'); if (heading) {const h=document.createElement('h3');h.textContent=heading.textContent;heading.replaceWith(h);}div.innerHTML=el.innerHTML;el.replaceWith(div); });
    units.unshift({type:'guide',name:'Guía',html:copy.innerHTML});
    return {title,units};
  }
  function sections(main, pageId) {
    const cards = [...main.children].filter(el => el.matches('section.card,section.callout'));
    const caseNumber = /^caso([1-6])$/.exec(pageId)?.[1];
    if (caseNumber) {
      const all = cards.map(card => ({...material(card, card.querySelector('h2')?.textContent || 'Guía'),name:card.dataset.stepName}));
      const intro = all.shift(), schema = all.shift();
      const diagram = {title:'Diagrama entidad–relación',units:[
        {type:'diagram',name:'Diagrama E–R',src:'diagramas/caso-'+String(caseNumber).padStart(2,'0')+'.svg'},
        {type:'guide',name:'Entidades y claves',html:schema.units[0].html},
        {type:'guide',name:'Recorrido',html:intro.units[0].html}
      ]};
      return [diagram,...all].map((step,i)=>({...step,name:step.name||stepNames[i]||'Paso '+(i+1)}));
    }
    const result = []; let loose = document.createElement('div');
    const flush = () => { if (loose.childNodes.length) { result.push(material(loose,'Introducción')); loose=document.createElement('div'); } };
    for (const child of [...main.children].filter(el=>!el.matches('.page-head'))) {
      if (child.matches('section.card,section.callout')) {flush();result.push(material(child,child.querySelector('h2')?.textContent || 'Guía'));}
      else if (child.matches('.teacher-guide')) {
        flush();let group=document.createElement('div'), title='Guion docente';
        const finish=()=>{if(group.childNodes.length)result.push(material(group,title));group=document.createElement('div');};
        for (const item of [...child.children]) {if (item.tagName==='H3') {finish();title=item.textContent;}group.append(item.cloneNode(true));}finish();
      } else loose.append(child.cloneNode(true));
    }
    flush();
    return result.map(s=>({...s,name:s.title.replace(/^\d+[A-Z]?\s*[·.]\s*/,'')}));
  }
  function mount({main,pageId,state,save,bind}) {
    cleanup();
    const steps=sections(main,pageId); if(!steps.length)return;
    state.notebook ||= {};
    const progress=state.notebook[/^caso[1-6]$/.test(pageId)?pageId+'-construccion':pageId] ||= {step:0,tabs:{},pages:{}};
    progress.tabs ||= {};progress.pages ||= {};
    progress.step=Math.min(Math.max(Number(progress.step)||0,0),steps.length-1);
    const heading=main.querySelector('.page-head');
    main.replaceChildren(heading);
    const deck=document.createElement('section');deck.className='notebook';
    deck.innerHTML='<div class="step-tabs" role="tablist" aria-label="Pasos en orden"></div><section class="notebook-step" role="tabpanel" id="notebook-step-panel"><header class="notebook-step-head"><h2></h2><span class="step-count"></span></header><div class="file-tabs" role="tablist" aria-label="Guía y archivos del paso"></div><div class="notebook-view" role="tabpanel" id="notebook-file-panel"></div><div class="page-controls"><button type="button" class="page-before">← Página anterior</button><span class="page-label" aria-live="polite"></span><button type="button" class="page-after">Página siguiente →</button></div></section>';
    main.append(deck);
    const tabbar=deck.querySelector('.step-tabs'),filebar=deck.querySelector('.file-tabs'),view=deck.querySelector('.notebook-view');
    let selected, capacity=20, pageCount=1, position=0, guideWidth=0, resizeFrame, fullDialog;
    const positionKey=()=>progress.step+':'+(progress.tabs[progress.step]||0);
    function tabKeyboard(event,buttons) {
      const index=buttons.indexOf(event.currentTarget);let next;
      if(event.key==='ArrowRight')next=(index+1)%buttons.length;
      if(event.key==='ArrowLeft')next=(index+buttons.length-1)%buttons.length;
      if(event.key==='Home')next=0;if(event.key==='End')next=buttons.length-1;
      if(next!==undefined){event.preventDefault();buttons[next].click();buttons[next].focus();}
    }
    function controls() {
      position=Math.max(0,Math.min(position,pageCount-1));progress.pages[positionKey()]=position;save();
      deck.querySelector('.page-before').disabled=position===0;
      deck.querySelector('.page-after').disabled=position>=pageCount-1;
      const text=selected.type==='code'?'Líneas '+(position*capacity+1)+'–'+Math.min(selected.code.split('\n').length,(position+1)*capacity)+' de '+selected.code.split('\n').length+' · ':'Lectura · ';
      deck.querySelector('.page-label').textContent=selected.type==='diagram'?'Relaciones, claves y cardinalidades':text+(position+1)+' / '+pageCount;
      deck.querySelector('.page-controls').hidden=selected.type!=='guide';
    }
    function linesHtml(code,start=0,end=code.split('\n').length){
      const a=selected.annotations;
      return code.split('\n').slice(start,end).map((line,i)=>{
        const n=start+i+1, key=a.important.has(n), changed=a.changed.has(n);
        return '<span class="source-line'+(key?' key-line':'')+(changed?' changed-line':'')+'" data-line="'+n+'" title="'+escape((a.important.get(n)||[]).join(' '))+'"><span class="line-number" aria-hidden="true">'+n+'</span><span class="line-text">'+escape(line||' ')+'</span></span>';
      }).join('');
    }
    function notesHtml(){
      return selected.annotations.notes.map((note,i)=>'<button type="button" data-reference="'+i+'" title="'+escape(note.explanation)+'">L.'+note.line+' · '+escape(note.label)+'</button>').join('');
    }
    function bindNotes(container,full=false){
      container.querySelectorAll('[data-reference]').forEach(button=>button.onclick=()=>{
        const note=selected.annotations.notes[Number(button.dataset.reference)];
        container.querySelector('.reference-detail').textContent='Línea '+note.line+' · '+note.explanation;
        if(full){container.querySelector('[data-line="'+note.line+'"]').scrollIntoView({block:'center'});}
        else{container.querySelector('[data-line="'+note.line+'"]').scrollIntoView({block:'center',inline:'nearest'});}
      });
    }
    async function copyCode(){
      try{await navigator.clipboard.writeText(selected.code);window.dispatchEvent(new CustomEvent('notebook-toast',{detail:'Código completo copiado'}));}
      catch{window.dispatchEvent(new CustomEvent('notebook-toast',{detail:'No se pudo copiar. Permite el portapapeles del navegador.'}));}
    }
    function closeFull(){if(fullDialog){const dialog=fullDialog;fullDialog=null;if(dialog.open)dialog.close();dialog.remove();}}
    function showFull(){
      closeFull();const dialog=document.createElement('dialog');fullDialog=dialog;dialog.className='full-source-dialog';
      dialog.setAttribute('aria-labelledby','full-source-title');
      dialog.innerHTML='<header class="full-source-header"><div><strong id="full-source-title">'+escape(selected.path)+'</strong><small>Archivo completo · '+selected.code.split('\n').length+' líneas · Subrayado: clave · Fondo: añadido en esta fase</small></div><div><button type="button" class="modal-copy">Copiar código completo</button><button type="button" class="modal-close" aria-label="Cerrar archivo completo">Cerrar ×</button></div></header><p class="full-source-description">'+escape(selected.description)+'</p><div class="source-references">'+notesHtml()+'</div><p class="reference-detail" role="status">Desplázate dentro del código ↕ ↔. Selecciona una referencia para explicar sus líneas.</p><pre class="all-source-code" tabindex="0"><code>'+linesHtml(selected.code)+'</code></pre>';
      document.body.append(dialog);dialog.querySelector('.modal-close').onclick=closeFull;dialog.querySelector('.modal-copy').onclick=copyCode;
      dialog.addEventListener('click',e=>{if(e.target===dialog)closeFull();});dialog.addEventListener('close',()=>{if(fullDialog===dialog)fullDialog=null;dialog.remove();});
      bindNotes(dialog,true);dialog.showModal();
    }
    function paint() {
      if(!selected)return;
      if(selected.type==='code') {
        const codebox=view.querySelector('.source-code');
        pageCount=1;position=0;
        if(!codebox.firstChild)codebox.innerHTML='<code>'+linesHtml(selected.code)+'</code>';
      } else if(selected.type==='guide') {
        const viewport=view.querySelector('.guide-viewport'), columns=view.querySelector('.guide-columns');
        guideWidth=viewport.clientWidth;
        columns.style.columnWidth=guideWidth+'px';columns.style.width=guideWidth+'px';
        columns.style.transform='none';
        pageCount=Math.max(1,Math.ceil((columns.scrollWidth+32)/(guideWidth+32)));
        position=Math.min(position,pageCount-1);
        columns.style.transform='translateX(-'+position*(guideWidth+32)+'px)';
      }else{pageCount=1;position=0;}
      controls();
    }
    function showUnit(index, focus=false) {
      closeFull();
      const step=steps[progress.step];index=Math.min(Math.max(index,0),step.units.length-1);
      progress.tabs[progress.step]=index;selected=step.units[index];document.body.classList.toggle('source-reading',selected.type==='code');position=Number(progress.pages[positionKey()])||0;
      filebar.innerHTML=step.units.map((unit,i)=>'<button type="button" role="tab" id="file-tab-'+i+'" aria-controls="notebook-file-panel" aria-selected="'+(i===index)+'" tabindex="'+(i===index?'0':'-1')+'" title="'+escape(unit.path||unit.name)+'">'+String(i+1).padStart(2,'0')+' · '+escape(unit.name)+'</button>').join('');
      const buttons=[...filebar.children];buttons.forEach((b,i)=>{b.onclick=()=>showUnit(i);b.onkeydown=e=>tabKeyboard(e,buttons);});
      view.setAttribute('aria-labelledby','file-tab-'+index);
      if(selected.type==='code') {
        selected.annotations ||= window.CodeLesson.annotate(selected.code,selected.previous);
        view.innerHTML='<div class="source-toolbar"><span title="'+escape(selected.path)+'">'+escape(selected.path)+'</span><div class="source-actions"><button type="button" class="show-full-source">Ver archivo completo</button><button type="button" class="copy-full">Copiar código completo</button></div></div><p class="source-description">'+escape(selected.description)+' <strong>'+selected.code.split('\n').length+' líneas completas.</strong></p><div class="source-references"'+(selected.annotations.notes.length?'':' hidden')+'>'+notesHtml()+'</div><p class="reference-detail"'+(selected.annotations.notes.length?'':' hidden')+' role="status">Desplázate dentro del código ↕ ↔ para ver todas las líneas. Subrayado: líneas clave. Fondo: líneas añadidas.</p><pre class="source-code" tabindex="0" aria-label="Archivo completo con desplazamiento vertical y horizontal"></pre>';
        view.querySelector('.copy-full').onclick=copyCode;view.querySelector('.show-full-source').onclick=showFull;bindNotes(view);
      }else if(selected.type==='diagram') {
        view.innerHTML='<div class="er-stage"><picture><source media="(max-width: 600px)" srcset="'+escape(selected.src.replace('.svg','-movil.svg'))+'"><img src="'+escape(selected.src)+'" alt="Diagrama entidad relación del '+pageId+', con claves, conexiones y cardinalidades"></picture></div><div class="er-caption"><span>Lee las conexiones antes de escribir las Entities.</span><a href="'+escape(selected.src)+'" target="_blank" rel="noopener">Abrir dibujo ampliado ↗</a></div>';
      }else{
        view.innerHTML='<div class="guide-viewport"><div class="guide-columns">'+selected.html+'</div></div>';
        bind();
      }
      paint();requestAnimationFrame(paint);save();
      const activeStep=tabbar.children[progress.step];if(activeStep&&selected.type==='code')activeStep.scrollIntoView({block:'nearest',inline:'nearest'});
      if(focus)buttons[index].focus();
    }
    function showStep(index,focus=false) {
      progress.step=Math.min(Math.max(index,0),steps.length-1);
      tabbar.innerHTML=steps.map((step,i)=>'<button type="button" role="tab" id="step-tab-'+i+'" aria-controls="notebook-step-panel" aria-selected="'+(i===progress.step)+'" tabindex="'+(i===progress.step?'0':'-1')+'" title="'+escape(step.title)+'"><span>'+String(i+1).padStart(2,'0')+'</span>'+escape(step.name)+'</button>').join('');
      const buttons=[...tabbar.children];buttons.forEach((b,i)=>{b.onclick=()=>showStep(i);b.onkeydown=e=>tabKeyboard(e,buttons);});
      deck.querySelector('.notebook-step').setAttribute('aria-labelledby','step-tab-'+progress.step);
      deck.querySelector('.notebook-step-head h2').textContent=steps[progress.step].title;
      deck.querySelector('.step-count').textContent=(progress.step+1)+' / '+steps.length;
      document.querySelector('#prev').textContent='← Paso anterior';document.querySelector('#prev').disabled=progress.step===0;
      document.querySelector('#next').textContent='Paso siguiente →';document.querySelector('#next').disabled=progress.step===steps.length-1;
      document.querySelector('#prev').onclick=()=>showStep(progress.step-1);
      document.querySelector('#next').onclick=()=>showStep(progress.step+1);
      showUnit(Number(progress.tabs[progress.step])||0);
      if(focus)buttons[progress.step].focus();
    }
    deck.querySelector('.page-before').onclick=()=>{position--;paint();};deck.querySelector('.page-after').onclick=()=>{position++;paint();};
    const observer=new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(paint);});observer.observe(view);
    showStep(progress.step);
    cleanup=()=>{observer.disconnect();cancelAnimationFrame(resizeFrame);closeFull();document.body.classList.remove('source-reading');};
  }
  return {mount,unmount:()=>cleanup()};
})();
