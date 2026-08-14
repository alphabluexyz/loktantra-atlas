/* ============================================================
   DATA.JS — the content brain of the site.

   EVERYTHING editable lives here: text, positions, labels,
   donation settings. You do not need to touch app.js or
   style.css for content updates.

   Coordinate system for the map:
     x : -10 (state-run economy)  …  +10 (market economy)
     y : -10 (secular reform)     …  +10 (faith & tradition)

   Rules when adding entries:
     - keep the same { } structure and comma placement
     - every id must be unique
     - g must be one of: NDA | INDIA | Left | Regional | Historical | Figure
   ============================================================ */

/* ---------- 1. SITE SETTINGS ---------- */
const SITE = {
  name: 'Loktantra Atlas',     // appears on the UPI payment note
  upi:  'ananyshikhar@ptyes'  //real upi id
};

/* ---------- 2. NAVIGATION ----------
   To add a page: create the .html file (copy index.html),
   then add one line here, e.g. { label:'Method', href:'methods.html' } */
const NAV = [
  { label: 'Framework', href: 'index.html#framework' },   // ← new
  { label: 'Debates', href: 'index.html#debates' },
  { label: 'The Map', href: 'index.html#map' },
  { label: 'Connect', href: 'index.html#connect' },
  { label: 'Support', href: 'index.html#donate' }
];

/* ---------- 3. MAP WORDING ----------
   Rename any of these strings to change how the compass reads. */
const AXES = {
  x: {
    left:  { title: 'STATE & WELFARE',     note: 'planning · subsidies · regulation · public sector' },
    right: { title: 'MARKET & ENTERPRISE', note: 'competition · private investment · free trade' }
  },
  y: {
    top:    { title: 'FAITH & TRADITION IN PUBLIC LIFE', note: 'religion, heritage and majority culture shape the state' },
    bottom: { title: 'SECULARISM & SOCIAL REFORM',       note: 'state keeps equal distance from all religions; reforms society' }
  }
};

const QUADRANTS = [
  { pos: 'TL', label: 'WELFARE STATE · FAITH & TRADITION' },
  { pos: 'TR', label: 'FREE MARKET · FAITH & TRADITION' },
  { pos: 'BL', label: 'WELFARE STATE · SECULAR REFORM' },
  { pos: 'BR', label: 'FREE MARKET · SECULAR REFORM' }
];

/* ---------- 4. GROUP COLOURS (legend + points) ---------- */
const GROUPS = {
  NDA: '#ff9a3d', INDIA: '#5aa2ff', Left: '#ff6b6b',
  Regional: '#3ddc84', Historical: '#c39bff', Figure: '#ffd166'
};
const GLABEL = {
  NDA: 'NDA bloc', INDIA: 'INDIA bloc', Left: 'Left Front',
  Regional: 'Regional / Other', Historical: 'Historical party',
  Figure: 'Freedom-era thinker'
};

/* ---------- 5. PARTIES (today) ----------
   To move a party, just change its x and/or y (range -10 … +10). */
const PARTIES = [
  { id:'BJP', name:'Bharatiya Janata Party (BJP)', g:'NDA', x:4, y:7, b:'Cultural nationalism (Hindutva) paired with pro-market economics and centralised welfare delivery.' },
  { id:'INC', name:'Indian National Congress (INC)', g:'INDIA', x:-2, y:-4, b:'Centrist, secular, mixed-economy heir of the freedom movement; today a social-democratic opposition.' },
  { id:'CPIM', name:'CPI (Marxist)', g:'Left', x:-8, y:-5, b:'Democratic socialist; secular; labour rights, land reform and strong public distribution.' },
  { id:'BSP', name:'Bahujan Samaj Party (BSP)', g:'Regional', x:-4, y:-4, b:'Ambedkarite politics of dignity and representation for Dalit-Bahujan communities.' },
  { id:'SP', name:'Samajwadi Party (SP)', g:'Regional', x:-2, y:0, b:'Socialist populism with an OBC–minority social coalition.' },
  { id:'AAP', name:'Aam Aadmi Party (AAP)', g:'INDIA', x:-3, y:-3, b:'Anti-corruption origins; welfare populism on health and education with pragmatic centrism.' },
  { id:'TMC', name:'Trinamool Congress (TMC)', g:'INDIA', x:-4, y:-1, b:'Bengali regionalism, welfare populism and fierce defence of federalism.' },
  { id:'DMK', name:'Dravida Munnetra Kazhagam (DMK)', g:'INDIA', x:-3, y:-7, b:'Dravidian rationalism, social justice and states-rights federalism.' },
  { id:'SS', name:'Shiv Sena', g:'NDA', x:1, y:8, b:'Hindutva plus Marathi regional pride; economic populism.' },
  { id:'AIMIM', name:'AIMIM', g:'Regional', x:-2, y:6, b:'Minority identity politics with welfare populism; Hyderabad-based.' },
  { id:'SWA', name:'Swatantra Party (1959–74)', g:'Historical', x:8, y:2, b:'Classical-liberal, free-market and conservative; founded by C. Rajagopalachari.' },
  { id: 'JS', name: 'Jan Suraj', g: 'Regional', x: -1, y: -2, b: 'A reformist movement-turned-party in Bihar led by Prashant Kishor, built around the Jan Suraj Yatra. Centred on "sushasan" (good governance), anti-corruption and social justice rather than caste or communal identity. Economically pragmatic; culturally secular-reformist.' }
];

