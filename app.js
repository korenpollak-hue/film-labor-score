// Film-labor Video-Marketing Score v2 — Premium Quiz Engine
// =========================================================

const BACKEND_URL = 'https://imperfectible-unadversely-glinda.ngrok-free.dev';

const CONFIG = {
  calendarLink: 'https://calendly.com/koren-film-labor/30min',
  autoAdvanceDelay: 650,
};

// State
let currentQ = -1; // -1 = landing
const answers = {};
const container = document.getElementById('quizContainer');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const stepInfo = document.getElementById('stepInfo');
const stepCurrent = document.getElementById('stepCurrent');
const stepTotal = document.getElementById('stepTotal');

// ============================================
// QUESTIONS — One per page, Typeform-style
// ============================================

const QUESTIONS = [
  // 0: Landing (not counted in progress)
  { type: 'landing' },

  // 1-2: Easy warm-up questions first (build commitment before email gate)
  {
    type: 'select',
    id: 'videoUsage',
    text: 'Nutzt ihr bereits Video-Content in eurem Marketing?',
    sub: 'Sei ehrlich — das hilft uns, die besten Tipps zu geben.',
    options: [
      { label: 'Ja, regelmäßig', value: 'regular', points: 4, key: 'A' },
      { label: 'Ja, gelegentlich', value: 'occasional', points: 3, key: 'B' },
      { label: 'Wir haben es versucht', value: 'tried', points: 2, key: 'C' },
      { label: 'Nein, noch nicht', value: 'never', points: 1, key: 'D' },
    ],
    autoAdvance: true,
    category: 'strategy',
  },
  {
    type: 'select',
    id: 'videoProduction',
    text: 'Wie produziert ihr aktuell Videos?',
    options: [
      { label: 'Professionelle Agentur', value: 'agency', points: 4, key: 'A' },
      { label: 'Freelancer', value: 'freelancer', points: 3, key: 'B' },
      { label: 'Intern (Smartphone/Equipment)', value: 'inhouse', points: 2, key: 'C' },
      { label: 'Gar nicht', value: 'none', points: 1, key: 'D' },
    ],
    autoAdvance: true,
    category: 'production',
  },

  // 3: Email gate (after 2 easy questions — builds commitment)
  {
    type: 'contact',
    text: 'Fast geschafft — noch ein paar Fragen!',
    sub: 'Trag dich ein, um deinen persönlichen Report per E-Mail zu erhalten.',
  },

  // 4-9: Assessment questions
  {
    type: 'multi',
    id: 'purposes',
    text: 'Wofür würdet ihr Videos einsetzen?',
    sub: 'Wähle alle passenden aus.',
    options: [
      'Recruiting & Employer Branding',
      'Imagefilm',
      'Produktvideos',
      'Social Media',
      'Schulungsvideos',
      'Messevideos',
      'Testimonials',
      'Werbespots',
    ],
    category: 'content',
  },
  {
    type: 'multi',
    id: 'challenges',
    text: 'Was sind eure größten Video-Herausforderungen?',
    sub: 'Wähle alle zutreffenden.',
    options: [
      'Kein Know-how',
      'Zu teuer',
      'Keine Zeit',
      'Wissen nicht wo anfangen',
      'Qualität bisher schlecht',
      'Keine Strategie',
      'ROI unklar',
      'Content-Ideen fehlen',
    ],
    category: 'content',
  },
  {
    type: 'multi',
    id: 'channels',
    text: 'Auf welchen Kanälen teilt ihr Video-Content?',
    options: [
      'LinkedIn', 'Instagram', 'YouTube', 'Website',
      'Facebook', 'TikTok', 'Messen', 'Nirgendwo',
    ],
    category: 'distribution',
  },
  {
    type: 'scale',
    id: 'importance',
    text: 'Wie wichtig ist Video für euer Wachstum in den nächsten 12 Monaten?',
    low: 'Unwichtig',
    high: 'Sehr wichtig',
    category: 'strategy',
  },
  {
    type: 'select',
    id: 'budget',
    text: 'Habt ihr Budget für Video-Produktion eingeplant?',
    options: [
      { label: 'Ja, fest eingeplant', value: 'planned', points: 4, key: 'A' },
      { label: 'Ja, flexibel', value: 'flexible', points: 3, key: 'B' },
      { label: 'Nein, aber offen', value: 'open', points: 2, key: 'C' },
      { label: 'Nein, kein Budget', value: 'none', points: 1, key: 'D' },
    ],
    autoAdvance: true,
    category: 'production',
  },
  {
    type: 'select',
    id: 'timeline',
    text: 'Wann möchtet ihr mit Video-Marketing starten?',
    options: [
      { label: 'So schnell wie möglich', value: 'asap', points: 4, key: 'A' },
      { label: 'In 1–3 Monaten', value: '1-3months', points: 3, key: 'B' },
      { label: 'In 3–6 Monaten', value: '3-6months', points: 2, key: 'C' },
      { label: 'Noch unklar', value: 'unclear', points: 1, key: 'D' },
    ],
    autoAdvance: true,
    category: 'production',
  },

  // 10: Loading/results (not a real question)
  { type: 'loading' },
];

