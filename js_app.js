/* ============================================================
   APP.JS — reads js/data.js and draws the page.
   You normally never need to edit this file.
   Section numbers match the comments.
   ============================================================ */

/* ---------- 0. Tiny helpers ---------- */
const $ = s => document.querySelector(s);
const NS = 'http://www.w3.org/2000/svg';
// create an SVG element with attributes, optionally attach it to a parent
function S(tag, attrs, parent){
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
const ALL = PARTIES.concat(FIGURES);
const gOf = id => (ALL.find(e => e.id === id) || {}).g;

/* ---------- 1. Navigation (from NAV in data.js) ---------- */
$('#navLinks').innerHTML = NAV.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('');

/* ---------- 2. Hero: rotating Ashoka-chakra decoration ---------- */
(function(){
  const c = $('#chakraSvg');
  S('circle', {cx:100, cy:100, r:88, fill:'none', stroke:'#6ea8ff', 'stroke-width':3}, c);
  for (let i = 0; i < 24; i++){
    const a = i * Math.PI / 12;
    S('line', {x1:100, y1:100, x2:100+88*Math.cos(a), y2:100+88*Math.sin(a), stroke:'#6ea8ff', 'stroke-width':2}, c);
  }
  S('circle', {cx:100, cy:100, r:10, fill:'#6ea8ff'}, c);
})();

/* ---------- 3. Hero stat counters ---------- */
$('#stD').textContent = DEBATES.length;
$('#stP').textContent = PARTIES.length;
$('#stF').textContent = FIGURES.length;

/* ---------- 4. Debate cards ---------- */
$('#debateGrid').innerHTML = DEBATES.map((d, i) => `
  <article class="card reveal">
    <div class="dhead"><span class="dnum">0${i+1}</span><div><h3>${d.t}</h3><p>${d.q}</p></div></div>
    <div class="sides">
      <div class="side a"><h4>${d.a.name}</h4><ul>${d.a.pts.map(p=>`<li>${p}</li>`).join('')}</ul></div>
      <div class="side b"><h4>${d.b.name}</h4><ul>${d.b.pts.map(p=>`<li>${p}</li>`).join('')}</ul></div>
    </div>
    <div class="barlabels"><span>← ${d.a.name}</span><span>${d.b.name} →</span></div>
    <div class="bar">${Object.entries(d.leans).map(([k,v]) =>
      `<span class="dot" data-id="${k}" style="left:${v}%;background:${GROUPS[gOf(k)]}"></span>`).join('')}
    </div>
  </article>`).join('');

/* ---------- 5. The compass ---------- */
const tip = $('#tip');
const svg = $('#compass');
const X = v => 500 + v * 43;   // data x (-10..10) → svg x
const Y = v => 500 - v * 43;   // data y (-10..10) → svg y (inverted: up = tradition)

// helper: write SVG text
function T(x, y, txt, anchor, size, fill){
  const e = S('text', {x, y, 'text-anchor':anchor, 'font-size':size, fill}, svg);
  e.textContent = txt;
  return e;
}

// hover tooltip + click-to-inspect, shared by circles and diamonds
function bind(el, e){
  el.addEventListener('mouseenter', () => {
    tip.innerHTML = `<b>${e.name}</b><span>${GLABEL[e.g]}</span>`;
    tip.style.opacity = 1;
  });
  el.addEventListener('mousemove', ev => {
    tip.style.left = Math.min(ev.clientX + 14, innerWidth - 250) + 'px';
    tip.style.top  = (ev.clientY + 14) + 'px';
  });
  el.addEventListener('mouseleave', () => tip.style.opacity = 0);
  el.addEventListener('click', () => showDetail(e));
}

function drawCompass(){
  /* 5a. quadrant tints (subtle colour per quadrant) */
  S('rect', {x:70, y:70, width:430, height:430, fill:'#ff9933', opacity:.05}, svg);
  S('rect', {x:500, y:70, width:430, height:430, fill:'#ff6b6b', opacity:.05}, svg);
  S('rect', {x:70, y:500, width:430, height:430, fill:'#6ea8ff', opacity:.06}, svg);
  S('rect', {x:500, y:500, width:430, height:430, fill:'#3ddc84', opacity:.05}, svg);

  /* 5b. gridlines every 2 units */
  for (let v = -10; v <= 10; v += 2){
    S('line', {x1:X(v), y1:70, x2:X(v), y2:930, stroke:'rgba(255,255,255,.05)'}, svg);
    S('line', {x1:70, y1:Y(v), x2:930, y2:Y(v), stroke:'rgba(255,255,255,.05)'}, svg);
  }
  /* 5c. centre axes */
  S('line', {x1:500, y1:70, x2:500, y2:930, stroke:'rgba(255,255,255,.25)', 'stroke-width':1.5}, svg);
  S('line', {x1:70, y1:500, x2:930, y2:500, stroke:'rgba(255,255,255,.25)', 'stroke-width':1.5}, svg);

    /* 5d. axis labels — economy on the SIDES (rotated), culture top & bottom */
  // helper: rotated SVG text, for the left/right labels
  function R(x, y, txt, size, fill, rot){
    const e = S('text', {x, y, 'text-anchor':'middle', 'font-size':size, fill,
      transform:`rotate(${rot} ${x} ${y})`}, svg);
    e.textContent = txt;
    return e;
  }
  // top & bottom — culture axis (unchanged)
  T(500, 28,  AXES.y.top.title,    'middle', 19, 'rgba(255,255,255,.6)');
  T(500, 50,  AXES.y.top.note,     'middle', 13, 'rgba(255,255,255,.35)');
  T(500, 962, AXES.y.bottom.title, 'middle', 19, 'rgba(255,255,255,.6)');
  T(500, 984, AXES.y.bottom.note,  'middle', 13, 'rgba(255,255,255,.35)');
  // left & right — economy axis, rotated 90° so they sit on the sides
  R(30,  500, AXES.x.left.title,  19, 'rgba(255,255,255,.6)',  -90);
  R(52,  500, AXES.x.left.note,   13, 'rgba(255,255,255,.35)', -90);
  R(970, 500, AXES.x.right.title, 19, 'rgba(255,255,255,.6)',   90);
  R(948, 500, AXES.x.right.note,  13, 'rgba(255,255,255,.35)',  90);
  // small arrowheads at the four axis ends (direction cues)
  S('path', {d:'M 70 500 L 84 493 L 84 507 Z',   fill:'rgba(255,255,255,.25)'}, svg);
  S('path', {d:'M 930 500 L 916 493 L 916 507 Z', fill:'rgba(255,255,255,.25)'}, svg);
  S('path', {d:'M 500 70 L 493 84 L 507 84 Z',   fill:'rgba(255,255,255,.25)'}, svg);
  S('path', {d:'M 500 930 L 493 916 L 507 916 Z', fill:'rgba(255,255,255,.25)'}, svg);

  /* 5e. quadrant labels — from QUADRANTS in data.js */
  const qp = { TL:[285,115], TR:[715,115], BL:[285,900], BR:[715,900] };
  QUADRANTS.forEach(q => T(qp[q.pos][0], qp[q.pos][1], q.label, 'middle', 17, 'rgba(255,255,255,.25)'));

  /* 5f. party circles */
  const gP = S('g', {}, svg), gF = S('g', {}, svg);
  PARTIES.forEach((e, i) => {
    const c = S('circle', {cx:X(e.x), cy:Y(e.y), r:13, fill:GROUPS[e.g], stroke:'#0a0f24', 'stroke-width':2.5, class:'pt'}, gP);
    c.style.animation = `pop .5s ${i * 0.06}s both`;
    const t = T(X(e.x), Y(e.y) + 32, e.id, 'middle', 16, '#cfd6f2');
    t.style.pointerEvents = 'none';
    bind(c, e);
  });

  /* 5g. freedom-era figure diamonds */
  FIGURES.forEach((e, i) => {
    const x = X(e.x), y = Y(e.y);
    const d = S('path', {d:`M ${x} ${y-14} L ${x+14} ${y} L ${x} ${y+14} L ${x-14} ${y} Z`,
      fill:GROUPS.Figure, stroke:'#0a0f24', 'stroke-width':2.5, class:'pt'}, gF);
    d.style.animation = `pop .5s ${0.4 + i * 0.06}s both`;
    const t = T(x, y - 22, e.s, 'middle', 15, '#ffe9b8');
    t.style.pointerEvents = 'none';
    bind(d, e);
  });

  /* 5h. layer toggles */
  $('#tgP').addEventListener('change', ev => gP.style.display = ev.target.checked ? '' : 'none');
  $('#tgF').addEventListener('change', ev => gF.style.display = ev.target.checked ? '' : 'none');
}
drawCompass();

/* ---------- 6. Detail panel (click a point) ---------- */
function econWord(x){
  return x<=-6 ? 'Far-left · socialist' : x<=-2 ? 'Centre-left · welfare' :
         x<2   ? 'Centrist · mixed'    : x<=6  ? 'Centre-right · pro-market' : 'Right · free-market';
}
function cultWord(y){
  return y>=6 ? 'Tradition-forward' : y>=2 ? 'Leans traditional' :
         y>-2 ? 'Pragmatic / mixed' : y>-6 ? 'Leans secular-reform' : 'Strongly secular-reform';
}
function showDetail(e){
  $('#detail').innerHTML = `
    <h3>${e.name}</h3>
    <div class="chips">
      <span class="chip" style="border-color:${GROUPS[e.g]};color:${GROUPS[e.g]}">${GLABEL[e.g]}</span>
      <span class="chip">Economy: ${econWord(e.x)}</span>
      <span class="chip">Culture: ${cultWord(e.y)}</span>
      <span class="chip">x ${e.x>0?'+':''}${e.x} · y ${e.y>0?'+':''}${e.y}</span>
    </div>
    <p>${e.b}</p>`;
}

/* ---------- 7. Legend ---------- */
$('#legend').innerHTML = Object.keys(GROUPS).map(k =>
  `<span><i style="background:${GROUPS[k]}${k==='Figure'?';border-radius:2px;transform:rotate(45deg)':''}"></i>${GLABEL[k]}</span>`).join('');

/* ---------- 8. Donation ---------- */
/* ---------- 8. Donation ---------- */
let amt = DONATION.default;
$('#amtIn').value = amt;

// Show the UPI ID on the page
$('#upiDisplay').textContent = SITE.upi;

// Generate amount buttons
$('#amts').innerHTML = DONATION.amounts.map(v =>
  `<button class="amt ${v === DONATION.default ? 'on' : ''}" data-v="${v}">₹${v}</button>`
).join('');

// Build the UPI payment string for the QR code (no encoding on UPI ID!)
const upiString = a => {
  const cleanAmount = parseFloat(a).toFixed(2);
  return `upi://pay?pa=${SITE.upi}&pn=LoktantraAtlas&am=${cleanAmount}&cu=INR`;
};

// Render the QR code
function renderQR() {
  if (window.QRious && document.getElementById('qr')) {
    new QRious({
      element: $('#qr'),
      value: upiString(amt),
      size: 200,
      background: '#ffffff'
    });
  }
}

// Amount button clicks
document.querySelectorAll('.amt').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.amt').forEach(x => x.classList.remove('on'));
  b.classList.add('on');
  amt = +b.dataset.v;
  $('#amtIn').value = amt;
  renderQR();
}));

