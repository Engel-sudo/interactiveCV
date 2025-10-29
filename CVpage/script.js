// Utility: clock
const clock = document.getElementById('clock');
const updateClock = ()=>{ const d=new Date(); clock.textContent=d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); };
updateClock(); setInterval(updateClock, 1000);

// Window manager
const desktop = document.querySelector('.desktop');
const wins = Array.from(document.querySelectorAll('.window'));
const taskButtons = document.getElementById('taskButtons');
let z=10;

function bringToFront(win){ win.style.zIndex = ++z; wins.forEach(w=>w.classList.toggle('active', w===win)); highlightTask(win); }

function createTaskButton(win){
  const title = win.querySelector('.title').textContent || 'Window';
  const btn = document.createElement('button');
  btn.className='task'; btn.textContent=title; btn.addEventListener('click', ()=>toggleMinimized(win));
  btn.dataset.for = win.id; taskButtons.appendChild(btn); return btn;
}

function getTaskButton(win){ return taskButtons.querySelector(`[data-for="${win.id}"]`) || createTaskButton(win); }
function highlightTask(win){ const btn=getTaskButton(win); taskButtons.querySelectorAll('.task').forEach(b=>b.classList.toggle('active', b===btn)); }

function openWindow(win){ win.style.display='block'; bringToFront(win); getTaskButton(win).style.display=''; }
function closeWindow(win){ win.style.display='none'; const btn=getTaskButton(win); btn.style.display='none'; }
function toggleMinimized(win){ if(win.style.display==='none'){ openWindow(win); } else { win.style.display='none'; highlightTask(win); } }

// Dragging
wins.forEach(win=>{
  const bar = win.querySelector('[data-drag]');
  let dx=0, dy=0, startX=0, startY=0, dragging=false;
  bar.addEventListener('mousedown', (e)=>{ dragging=true; bringToFront(win); startX=e.clientX; startY=e.clientY; const rect=win.getBoundingClientRect(); dx=startX-rect.left; dy=startY-rect.top; document.body.style.userSelect='none'; });
  window.addEventListener('mousemove', (e)=>{ if(!dragging) return; let x=e.clientX-dx; let y=e.clientY-dy; const bounds=desktop.getBoundingClientRect(); const w=win.offsetWidth; const h=win.offsetHeight; x=Math.max(bounds.left, Math.min(bounds.right-w, x)); y=Math.max(bounds.top, Math.min(bounds.bottom-h, y)); win.style.left=x+'px'; win.style.top=y+'px'; });
  window.addEventListener('mouseup', ()=>{ dragging=false; document.body.style.userSelect=''; });

  // Controls
  win.querySelector('[data-close]').addEventListener('click', ()=>closeWindow(win));
  win.querySelector('[data-minimize]').addEventListener('click', ()=>toggleMinimized(win));
  win.querySelector('[data-maximize]').addEventListener('click', ()=>{
    if(win.dataset.max==='1'){
      // restore
      win.style.left=win.dataset.left; win.style.top=win.dataset.top; win.style.width=win.dataset.width; win.style.height=win.dataset.height; win.dataset.max='0';
    } else {
      // save and maximize
      const rect=win.getBoundingClientRect(); win.dataset.left=win.style.left; win.dataset.top=win.style.top; win.dataset.width=win.style.width; win.dataset.height=win.style.height; win.style.left='0px'; win.style.top='0px'; win.style.width='calc(100% - 0px)'; win.style.height='calc(100% - 28px)'; win.dataset.max='1';
    }
    bringToFront(win);
  });

  // Focus on click
  win.addEventListener('mousedown', ()=>bringToFront(win));
});

// Desktop icons & menu openers
document.querySelectorAll('[data-open]').forEach(el=>{
  el.addEventListener('click', ()=>{
    const sel = el.getAttribute('data-open');
    const w = document.querySelector(sel);
    if(w){ openWindow(w); }
  });
});

// Start menu
const startBtn = document.getElementById('startButton');
const startMenu = document.getElementById('startMenu');
function toggleStart(){ const v = startMenu.style.display==='block'; startMenu.style.display = v ? 'none' : 'block'; startBtn.setAttribute('aria-expanded', String(!v)); }
startBtn.addEventListener('click', toggleStart);
document.addEventListener('click', (e)=>{ if(!startMenu.contains(e.target) && e.target!==startBtn){ startMenu.style.display='none'; startBtn.setAttribute('aria-expanded','false'); }});
document.getElementById('printCV').addEventListener('click', ()=>{ startMenu.style.display='none'; window.print(); });

// Initialize: open About
wins.forEach(w=>{ getTaskButton(w); });
openWindow(document.getElementById('win-about'));