const TOTAL_QUESTIONS = QUESTIONS.filter(q => !['landing', 'loading'].includes(q.type)).length;

// ============================================
// RENDER FUNCTIONS
// ============================================

function render(qIndex) {
  const q = QUESTIONS[qIndex];
  const el = document.createElement('div');
  el.className = 'question';

  switch (q.type) {
    case 'landing': el.innerHTML = renderLanding(); break;
    case 'select': el.innerHTML = renderSelect(q); break;
    case 'multi': el.innerHTML = renderMulti(q); break;
    case 'scale': el.innerHTML = renderScale(q); break;
    case 'contact': el.innerHTML = renderContact(q); break;
    case 'loading': el.innerHTML = renderLoading(); break;
  }

  return el;
}

function renderLanding() {
  return `
    <div class="landing">
      <div class="q-text">Wie gut ist dein Unternehmen für <span class="accent">Video&#8209;Marketing</span> aufgestellt?</div>
      <div class="q-sub">Kostenloser Check in 2 Minuten — mit persönlichem Report und Website-Analyse.</div>
      <div class="value-props">
        <div class="value-prop"><div class="icon">&#x1F3AF;</div> Persönlicher Score</div>
        <div class="value-prop"><div class="icon">&#x1F310;</div> Website-Analyse</div>
        <div class="value-prop"><div class="icon">&#x1F4E7;</div> Report per E-Mail</div>
      </div>
      <button class="btn-primary" onclick="goNext()">Jetzt starten &#x2192;</button>
    </div>`;
}

function renderSelect(q) {
  const opts = q.options.map(o => `
    <div class="option" data-value="${o.value}" data-points="${o.points}" onclick="selectOption('${q.id}', this, ${q.autoAdvance || false})">
      <div class="key">${o.key}</div>
      <div class="text">${o.label}</div>
    </div>`).join('');

  return `
    <div class="q-text">${q.text}</div>
    ${q.sub ? `<div class="q-sub">${q.sub}</div>` : '<div style="margin-bottom:32px"></div>'}
    <div class="options">${opts}</div>
    <div class="kb-hint">Drücke <kbd>A</kbd><kbd>B</kbd><kbd>C</kbd><kbd>D</kbd> oder <kbd>Enter</kbd></div>
    <div class="btn-row">
      <button class="btn-secondary" onclick="goBack()">&#x2190; Zurück</button>
      <div></div>
    </div>`;
}