// Custom amount input
$('#amtIn').addEventListener('input', e => {
  amt = +e.target.value || 0;
  document.querySelectorAll('.amt').forEach(x => x.classList.remove('on'));
  if (amt >= DONATION.min) renderQR();
});

// Copy UPI ID button
$('#copyBtn').addEventListener('click', () => {
  navigator.clipboard.writeText(SITE.upi).then(() => {
    const btn = $('#copyBtn');
    btn.textContent = '✓ Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = '📋 Copy';
      btn.classList.remove('copied');
    }, 2000);
  });
});

// Initial render
renderQR();

/* ---------- 9. Scroll-reveal animations ---------- */
const io = new IntersectionObserver(es =>
  es.forEach(x => x.isIntersecting && x.target.classList.add('on')), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- 10. Spectrum-dot tooltips (hover on PC, tap on phone) ---------- */
document.querySelectorAll('.dot').forEach(d => {
  const id = d.dataset.id;
  const show = (x, y) => {
    tip.innerHTML = `<b>${id}</b><span>${GLABEL[gOf(id)]}</span>`;
    tip.style.opacity = 1;
    tip.style.left = Math.min(x + 12, innerWidth - 250) + 'px';
    tip.style.top  = (y + 12) + 'px';
  };
  d.addEventListener('mouseenter', ev => show(ev.clientX, ev.clientY));  // PC hover
  d.addEventListener('mousemove',  ev => show(ev.clientX, ev.clientY));
  d.addEventListener('mouseleave', () => tip.style.opacity = 0);
  d.addEventListener('click', ev => {                                   // phone tap
    ev.stopPropagation();
    const r = d.getBoundingClientRect();
    show(r.left, r.bottom);
  });
});
document.addEventListener('click', () => tip.style.opacity = 0); // tap elsewhere = dismiss

/* ---------- 11. Translate (free, in-page, any language) ---------- */
const langSel = $('#langSel');
const SKIP_TAGS = new Set(['SCRIPT','STYLE','NOSCRIPT','CANVAS','SVG','INPUT','TEXTAREA','SELECT']);
let originals = null;

// Collect every visible piece of text on the page
function getTranslatableNodes(){
  const nodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node){
      const p = node.parentElement;
      if(!p) return NodeFilter.FILTER_REJECT;
      if(SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
      if(p.closest('#langSel') || p.closest('.brand')) return NodeFilter.FILTER_REJECT;
      if(!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let n; while(n = walker.nextNode()) nodes.push(n);
  return nodes;
}

// Ask Google's free endpoint for one translation
async function gtx(text, tl){
  const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' +
              tl + '&dt=t&q=' + encodeURIComponent(text);
  const res = await fetch(url);
  const data = await res.json();
  return data[0].map(seg => seg[0]).join('');
}

// Translate the whole page (in small batches)
async function translatePage(tl){
  const nodes = getTranslatableNodes();
  if(!originals){
    originals = new Map();
    nodes.forEach(nd => originals.set(nd, nd.textContent));
  }
  document.documentElement.lang = tl;
  const BATCH = 12;
  for(let i = 0; i < nodes.length; i += BATCH){
    await Promise.all(nodes.slice(i, i + BATCH).map(async nd => {
      try{ nd.textContent = await gtx(originals.get(nd) || nd.textContent, tl); }
      catch(e){ /* keep original if a request fails */ }
    }));
  }
}

// Switch back to English
function restorePage(){
  if(!originals) return;
  originals.forEach((txt, nd) => { nd.textContent = txt; });
  document.documentElement.lang = 'en';
}

langSel.addEventListener('change', async e => {
  const lang = e.target.value;
  if(!lang) return;
  langSel.disabled = true;                 // shows it's working
  try{
    if(lang === 'en') restorePage();
    else await translatePage(lang);
  }finally{ langSel.disabled = false; }
});

/* ---------- Newsletter (Google Forms → Sheets) ---------- */
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSc35YZ-sALv_0peZwwBW_pN_3ozGKgEGB9nVS78dLcij3Q0ZQ/formResponse';
const GOOGLE_ENTRY_ID = 'entry.1426600678';

if ($('#nlForm')){
  $('#nlForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = $('#nlEmail').value;
    const note = $('#nlNote');
    fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: GOOGLE_ENTRY_ID + '=' + encodeURIComponent(email)
    }).then(() => {
      note.textContent = '✓ Subscribed! You will hear from us soon.';
      note.style.color = 'var(--green)';
      $('#nlForm').reset();
    }).catch(() => {
      note.textContent = 'Something went wrong — please try again.';
      note.style.color = '#ff6b6b';
    });
  });
}
/* Legend for the debate sliders */
function renderDebateLegend(){
  const ids = new Set();
  DEBATES.forEach(d => Object.keys(d.leans).forEach(id => ids.add(id)));
  const groups = [...new Set([...ids].map(id => gOf(id)))];
  $('#debateLegend').innerHTML = groups.map(g =>
    `<span><i style="background:${GROUPS[g]}"></i>${GLABEL[g]}</span>`).join('');
}
renderDebateLegend();

