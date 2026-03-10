// Film-labor Video-Marketing Score v3 — FIFA Radar Chart + Expert Insights
// =========================================================================

const BACKEND_URL = 'https://imperfectible-unadversely-glinda.ngrok-free.dev';

const CONFIG = {
  calendarLink: 'https://calendly.com/koren-film-labor/30min',
  autoAdvanceDelay: 650,
};

// State
let currentQ = -1;
const answers = {};
const container = document.getElementById('quizContainer');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const stepInfo = document.getElementById('stepInfo');
const stepCurrent = document.getElementById('stepCurrent');
const stepTotal = document.getElementById('stepTotal');

// ============================================
// QUESTIONS
// ============================================

const QUESTIONS = [
  { type: 'landing' },

  {
    type: 'select', id: 'videoUsage',
    text: 'Nutzt ihr bereits Video-Content in eurem Marketing?',
    sub: 'Sei ehrlich — das hilft uns, die besten Tipps zu geben.',
    options: [
      { label: 'Ja, regelmäßig', value: 'regular', points: 4, key: 'A' },
      { label: 'Ja, gelegentlich', value: 'occasional', points: 3, key: 'B' },
      { label: 'Wir haben es versucht', value: 'tried', points: 2, key: 'C' },
      { label: 'Nein, noch nicht', value: 'never', points: 1, key: 'D' },
    ],
    autoAdvance: true, category: 'strategy',
  },
  {
    type: 'select', id: 'videoProduction',
    text: 'Wie produziert ihr aktuell Videos?',
    options: [
      { label: 'Professionelle Agentur', value: 'agency', points: 4, key: 'A' },
      { label: 'Freelancer', value: 'freelancer', points: 3, key: 'B' },
      { label: 'Intern (Smartphone/Equipment)', value: 'inhouse', points: 2, key: 'C' },
      { label: 'Gar nicht', value: 'none', points: 1, key: 'D' },
    ],
    autoAdvance: true, category: 'production',
  },

  {
    type: 'contact',
    text: 'Fast geschafft — noch ein paar Fragen!',
    sub: 'Trag dich ein, um deinen persönlichen Report per E-Mail zu erhalten.',
  },

  {
    type: 'multi', id: 'purposes',
    text: 'Wofür würdet ihr Videos einsetzen?',
    sub: 'Wähle alle passenden aus.',
    options: [
      'Recruiting & Employer Branding', 'Imagefilm', 'Produktvideos',
      'Social Media', 'Schulungsvideos', 'Messevideos', 'Testimonials', 'Werbespots',
    ],
    category: 'content',
  },
  {
    type: 'multi', id: 'challenges',
    text: 'Was sind eure größten Video-Herausforderungen?',
    sub: 'Wähle alle zutreffenden.',
    options: [
      'Kein Know-how', 'Zu teuer', 'Keine Zeit', 'Wissen nicht wo anfangen',
      'Qualität bisher schlecht', 'Keine Strategie', 'ROI unklar', 'Content-Ideen fehlen',
    ],
    category: 'content',
  },
  {
    type: 'multi', id: 'channels',
    text: 'Auf welchen Kanälen teilt ihr Video-Content?',
    options: [
      'LinkedIn', 'Instagram', 'YouTube', 'Website',
      'Facebook', 'TikTok', 'Messen', 'Nirgendwo',
    ],
    category: 'distribution',
  },
  {
    type: 'scale', id: 'importance',
    text: 'Wie wichtig ist Video für euer Wachstum in den nächsten 12 Monaten?',
    low: 'Unwichtig', high: 'Sehr wichtig',
    category: 'strategy',
  },
  {
    type: 'select', id: 'budget',
    text: 'Habt ihr Budget für Video-Produktion eingeplant?',
    options: [
      { label: 'Ja, fest eingeplant', value: 'planned', points: 4, key: 'A' },
      { label: 'Ja, flexibel', value: 'flexible', points: 3, key: 'B' },
      { label: 'Nein, aber offen', value: 'open', points: 2, key: 'C' },
      { label: 'Nein, kein Budget', value: 'none', points: 1, key: 'D' },
    ],
    autoAdvance: true, category: 'production',
  },
  {
    type: 'select', id: 'timeline',
    text: 'Wann möchtet ihr mit Video-Marketing starten?',
    options: [
      { label: 'So schnell wie möglich', value: 'asap', points: 4, key: 'A' },
      { label: 'In 1–3 Monaten', value: '1-3months', points: 3, key: 'B' },
      { label: 'In 3–6 Monaten', value: '3-6months', points: 2, key: 'C' },
      { label: 'Noch unklar', value: 'unclear', points: 1, key: 'D' },
    ],
    autoAdvance: true, category: 'production',
  },

  { type: 'loading' },
];