function renderMulti(q) {
  const chips = q.options.map(o => `
    <button class="chip" data-value="${o}" onclick="toggleChip(this)">${o}</button>`).join('');

  return `
    <div class="q-text">${q.text}</div>
    ${q.sub ? `<div class="q-sub">${q.sub}</div>` : '<div style="margin-bottom:32px"></div>'}
    <div class="chips">${chips}</div>
    <div class="btn-row">
      <button class="btn-secondary" onclick="goBack()">&#x2190; Zurück</button>
      <button class="btn-primary" onclick="submitMulti('${q.id}')">Weiter &#x2192;</button>
    </div>`;
}

function renderScale(q) {
  const btns = [1,2,3,4,5].map(n => `
    <button class="scale-btn" data-value="${n}" onclick="selectScale('${q.id}', this)">${n}</button>`).join('');

  return `
    <div class="q-text">${q.text}</div>
    <div style="margin-bottom:32px"></div>
    <div class="scale">${btns}</div>
    <div class="scale-labels"><span>${q.low}</span><span>${q.high}</span></div>
    <div class="btn-row">
      <button class="btn-secondary" onclick="goBack()">&#x2190; Zurück</button>
      <div></div>
    </div>`;
}

function renderContact(q) {
  return `
    <div class="q-text">${q.text}</div>
    <div class="q-sub">${q.sub}</div>
    <div class="form-grid two-col">
      <div class="field">
        <label>Vorname <span class="req">*</span></label>
        <input type="text" id="firstName" placeholder="Max" autocomplete="given-name">
      </div>
      <div class="field">
        <label>Nachname <span class="req">*</span></label>
        <input type="text" id="lastName" placeholder="Mustermann" autocomplete="family-name">
      </div>
    </div>
    <div class="form-grid" style="margin-top:16px">
      <div class="field">
        <label>Geschäftliche E-Mail <span class="req">*</span></label>
        <input type="email" id="email" placeholder="max@unternehmen.de" autocomplete="email">
      </div>
      <div class="field">
        <label>Unternehmen <span class="req">*</span></label>
        <input type="text" id="company" placeholder="Mustermann GmbH" autocomplete="organization">
      </div>
      <div class="field">
        <label>Website</label>
        <input type="url" id="website" placeholder="https://www.unternehmen.de" autocomplete="url">
      </div>
    </div>
    <div class="form-grid two-col" style="margin-top:16px">
      <div class="field">
        <label>Branche <span class="req">*</span></label>
        <select id="branche">
          <option value="">Bitte wählen</option>
          <option>IT & Software</option>
          <option>Maschinenbau & Industrie</option>
          <option>Pharma & Chemie</option>
          <option>Automotive</option>
          <option>Energie & Umwelt</option>
          <option>Beratung & Dienstleistung</option>
          <option>Finanzen & Versicherung</option>
          <option>Gesundheit & Medizin</option>
          <option>Handel & E-Commerce</option>
          <option>Bau & Immobilien</option>
          <option>Bildung & Forschung</option>
          <option>Logistik & Transport</option>
          <option>Medien & Kommunikation</option>
          <option>Sonstige</option>
        </select>
      </div>
      <div class="field">
        <label>Mitarbeiter <span class="req">*</span></label>
        <select id="companySize">
          <option value="">Bitte wählen</option>
          <option>1–10</option>
          <option>11–50</option>
          <option>51–200</option>
          <option>201–1000</option>
          <option>1000+</option>
        </select>
      </div>
    </div>
    <p class="field-error" id="contactError"></p>
    <div class="btn-row">
      <button class="btn-secondary" onclick="goBack()">&#x2190; Zurück</button>
      <button class="btn-primary" onclick="submitContact()">Weiter &#x2192;</button>
    </div>
    <p class="privacy">Deine Daten werden vertraulich behandelt und niemals weitergegeben.</p>`;
}