/* ---------- Contact email ---------- */
if ($('#contactMail')){
  const m = $('#contactMail');
  m.textContent = SITE.email;
  m.href = 'mailto:' + SITE.email;
}
if ($('#copyMail')){
  $('#copyMail').addEventListener('click', () => {
    navigator.clipboard.writeText(SITE.email).then(() => {
      const b = $('#copyMail');
      b.textContent = '✓ Copied!';
      setTimeout(() => { b.textContent = '📋 Copy'; }, 2000);
    });
  });
}

document.addEventListener('click', function(e){
  var b = e.target.closest('.brand');
  if(!b) return;
  var onHome = location.pathname.endsWith('/') || location.pathname.endsWith('index.html');
  if(onHome){ e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); }
});

/* ---- fix: layer toggles hide names too ---- */
(function(){
  const pIds  = new Set(PARTIES.map(p=>p.id));   // BJP, INC, ...
  const fNames= new Set(FIGURES.map(f=>f.s));    // Nehru, Gandhi, ...
  function apply(){
    const showP = $('#tgP').checked, showF = $('#tgF').checked;
    document.querySelectorAll('#compass circle, #compass path, #compass polygon, #compass text').forEach(el=>{
      if(el.tagName==='text'){
        const t = el.textContent.trim();
        if(pIds.has(t))      el.style.display = showP ? '' : 'none';
        else if(fNames.has(t)) el.style.display = showF ? '' : 'none';
      }
      else if(el.tagName==='circle'){
        el.style.display = showP ? '' : 'none';
      }
      else if((el.tagName==='path'||el.tagName==='polygon') && el.classList.contains('pt')){
        el.style.display = showF ? '' : 'none';
      }
    });
  }
  $('#tgP').addEventListener('change', apply);
  $('#tgF').addEventListener('change', apply);
  apply();
})();