const TOTAL_QUESTIONS = QUESTIONS.filter(q => !['landing', 'loading'].includes(q.type)).length;

// ============================================
// EXPERT DATA — Industry benchmarks & statistics
// ============================================

const EXPERT_DATA = {
  stats: {
    videoROI: '87% der Unternehmen berichten von positivem ROI durch Video-Marketing',
    videoGrowth: '91% der Unternehmen nutzen Video als Marketing-Tool — Tendenz steigend',
    linkedInVideo: 'LinkedIn-Videos erhalten 5x mehr Engagement als reine Text-Posts',
    recruitingVideo: '84% der Bewerber sagen, ein Unternehmensvideo hat sie zur Bewerbung überzeugt',
    conversionRate: 'Landing Pages mit Video erhöhen die Conversion um bis zu 80%',
    socialReach: 'Video-Content wird 12x häufiger geteilt als Text und Bilder zusammen',
  },
  benchmarks: {
    strategy: { avg: 12, top: 22, label: 'Strategie' },
    content: { avg: 10, top: 21, label: 'Content' },
    production: { avg: 11, top: 23, label: 'Produktion' },
    distribution: { avg: 9, top: 20, label: 'Distribution' },
  },
  nextSteps: {
    strategy: {
      low: [
        'Definiert 2-3 konkrete Ziele für Video (z.B. Recruiting, Sichtbarkeit, Leads)',
        'Erstellt einen Video-Content-Kalender für die nächsten 3 Monate',
        'Analysiert, welche Videos eure Wettbewerber erfolgreich einsetzen',
      ],
      mid: [
        'Messt den ROI eurer bisherigen Videos (Views, Engagement, Conversions)',
        'Entwickelt eine Video-Strategie mit klaren KPIs pro Kanal',
        'Plant regelmäßige Video-Content-Produktion (z.B. 2x/Monat)',
      ],
      high: [
        'Implementiert A/B-Testing für Thumbnails und Hooks',
        'Nutzt Video-Analytics für datengetriebene Optimierung',
        'Integriert Video in jede Phase der Customer Journey',
      ],
    },
    content: {
      low: [
        'Startet mit einem Employer-Branding-Video — zeigt echte Mitarbeiter',
        'Dreht Testimonial-Videos mit zufriedenen Kunden',
        'Erstellt eine FAQ-Video-Serie zu euren häufigsten Kundenfragen',
      ],
      mid: [
        'Variiert Formate: Kurzvideos (Reels), Interviews, Behind-the-Scenes',
        'Plant Content-Serien statt Einzelvideos für Wiedererkennung',
        'Nutzt User-Generated Content von Mitarbeitern und Kunden',
      ],
      high: [
        'Experimentiert mit interaktiven und personalisierten Video-Formaten',
        'Baut eine Video-Content-Library als Evergreen-Asset auf',
        'Entwickelt Thought-Leadership-Content mit euren Experten',
      ],
    },
    production: {
      low: [
        'Ein professioneller Imagefilm ist der beste Einstieg — einmal investieren, jahrelang nutzen',
        'Plant einen gebündelten Drehtag für 3-5 Videos — spart 40% gegenüber Einzelbuchungen',
        'Setzt auf authentische, echte Aufnahmen statt perfekter Studioqualität',
      ],
      mid: [
        'Etabliert einen regelmäßigen Produktionsrhythmus (monatlich oder quartalsweise)',
        'Kombiniert professionelle Produktion mit intern erstelltem Social-Content',
        'Investiert in eine gute Audio-Qualität — wichtiger als 4K-Video',
      ],
      high: [
        'Baut ein internes Mini-Studio für spontane Video-Aufnahmen auf',
        'Nutzt professionelle Postproduction für Farbkorrektur und Motion Graphics',
        'Skaliert die Produktion mit Templates und wiederverwendbaren Elementen',
      ],
    },
    distribution: {
      low: [
        'Jedes Video muss auf mindestens 3 Plattformen — Website, LinkedIn, YouTube',
        'Passt das Format an: Hochformat für Social, Querformat für YouTube/Website',
        'Nutzt LinkedIn als wichtigsten B2B-Kanal — hier ist eure Zielgruppe',
      ],
      mid: [
        'Implementiert eine Cross-Posting-Strategie mit plattformspezifischen Anpassungen',
        'Nutzt Employee Advocacy — Mitarbeiter-Posts haben 8x mehr Reichweite',
        'Optimiert Posting-Zeiten und Frequenz basierend auf Analytics',
      ],
      high: [
        'Setzt auf Paid Video-Ads auf LinkedIn und YouTube für gezielte Reichweite',
        'Integriert Video in E-Mail-Marketing — erhöht Click-Rates um 300%',
        'Baut eine Community rund um euren Video-Content auf',
      ],
    },
  },
};

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
  if (autoAdvance) setTimeout(goNext, CONFIG.autoAdvanceDelay);
}