function renderLoading() {
  return `
    <div class="loading-center">
      <div class="spinner"></div>
      <div class="q-text" style="font-size:1.3rem">Dein Report wird erstellt…</div>
      <div class="q-sub" style="margin-bottom:28px">Wir analysieren deine Antworten und deine Website.</div>
      <div class="loading-steps">
        <div class="load-step" id="ls-1"><span>&#x23F3;</span> Antworten auswerten</div>
        <div class="load-step" id="ls-2"><span>&#x23F3;</span> Score berechnen</div>
        <div class="load-step" id="ls-3"><span>&#x23F3;</span> Website analysieren</div>
        <div class="load-step" id="ls-4"><span>&#x23F3;</span> Empfehlungen generieren</div>
        <div class="load-step" id="ls-5"><span>&#x23F3;</span> Report per E-Mail senden</div>
      </div>
    </div>`;
}

// ============================================
// NAVIGATION
// ============================================

function showQuestion(index) {
  const old = container.querySelector('.question');
  if (old) {
    old.classList.add('exiting');
    setTimeout(() => {
      container.innerHTML = '';
      const el = render(index);
      container.appendChild(el);
      updateProgress(index);
      if (QUESTIONS[index].type === 'contact') {
        setTimeout(() => document.getElementById('firstName')?.focus(), 400);
      }
    }, 280);
  } else {
    const el = render(index);
    container.appendChild(el);
    updateProgress(index);
  }
}

function updateProgress(index) {
  const q = QUESTIONS[index];
  const isQuiz = !['landing', 'loading'].includes(q?.type);
  const answered = QUESTIONS.slice(0, index).filter(qq => !['landing', 'loading'].includes(qq.type)).length;

  if (isQuiz) {
    progressBar.classList.add('visible');
    stepInfo.classList.add('visible');
    const pct = 10 + (answered / TOTAL_QUESTIONS) * 90;
    progressFill.style.width = pct + '%';
    stepCurrent.textContent = answered + 1;
    stepTotal.textContent = TOTAL_QUESTIONS;
  } else if (q?.type === 'loading') {
    progressFill.style.width = '100%';
    stepInfo.classList.remove('visible');
  } else {
    progressBar.classList.remove('visible');
    stepInfo.classList.remove('visible');
  }
}

function goNext() {
  currentQ++;
  showQuestion(currentQ);
}

function goBack() {
  if (currentQ > 0) {
    currentQ--;
    showQuestion(currentQ);
  }
}

// ============================================
// INTERACTIONS
// ============================================

function selectOption(id, el, autoAdvance) {
  el.parentElement.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  answers[id] = { value: el.dataset.value, points: parseInt(el.dataset.points) || 0 };

  if (autoAdvance) {
    setTimeout(goNext, CONFIG.autoAdvanceDelay);
  }
}

function toggleChip(el) {
  el.classList.toggle('selected');
}

function selectScale(id, el) {
  el.parentElement.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  answers[id] = parseInt(el.dataset.value);
  setTimeout(goNext, CONFIG.autoAdvanceDelay);
}

function submitMulti(id) {
  const selected = [...document.querySelectorAll(`.chip.selected`)].map(c => c.dataset.value);
  answers[id] = selected;
  goNext();
}

function submitContact() {
  const f = (id) => document.getElementById(id)?.value.trim() || '';
  const errEl = document.getElementById('contactError');

  const firstName = f('firstName');
  const lastName = f('lastName');
  const email = f('email');
  const company = f('company');
  const branche = f('branche');
  const size = f('companySize');

  if (!firstName || !lastName || !email || !company || !branche || !size) {
    errEl.textContent = 'Bitte fülle alle Pflichtfelder aus.';
    errEl.classList.add('show');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errEl.textContent = 'Bitte gib eine gültige E-Mail-Adresse ein.';
    errEl.classList.add('show');
    return;
  }

  answers.firstName = firstName;
  answers.lastName = lastName;
  answers.email = email;
  answers.company = company;
  answers.website = f('website');
  answers.branche = branche;
  answers.companySize = { value: size };
  answers.position = '';

  goNext();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  const q = QUESTIONS[currentQ];
  if (!q || q.type !== 'select') return;

  const keyMap = { a: 0, b: 1, c: 2, d: 3 };
  const idx = keyMap[e.key.toLowerCase()];
  if (idx !== undefined) {
    const opts = document.querySelectorAll('.option');
    if (opts[idx]) opts[idx].click();
  }
  if (e.key === 'Enter') {
    const selected = document.querySelector('.option.selected');
    if (selected && !q.autoAdvance) goNext();
  }
});