/* ---------- 6. FREEDOM-ERA FIGURES ----------
   s = the short label drawn next to the diamond on the map. */
const FIGURES = [
  { id:'NEH', name:'Jawaharlal Nehru', s:'Nehru', g:'Figure', x:-7, y:-6, b:'First PM; democratic socialist, secular moderniser, architect of planning and non-alignment.' },
  { id:'GAN', name:'Mahatma Gandhi', s:'Gandhi', g:'Figure', x:-6, y:2, b:'Moral politics; village republics, swadeshi and trusteeship; a reformer working within tradition.' },
  { id:'AMB', name:'B. R. Ambedkar', s:'Ambedkar', g:'Figure', x:-5, y:-8, b:'Constitution-maker; annihilation of caste; early advocate of state socialism and constitutional morality.' },
  { id:'SAV', name:'V. D. Savarkar', s:'Savarkar', g:'Figure', x:3, y:8, b:'Hindutva ideologue; pro-science and anti-caste, yet majoritarian in his nationalism.' },
  { id:'PAT', name:'Sardar Vallabhbhai Patel', s:'Patel', g:'Figure', x:4, y:3, b:'Integrator of princely states; pragmatic, pro-property, strong-state conservative.' },
  { id:'BOS', name:'Subhas Chandra Bose', s:'Bose', g:'Figure', x:-7, y:0, b:'Swaraj by struggle; socialist planning; secular but willing to use authoritarian means.' },
  { id:'BHS', name:'Bhagat Singh', s:'Bhagat Singh', g:'Figure', x:-9, y:-6, b:'Revolutionary socialist; atheist rationalist; anti-imperialist martyr.' },
  { id:'TIL', name:'Bal Gangadhar Tilak', s:'Tilak', g:'Figure', x:0, y:7, b:'Swaraj as my birthright; mass politics mobilised through cultural idiom.' },
  { id:'PER', name:'Periyar E. V. Ramasamy', s:'Periyar', g:'Figure', x:-3, y:-9, b:'Rationalist; anti-caste and anti-patriarchy; self-respect movement of the Dravidian south.' },
  { id:'RAJ', name:'C. Rajagopalachari', s:'Rajaji', g:'Figure', x:8, y:1, b:'Conscience-keeper turned market liberal; founded Swatantra; secular conservative.' },
  { id:'JIN', name:'Muhammad Ali Jinnah', s:'Jinnah', g:'Figure', x:5, y:5, b:'Constitutionalist who became the voice of Muslim separatism and the two-nation theory.' },
  { id:'LOH', name:'Ram Manohar Lohia', s:'Lohia', g:'Figure', x:-6, y:-3, b:'Socialist; anti-caste federalist; champion of the backward classes.' },
  { id:'AZA', name:'Maulana Abul Kalam Azad', s:'Azad', g:'Figure', x:-3, y:1, b:'Secular nationalist and Islamic scholar; builder of modern India’s education system.' }
];

/* ---------- 7. DEBATES ----------
   a = blue side of the card, b = saffron side.
   leans: how far each party leans toward side b (0 = fully side a, 100 = fully side b). */