function toggleChip(el) { el.classList.toggle('selected'); }

function selectScale(id, el) {
  el.parentElement.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  answers[id] = parseInt(el.dataset.value);
  setTimeout(goNext, CONFIG.autoAdvanceDelay);
}

function submitMulti(id) {
  const selected = [...document.querySelectorAll('.chip.selected')].map(c => c.dataset.value);
  answers[id] = selected;
  goNext();
}

function submitContact() {
  const f = (id) => document.getElementById(id)?.value.trim() || '';
  const errEl = document.getElementById('contactError');

  const firstName = f('firstName'), lastName = f('lastName'), email = f('email');
  const company = f('company'), branche = f('branche'), size = f('companySize');

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

  s.strategy += (answers.videoUsage?.points || 1) * 2.5;
  s.strategy += (answers.importance || 1) * 2;
  s.strategy += Math.min((answers.purposes?.length || 0) * 1.5, 7);
  s.strategy = Math.min(Math.round(s.strategy), 25);

  s.content += Math.min((answers.purposes?.length || 0) * 2.5, 12);
  s.content += Math.min((answers.challenges?.length || 0) * 1.5, 8);
  s.content += (answers.importance || 1);
  s.content = Math.min(Math.round(s.content), 25);

  s.production += (answers.videoProduction?.points || 1) * 2.5;
  s.production += (answers.budget?.points || 1) * 2.5;
  s.production += (answers.timeline?.points || 1) * 1.25;
  s.production = Math.min(Math.round(s.production), 25);

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

// ============================================
// RADAR CHART (FIFA-Style)
// ============================================

function renderRadarChart(scores) {
  const cats = [
    { key: 'strategy', label: 'Strategie', color: '#f97316' },
    { key: 'content', label: 'Content', color: '#3b82f6' },
    { key: 'production', label: 'Produktion', color: '#22c55e' },
    { key: 'distribution', label: 'Distribution', color: '#eab308' },
  ];

  const cx = 150, cy = 150, maxR = 110;
  const n = cats.length;
  const angles = cats.map((_, i) => (Math.PI * 2 * i / n) - Math.PI / 2);

  // Grid lines (rings at 25%, 50%, 75%, 100%)
  let gridLines = '';
  [0.25, 0.5, 0.75, 1].forEach(pct => {
    const r = maxR * pct;
    const pts = angles.map(a => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`).join(' ');
    gridLines += `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
  });

  // Axis lines
  let axisLines = '';
  angles.forEach(a => {
    axisLines += `<line x1="${cx}" y1="${cy}" x2="${cx + maxR * Math.cos(a)}" y2="${cy + maxR * Math.sin(a)}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
  });

  // Industry average polygon
  const avgPoints = cats.map((c, i) => {
    const r = maxR * (EXPERT_DATA.benchmarks[c.key].avg / 25);
    return `${cx + r * Math.cos(angles[i])},${cy + r * Math.sin(angles[i])}`;
  }).join(' ');

  // User score polygon
  const userPoints = cats.map((c, i) => {
    const r = maxR * (scores[c.key] / 25);
    return `${cx + r * Math.cos(angles[i])},${cy + r * Math.sin(angles[i])}`;
  }).join(' ');

  // Score dots
  let dots = '';
  cats.forEach((c, i) => {
    const r = maxR * (scores[c.key] / 25);
    const x = cx + r * Math.cos(angles[i]);
    const y = cy + r * Math.sin(angles[i]);
    dots += `<circle cx="${x}" cy="${y}" r="5" fill="${c.color}" stroke="#0a0a0f" stroke-width="2" class="radar-dot"/>`;
  });

  // Labels
  let labels = '';
  cats.forEach((c, i) => {
    const labelR = maxR + 28;
    const x = cx + labelR * Math.cos(angles[i]);
    const y = cy + labelR * Math.sin(angles[i]);
    const anchor = Math.abs(Math.cos(angles[i])) < 0.1 ? 'middle' : Math.cos(angles[i]) > 0 ? 'start' : 'end';
    labels += `
      <text x="${x}" y="${y - 8}" text-anchor="${anchor}" fill="${c.color}" font-size="12" font-weight="700">${c.label}</text>
      <text x="${x}" y="${y + 8}" text-anchor="${anchor}" fill="rgba(255,255,255,0.5)" font-size="11" font-weight="600">${scores[c.key]}/25</text>`;
  });

  return `
    <svg viewBox="0 0 300 300" class="radar-svg" id="radarChart">
      ${gridLines}
      ${axisLines}
      <polygon points="${avgPoints}" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" stroke-width="1" stroke-dasharray="4,4"/>
      <polygon points="${userPoints}" fill="rgba(249,115,22,0.12)" stroke="url(#scoreGradient)" stroke-width="2.5" class="radar-fill" id="radarFill"/>
      ${dots}
      ${labels}
    </svg>`;
}

// ============================================
// EXPERT RECOMMENDATIONS
// ============================================

function getExpertInsights(scores, total) {
  const insights = [];
  const cats = ['strategy', 'content', 'production', 'distribution'];
  const catNames = { strategy: 'Strategie', content: 'Content', production: 'Produktion', distribution: 'Distribution' };

  cats.forEach(cat => {
    const score = scores[cat];
    const bench = EXPERT_DATA.benchmarks[cat];
    const level = score < 10 ? 'low' : score < 18 ? 'mid' : 'high';
    const steps = EXPERT_DATA.nextSteps[cat][level];

    let comparison;
    if (score > bench.avg + 3) comparison = 'over';
    else if (score >= bench.avg - 2) comparison = 'average';
    else comparison = 'under';

    insights.push({
      category: cat,
      name: catNames[cat],
      score, level, comparison,
      benchAvg: bench.avg,
      benchTop: bench.top,
      steps,
    });
  });

  // Sort: weakest categories first (most improvement potential)
  insights.sort((a, b) => a.score - b.score);
  return insights;
}

function getRelevantStats(scores) {
  const stats = [];
  const allStats = Object.values(EXPERT_DATA.stats);

  if (scores.distribution < 13) stats.push(EXPERT_DATA.stats.socialReach);
  if (scores.strategy < 13) stats.push(EXPERT_DATA.stats.videoROI);
  if (scores.content < 13) stats.push(EXPERT_DATA.stats.conversionRate);
  if (answers.purposes?.includes('Recruiting & Employer Branding')) stats.push(EXPERT_DATA.stats.recruitingVideo);
  if (answers.channels?.includes('LinkedIn')) stats.push(EXPERT_DATA.stats.linkedInVideo);
  stats.push(EXPERT_DATA.stats.videoGrowth);

  // Deduplicate and limit to 3
  return [...new Set(stats)].slice(0, 3);
}

// ============================================
// SUBMIT & RESULTS
// ============================================

async function submitQuiz() {
  currentQ = QUESTIONS.length - 1;
  showQuestion(currentQ);

  const { total, scores } = calculateScore();
  const level = getLevel(total);

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

  await delay(300);
  const last = document.getElementById(steps[steps.length - 1]);
  if (last) { last.classList.remove('active'); last.classList.add('done'); last.querySelector('span').innerHTML = '&#x2705;'; }
  await delay(500);

  showResults(total, scores, level, result);
}

function showResults(total, scores, level, result) {
  progressBar.classList.remove('visible');
  stepInfo.classList.remove('visible');

  const wa = result?.websiteAnalysis;
  const emailSent = result?.emailSent === true;
  const insights = getExpertInsights(scores, total);
  const stats = getRelevantStats(scores);
  const catColors = { strategy: '#f97316', content: '#3b82f6', production: '#22c55e', distribution: '#eab308' };

  // Radar chart
  const radarChart = renderRadarChart(scores);

  // Benchmark comparison bars
  const benchmarkHTML = insights.map(ins => {
    const color = catColors[ins.category];
    const pct = (ins.score / 25) * 100;
    const avgPct = (ins.benchAvg / 25) * 100;
    const compIcon = ins.comparison === 'over' ? '&#x25B2;' : ins.comparison === 'under' ? '&#x25BC;' : '&#x25CF;';
    const compColor = ins.comparison === 'over' ? '#22c55e' : ins.comparison === 'under' ? '#ef4444' : '#f59e0b';
    const compText = ins.comparison === 'over' ? 'Über Durchschnitt' : ins.comparison === 'under' ? 'Unter Durchschnitt' : 'Im Durchschnitt';

    return `
      <div class="bench-card">
        <div class="bench-header">
          <span class="bench-name" style="color:${color}">${ins.name}</span>
          <span class="bench-compare" style="color:${compColor}">${compIcon} ${compText}</span>
        </div>
        <div class="bench-bars">
          <div class="bench-bar-row">
            <span class="bench-label">Du</span>
            <div class="bench-track"><div class="bench-fill" data-w="${pct}" style="background:${color}"></div></div>
            <span class="bench-val" style="color:${color}">${ins.score}</span>
          </div>
          <div class="bench-bar-row">
            <span class="bench-label">&#x2205;</span>
            <div class="bench-track"><div class="bench-fill" data-w="${avgPct}" style="background:rgba(255,255,255,0.15)"></div></div>
            <span class="bench-val">${ins.benchAvg}</span>
          </div>
        </div>
      </div>`;
  }).join('');

  // Next steps (from weakest categories)
  const topInsights = insights.slice(0, 3);
  const nextStepsHTML = topInsights.map(ins => {
    const color = catColors[ins.category];
    const stepsHtml = ins.steps.map(step => `
      <div class="step-item">
        <div class="step-check">&#x25CB;</div>
        <div class="step-text">${step}</div>
      </div>`).join('');

    return `
      <div class="insight-card">
        <div class="insight-header">
          <div class="insight-dot" style="background:${color}"></div>
          <h4>${ins.name}</h4>
          <span class="insight-score" style="color:${color}">${ins.score}/25</span>
        </div>
        <div class="insight-steps">${stepsHtml}</div>
      </div>`;
  }).join('');

  // Stats ticker
  const statsHTML = stats.map(s => `
    <div class="stat-item">
      <div class="stat-icon">&#x1F4CA;</div>
      <div class="stat-text">${s}</div>
    </div>`).join('');

  // Website analysis
  let websiteHTML = '';
  if (wa) {
    const items = [
      { label: 'Video auf Website', value: wa.hasVideo ? 'Vorhanden' : 'Fehlt', status: wa.hasVideo ? 'good' : 'bad' },
      { label: 'Social Media Links', value: `${wa.socialLinks} gefunden`, status: wa.socialLinks > 2 ? 'good' : wa.socialLinks > 0 ? 'warn' : 'bad' },
      { label: 'Karriere-Seite', value: wa.hasCareerPage ? 'Vorhanden' : 'Fehlt', status: wa.hasCareerPage ? 'good' : 'warn' },
      { label: 'SSL-Verschlüsselung', value: wa.hasSSL ? 'Aktiv' : 'Fehlt', status: wa.hasSSL ? 'good' : 'bad' },
      { label: 'Responsive Design', value: wa.isResponsive ? 'Ja' : 'Nein', status: wa.isResponsive ? 'good' : 'bad' },
      { label: 'Gesamtbewertung', value: wa.overallLabel, status: wa.overallRating === 'good' ? 'good' : wa.overallRating === 'ok' ? 'warn' : 'bad' },
    ];

    websiteHTML = `
      <div class="analysis-card">
        <h3>&#x1F310; Website-Analyse</h3>
        <div class="analysis-url">${answers.website}</div>
        <div class="analysis-grid">
          ${items.map(i => `
            <div class="analysis-item">
              <div class="al">${i.label}</div>
              <div class="av ${i.status}">${i.value}</div>
            </div>`).join('')}
        </div>
      </div>`;
  }

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

    <div class="radar-section">
      <h3>Dein Video-Marketing Profil</h3>
      <div class="radar-container">
        ${radarChart}
        <div class="radar-legend">
          <span class="radar-legend-item"><span class="legend-line dashed"></span> Branchendurchschnitt</span>
          <span class="radar-legend-item"><span class="legend-line solid"></span> Dein Score</span>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h3>&#x1F4CA; Wusstest du?</h3>
      ${statsHTML}
    </div>

    <div class="benchmark-section">
      <h3>Dein Score vs. Branchendurchschnitt</h3>
      ${benchmarkHTML}
    </div>

    ${websiteHTML}

    <div class="steps-section">
      <h3>&#x1F680; Deine nächsten Schritte</h3>
      <p class="steps-intro">Basierend auf deinem Profil empfehlen wir diese konkreten Maßnahmen:</p>
      ${nextStepsHTML}
    </div>

    <div class="cta-card">
      <h3>Bereit für professionelles Video-Marketing?</h3>
      <p>30 Minuten, kostenlos, unverbindlich — wir zeigen euch, wie ihr mit Video mehr Kunden und Talente gewinnt.</p>
      <a href="${CONFIG.calendarLink}" target="_blank" class="btn-primary" style="text-decoration:none">Kostenloses Gespräch buchen &#x2192;</a>
    </div>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Film-labor &middot; <a href="https://film-labor.de" target="_blank">film-labor.de</a></p>
    </div>
  </div>`;

  // Animate
  requestAnimationFrame(() => {
    setTimeout(() => {
      const circle = document.getElementById('scoreFill');
      if (circle) {
        const circ = 2 * Math.PI * 72;
        circle.style.strokeDasharray = circ;
        circle.style.strokeDashoffset = circ - (total / 100) * circ;
      }
      animateNum('scoreVal', 0, total, 1600);
      document.querySelectorAll('.bench-fill').forEach(b => { b.style.width = b.dataset.w + '%'; });
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