// ============================================
// SCORING
// ============================================

function calculateScore() {
  const s = { strategy: 0, content: 0, production: 0, distribution: 0 };

  // Strategy
  s.strategy += (answers.videoUsage?.points || 1) * 2.5;
  s.strategy += (answers.importance || 1) * 2;
  s.strategy += Math.min((answers.purposes?.length || 0) * 1.5, 7);
  s.strategy = Math.min(Math.round(s.strategy), 25);

  // Content
  s.content += Math.min((answers.purposes?.length || 0) * 2.5, 12);
  s.content += Math.min((answers.challenges?.length || 0) * 1.5, 8);
  s.content += (answers.importance || 1);
  s.content = Math.min(Math.round(s.content), 25);

  // Production
  s.production += (answers.videoProduction?.points || 1) * 2.5;
  s.production += (answers.budget?.points || 1) * 2.5;
  s.production += (answers.timeline?.points || 1) * 1.25;
  s.production = Math.min(Math.round(s.production), 25);

  // Distribution
  const chs = (answers.channels || []).filter(c => c !== 'Nirgendwo').length;
  s.distribution += Math.min(chs * 3, 15);
  s.distribution += (answers.importance || 1) * 2;
  s.distribution = Math.min(Math.round(s.distribution), 25);

  const total = s.strategy + s.content + s.production + s.distribution;
  return { total, scores: s };
}

function getLevel(total) {
  if (total >= 75) return { label: 'Video-Pro', color: '#22c55e', desc: 'Starke Position! Ihr nutzt Video-Marketing bereits effektiv. Zeit, Qualität und Konsistenz auf das nächste Level zu heben.' };
  if (total >= 55) return { label: 'Video-Fortgeschritten', color: '#3b82f6', desc: 'Solide Grundlage! Ihr wisst, dass Video wichtig ist. Mit einer klaren Strategie könnt ihr deutlich mehr rausholen.' };
  if (total >= 30) return { label: 'Video-Starter', color: '#f59e0b', desc: 'Guter Startpunkt! Ihr habt ungenutztes Potenzial. Die richtigen Schritte machen Video zu eurem Wachstumstreiber.' };
  return { label: 'Video-Neuling', color: '#f97316', desc: 'Große Chance! Von Anfang an alles richtig machen — das ist ein echter Vorteil gegenüber dem Wettbewerb.' };
}

function getRecommendations(scores) {
  const r = [];
  if (scores.strategy < 13) r.push({ icon: '&#x1F525;', title: 'Video-Strategie entwickeln', text: 'Definiert klare Ziele für euren Video-Content. Ein Plan spart langfristig Zeit und Geld.' });
  if (scores.production < 13) r.push({ icon: '&#x1F525;', title: 'Professionelle Produktion starten', text: 'Ein professionelles Video zahlt sich langfristig aus. Startet mit einem Imagefilm oder Recruiting-Video.' });
  if (scores.content < 13) r.push({ icon: '&#x1F4A1;', title: 'Content-Plan erstellen', text: 'Plant Video-Inhalte 3 Monate voraus. Mix aus Evergreen-Content und aktuellem Social Media Content.' });
  if (scores.distribution < 13) r.push({ icon: '&#x1F4A1;', title: 'Multi-Channel-Distribution', text: 'Jedes Video auf mindestens 3 Kanälen ausspielen. Format und Länge je nach Plattform anpassen.' });
  if (answers.purposes?.includes('Recruiting & Employer Branding')) r.push({ icon: '&#x1F3AF;', title: 'Recruiting-Videos priorisieren', text: 'Employer-Branding-Videos sind der effektivste Weg, Fachkräfte zu gewinnen. Zeigt echte Mitarbeiter und echte Einblicke.' });
  r.push({ icon: '&#x1F4DE;', title: 'Nächster Schritt', text: 'In einem kostenlosen 30-Min-Gespräch zeigen wir euch den optimalen Video-Ansatz für euer Unternehmen.' });
  return r.slice(0, 5);
}