const DEBATES = [
  { t:'The Economy', q:'Who should drive growth and welfare?',
    a:{ name:'State-led & welfare', pts:[
      'Markets fail the poor; the state must guarantee food, health, education and work.',
      'Strategic sectors - energy, railways, minerals - belong in public hands.',
      'Redistribution through taxes and welfare closes inequality.',
      'Regulation checks monopoly power and labour exploitation.']},
    b:{ name:'Markets & enterprise', pts:[
      'Private enterprise and competition create growth and jobs.',
      'Open markets allocate resources better than bureaucracies do.',
      'Ease of doing business and fiscal discipline attract investment.',
      'Create wealth first; redistribution needs a bigger pie.']},
    leans:{ CPIM:12, BSP:35, INC:45, AAP:38, DMK:42, BJP:75, JS:45 } },

  { t:'National Identity', q:'What is the nation bound by?',
    a:{ name:'Civic-secular', pts:[
      'The state is neutral to all faiths; citizenship, not religion, defines the nation.',
      'Minority rights and pluralism are the constitutional core.',
      'Fusing religion with state power divides society.']},
    b:{ name:'Cultural-civilisational', pts:[
      'India is rooted in a civilisational culture that deserves public recognition.',
      'Shared heritage and symbols build cohesion and pride.',
      'Appeasement politics distorts true equality.']},
    leans:{ CPIM:8, DMK:12, INC:25, BSP:30, AAP:45, BJP:90, JS:25 } },

  { t:'Centre vs States', q:'One strong Centre, or powerful states?',
    a:{ name:'Strong Centre', pts:[
      'A strong Union holds a vastly diverse country together.',
      'National standards in education, health and infrastructure need central leadership.',
      'Crises - pandemics, security, macro-economy - demand coordination.']},
    b:{ name:'Empowered states', pts:[
      'Diversity is best governed close to the people.',
      'States are laboratories; competition improves governance.',
      'Fiscal and cultural autonomy prevents homogenisation.']},
    leans:{ DMK:8, CPIM:20, BSP:40, INC:45, AAP:55, BJP:80, JS:35 } },

  { t:'Social Justice', q:'How should historical wrongs be repaired?',
    a:{ name:'Expand affirmative action', pts:[
      'Caste structure persists; representation corrects historical exclusion.',
      'Reservation is power-sharing, not poverty relief.',
      'Extend safeguards to communities still left outside.']},
    b:{ name:'Limit & redesign', pts:[
      'Merit and efficiency must be balanced against quotas.',
      'Creamy-layer and economic criteria should refine eligibility.',
      'Overuse of category politics fragments civic unity.']},
    leans:{ BSP:10, DMK:15, CPIM:30, INC:35, AAP:50, BJP:60, JS:25 } },

  { t:'Globalisation', q:'Open doors, or swadeshi?',
    a:{ name:'Integrate globally', pts:[
      'Foreign investment and trade bring capital, technology and export jobs.',
      'Global competition forces efficiency and innovation.',
      'Integration raises India’s geopolitical weight.']},
    b:{ name:'Swadeshi & protection', pts:[
      'Infant industries need shelter from global giants.',
      'Strategic autonomy in chips, energy, defence and data.',
      'Protect farmers and small traders from volatile world markets.']},
    leans:{ INC:25, DMK:35, AAP:45, BSP:50, BJP:58, CPIM:65, JS:45 } },

  { t:'Liberty & Security', q:'Where is the line between freedom and order?',
    a:{ name:'Expand liberties', pts:[
      'Privacy, dissent and due process are democracy’s essence.',
      'Over-broad security laws chill speech and target the vulnerable.',
      'Scrutiny and strong institutions keep the state honest.']},
    b:{ name:'Prioritise security', pts:[
      'Terrorism, insurgency and information warfare demand a strong state.',
      'Swift action sometimes needs secrecy and wide powers.',
      'Order is the precondition for enjoying any right.']},
    leans:{ CPIM:15, INC:22, DMK:20, BSP:35, AAP:40, BJP:85, JS:40 } }
];

/* ---------- 8. DONATION SETTINGS ---------- */
const DONATION = {
  amounts: [100, 250, 500, 1000, 2000], // quick-pick chips
  default: 250,
  min: 10
};