function getCatTip(cat, score) {
  const t = {
    strategy: { l: 'Startet mit einem klaren Ziel pro Video.', m: 'Plant Video-Content im Voraus.', h: 'Messt den ROI und optimiert basierend auf Daten.' },
    content: { l: 'Beginnt mit Recruiting oder Testimonials.', m: 'Mix aus Evergreen- und aktuellem Content.', h: 'Experimentiert mit neuen Formaten.' },
    production: { l: 'Ein Basis-Paket mit 2-3 Videos ist der beste Einstieg.', m: 'Gebündelte Drehtage = mehr Content pro Budget.', h: 'Regelmäßiger Produktionsrhythmus aufbauen.' },
    distribution: { l: 'Jedes Video auf Website UND Social Media.', m: 'Formate an die Plattform anpassen.', h: 'Employee Advocacy nutzen.' },
  };
  const level = score < 10 ? 'l' : score < 18 ? 'm' : 'h';
  return t[cat]?.[level] || '';
}

// ============================================
// SUBMIT & RESULTS
// ============================================

async function submitQuiz() {
  currentQ = QUESTIONS.length - 1;
  showQuestion(currentQ);

  const { total, scores } = calculateScore();
  const level = getLevel(total);

  // Animate loading steps
  const steps = ['ls-1', 'ls-2', 'ls-3', 'ls-4', 'ls-5'];
  for (let i = 0; i < steps.length; i++) {
    await delay(500);
    const el = document.getElementById(steps[i]);
    if (el) { el.classList.add('active'); el.querySelector('span').innerHTML = '&#x2699;&#xFE0F;'; }
    if (i > 0) {
      const prev = document.getElementById(steps[i - 1]);
      if (prev) { prev.classList.remove('active'); prev.classList.add('done'); prev.querySelector('span').innerHTML = '&#x2705;'; }
    }
  }

  // Submit to backend
  const payload = { ...answers, score: total, scores, level: level.label, timestamp: new Date().toISOString() };
  let result = null;
  try {
    const resp = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
      body: JSON.stringify(payload),
    });
    result = await resp.json();
  } catch (e) { console.log('Backend:', e); }

  // Finish loading
  await delay(300);
  const last = document.getElementById(steps[steps.length - 1]);
  if (last) { last.classList.remove('active'); last.classList.add('done'); last.querySelector('span').innerHTML = '&#x2705;'; }
  await delay(500);

  showResults(total, scores, level, result);
}

function showResults(total, scores, level, result) {
  progressBar.classList.remove('visible');
  stepInfo.classList.remove('visible');

  const recs = getRecommendations(scores);
  const wa = result?.websiteAnalysis;
  const emailSent = result?.emailSent === true;

  const catNames = { strategy: 'Strategie', content: 'Content', production: 'Produktion', distribution: 'Distribution' };
  const catColors = { strategy: '#f97316', content: '#3b82f6', production: '#22c55e', distribution: '#eab308' };

  container.innerHTML = `<div class="results">
    ${emailSent ? `<div class="email-banner">&#x2709;&#xFE0F; Report an <strong>${answers.email}</strong> gesendet!</div>` : ''}

    <div class="score-hero">
      <div class="score-ring">
        <svg viewBox="0 0 170 170">
          <circle class="track" cx="85" cy="85" r="72" />
          <circle class="fill" id="scoreFill" cx="85" cy="85" r="72" />
        </svg>
        <div class="score-value" id="scoreVal">0<span>/100</span></div>
      </div>
      <div class="score-level" style="color:${level.color}">${level.label}</div>
      <p class="score-desc">${level.desc}</p>
    </div>

    <div class="categories">
      ${Object.entries(scores).map(([k, v]) => `
        <div class="cat-card">
          <div class="cat-header">
            <span class="cat-name">${catNames[k]}</span>
            <span class="cat-score" style="color:${catColors[k]}">${v}/25</span>
          </div>
          <div class="cat-bar"><div class="cat-bar-fill" data-w="${(v/25)*100}" style="background:${catColors[k]}"></div></div>
          <div class="cat-tip">${getCatTip(k, v)}</div>
        </div>`).join('')}
    </div>

    ${wa ? `
      <div class="analysis-card">
        <h3>&#x1F310; Website-Analyse: ${answers.website}</h3>
        <div class="analysis-grid">
          <div class="analysis-item"><div class="al">Video</div><div class="av ${wa.hasVideo ? 'good' : 'bad'}">${wa.hasVideo ? 'Vorhanden' : 'Fehlt'}</div></div>
          <div class="analysis-item"><div class="al">Social Links</div><div class="av ${wa.socialLinks > 2 ? 'good' : wa.socialLinks > 0 ? 'warn' : 'bad'}">${wa.socialLinks} gefunden</div></div>
          <div class="analysis-item"><div class="al">Karriere-Seite</div><div class="av ${wa.hasCareerPage ? 'good' : 'warn'}">${wa.hasCareerPage ? 'Vorhanden' : 'Fehlt'}</div></div>
          <div class="analysis-item"><div class="al">Gesamt</div><div class="av ${wa.overallRating === 'good' ? 'good' : wa.overallRating === 'ok' ? 'warn' : 'bad'}">${wa.overallLabel}</div></div>
        </div>
      </div>` : ''}

    <div class="recs-card">
      <h3>&#x1F4A1; Deine Top-Empfehlungen</h3>
      ${recs.map(r => `
        <div class="rec-item">
          <div class="rec-icon">${r.icon}</div>
          <div class="rec-content"><h4>${r.title}</h4><p>${r.text}</p></div>
        </div>`).join('')}
    </div>

    <div class="cta-card">
      <h3>Bereit für professionelles Video-Marketing?</h3>
      <p>30 Minuten, kostenlos, unverbindlich — wir zeigen euch, wie ihr mit Video mehr Kunden und Talente gewinnt.</p>
      <a href="${CONFIG.calendarLink}" target="_blank" class="btn-primary" style="text-decoration:none">Gespräch buchen &#x2192;</a>
    </div>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Film-labor &middot; <a href="https://film-labor.de" target="_blank">film-labor.de</a></p>
    </div>
  </div>`;

  // Animate score
  requestAnimationFrame(() => {
    setTimeout(() => {
      const circle = document.getElementById('scoreFill');
      if (circle) {
        const circ = 2 * Math.PI * 72;
        circle.style.strokeDasharray = circ;
        circle.style.strokeDashoffset = circ - (total / 100) * circ;
      }
      animateNum('scoreVal', 0, total, 1600);
      document.querySelectorAll('.cat-bar-fill').forEach(b => { b.style.width = b.dataset.w + '%'; });
    }, 100);
  });
}

function animateNum(id, from, to, dur) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.innerHTML = Math.round(from + (to - from) * ease) + '<span>/100</span>';
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ============================================
// INIT
// ============================================

// Handle last question → submit
const origGoNext = goNext;
goNext = function() {
  const nextIdx = currentQ + 1;
  if (nextIdx >= QUESTIONS.length - 1) {
    submitQuiz();
    return;
  }
  currentQ++;
  showQuestion(currentQ);
};

document.addEventListener('DOMContentLoaded', () => {
  currentQ = 0;
  showQuestion(0);
});
