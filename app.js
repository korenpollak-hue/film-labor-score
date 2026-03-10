// Film-labor Video-Marketing Score - Lead Magnet App
// ===================================================

const APPS_SCRIPT_URL = 'https://imperfectible-unadversely-glinda.ngrok-free.dev';

const CONFIG = {
  totalSteps: 5,
  companyName: 'Film-labor',
  calendarLink: 'https://calendly.com/koren-film-labor/30min'
};

// State
let currentStep = 0;
const answers = {};

// DOM Elements
const stepsContainer = document.getElementById('steps');
const progressContainer = document.querySelector('.progress-container');
const progressFill = document.querySelector('.progress-bar-fill');
const progressCurrent = document.getElementById('progress-current');
const progressTotal = document.getElementById('progress-total');

// ==================
// QUIZ QUESTIONS DATA
// ==================

const BRANCHES = [
  'IT & Software', 'Maschinenbau & Industrie', 'Pharma & Chemie',
  'Automotive', 'Energie & Umwelt', 'Beratung & Dienstleistung',
  'Finanzen & Versicherung', 'Gesundheit & Medizin', 'Handel & E-Commerce',
  'Bau & Immobilien', 'Bildung & Forschung', 'Logistik & Transport',
  'Medien & Kommunikation', 'Gastronomie & Hotellerie', 'Sonstige'
];

const VIDEO_USAGE = [
  { value: 'regular', label: 'Ja, regelmäßig (monatlich+)', points: 4 },
  { value: 'occasional', label: 'Ja, gelegentlich (paar mal im Jahr)', points: 3 },
  { value: 'tried', label: 'Wir haben es versucht, aber aufgehört', points: 2 },
  { value: 'never', label: 'Nein, noch nicht', points: 1 }
];

const VIDEO_PRODUCTION = [
  { value: 'agency', label: 'Professionelle Agentur/Produktionsfirma', points: 4 },
  { value: 'freelancer', label: 'Freelancer', points: 3 },
  { value: 'inhouse', label: 'Intern (Smartphone/eigenes Equipment)', points: 2 },
  { value: 'none', label: 'Gar nicht', points: 1 }
];

const VIDEO_PURPOSES = [
  'Recruiting & Employer Branding',
  'Imagefilm / Unternehmensfilm',
  'Produktvideos & Demos',
  'Social Media Content',
  'Schulungs- & Erklärvideos',
  'Messevideos & Events',
  'Kundenreferenzen & Testimonials',
  'Werbespots & Ads'
];

const CHALLENGES = [
  'Kein internes Know-how',
  'Zu hohe Kosten erwartet',
  'Keine Zeit für Planung/Produktion',
  'Wissen nicht, wo anfangen',
  'Bisherige Qualität war nicht gut',
  'Keine klare Video-Strategie',
  'Schwer, ROI zu messen',
  'Content-Ideen fehlen'
];

const BUDGET_OPTIONS = [
  { value: 'planned', label: 'Ja, fest eingeplant', points: 4 },
  { value: 'flexible', label: 'Ja, flexibel', points: 3 },
  { value: 'open', label: 'Nein, aber offen dafür', points: 2 },
  { value: 'none', label: 'Nein, kein Budget', points: 1 }
];

const TIMELINE_OPTIONS = [
  { value: 'asap', label: 'So schnell wie möglich', points: 4 },
  { value: '1-3months', label: 'In 1-3 Monaten', points: 3 },
  { value: '3-6months', label: 'In 3-6 Monaten', points: 2 },
  { value: 'unclear', label: 'Noch unklar', points: 1 }
];

// ==================
// STEP RENDERING
// ==================

function renderStep(stepNum) {
  const step = document.createElement('div');
  step.className = 'step active';
  step.id = `step-${stepNum}`;

  switch (stepNum) {
    case 0:
      step.innerHTML = renderLanding();
      break;
    case 1:
      step.innerHTML = renderContactForm();
      break;
    case 2:
      step.innerHTML = renderCurrentSituation();
      break;
    case 3:
      step.innerHTML = renderGoalsChallenges();
      break;
    case 4:
      step.innerHTML = renderReadiness();
      break;
    case 5:
      step.innerHTML = renderLoading();
      break;
    case 6:
      // Results - rendered separately
      break;
  }

  return step;
}

function renderLanding() {
  return `
    <div class="landing">
      <h1>Wie gut ist dein Unternehmen für <span class="accent">Video-Marketing</span> aufgestellt?</h1>
      <p>Mach den kostenlosen Check in 2 Minuten und erhalte deinen persönlichen Video-Marketing Report mit konkreten Handlungsempfehlungen.</p>
      <div class="features">
        <div class="feature-card">
          <div class="icon">&#x1F3AF;</div>
          <h3>Persönlicher Score</h3>
          <p>Dein Video-Readiness Level in 4 Kategorien</p>
        </div>
        <div class="feature-card">
          <div class="icon">&#x1F4CB;</div>
          <h3>Konkrete Tipps</h3>
          <p>Sofort umsetzbare Empfehlungen</p>
        </div>
        <div class="feature-card">
          <div class="icon">&#x1F310;</div>
          <h3>Website-Check</h3>
          <p>Kostenlose Analyse deiner Online-Präsenz</p>
        </div>
      </div>
      <button class="btn-primary" onclick="nextStep()">
        Jetzt Score berechnen &#x2192;
      </button>
      <div class="trust">
        <div class="trust-item">&#x1F512; 100% kostenlos</div>
        <div class="trust-item">&#x23F1; Nur 2 Minuten</div>
        <div class="trust-item">&#x1F4E7; Report per E-Mail</div>
      </div>
    </div>`;
}

function renderContactForm() {
  return `
    <h2 class="step-title">Über dich & dein Unternehmen</h2>
    <p class="step-subtitle">Damit wir deinen Report personalisieren können</p>
    <div class="form-row">
      <div class="form-group">
        <label>Vorname <span class="required">*</span></label>
        <input type="text" id="firstName" placeholder="Max" required>
      </div>
      <div class="form-group">
        <label>Nachname <span class="required">*</span></label>
        <input type="text" id="lastName" placeholder="Mustermann" required>
      </div>
    </div>
    <div class="form-group">
      <label>E-Mail <span class="required">*</span></label>
      <input type="email" id="email" placeholder="max@unternehmen.de" required>
    </div>
    <div class="form-group">
      <label>Unternehmen <span class="required">*</span></label>
      <input type="text" id="company" placeholder="Mustermann GmbH" required>
    </div>
    <div class="form-group">
      <label>Website <span class="required">*</span></label>
      <input type="url" id="website" placeholder="https://www.unternehmen.de">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Position</label>
        <input type="text" id="position" placeholder="z.B. Marketing-Leiter">
      </div>
      <div class="form-group">
        <label>Branche <span class="required">*</span></label>
        <select id="branche">
          <option value="">Bitte wählen...</option>
          ${BRANCHES.map(b => `<option value="${b}">${b}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>Unternehmensgröße <span class="required">*</span></label>
      <div class="option-cards" id="companySize">
        ${['1-10 Mitarbeiter', '11-50 Mitarbeiter', '51-200 Mitarbeiter', '201-1000 Mitarbeiter', '1000+ Mitarbeiter']
          .map(s => `<div class="option-card" data-value="${s}" onclick="selectOption('companySize', this)">
            <div class="radio"></div>
            <span class="option-text">${s}</span>
          </div>`).join('')}
      </div>
    </div>
    <div id="contact-error" class="error-message"></div>
    <div class="btn-row">
      <button class="btn-secondary" onclick="prevStep()">&larr; Zurück</button>
      <button class="btn-primary" onclick="validateAndNext(1)">Weiter &rarr;</button>
    </div>
    <p class="privacy-note">Deine Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.</p>`;
}

function renderCurrentSituation() {
  return `
    <h2 class="step-title">Eure aktuelle Video-Situation</h2>
    <p class="step-subtitle">Hilft uns, euer aktuelles Level einzuschätzen</p>

    <div class="question">
      <div class="question-label">Nutzt ihr bereits Video-Content im Marketing?</div>
      <div class="option-cards" id="videoUsage">
        ${VIDEO_USAGE.map(o => `<div class="option-card" data-value="${o.value}" data-points="${o.points}" onclick="selectOption('videoUsage', this)">
          <div class="radio"></div>
          <span class="option-text">${o.label}</span>
        </div>`).join('')}
      </div>
    </div>

    <div class="question">
      <div class="question-label">Wie produziert ihr aktuell Videos?</div>
      <div class="option-cards" id="videoProduction">
        ${VIDEO_PRODUCTION.map(o => `<div class="option-card" data-value="${o.value}" data-points="${o.points}" onclick="selectOption('videoProduction', this)">
          <div class="radio"></div>
          <span class="option-text">${o.label}</span>
        </div>`).join('')}
      </div>
    </div>

    <div class="question">
      <div class="question-label">Auf welchen Kanälen teilt ihr Video-Content? <span style="color:var(--text-dim)">(Mehrfachauswahl)</span></div>
      <div class="chip-grid" id="channels">
        ${['LinkedIn', 'Instagram', 'YouTube', 'Website', 'Facebook', 'TikTok', 'Messen/Events', 'Intern', 'Nirgendwo']
          .map(c => `<button class="chip" data-value="${c}" onclick="toggleChip(this)">${c}</button>`).join('')}
      </div>
    </div>

    <div class="btn-row">
      <button class="btn-secondary" onclick="prevStep()">&larr; Zurück</button>
      <button class="btn-primary" onclick="validateAndNext(2)">Weiter &rarr;</button>
    </div>`;
}

function renderGoalsChallenges() {
  return `
    <h2 class="step-title">Ziele & Herausforderungen</h2>
    <p class="step-subtitle">Was wollt ihr mit Video erreichen?</p>

    <div class="question">
      <div class="question-label">Wofür würdet ihr Videos einsetzen? <span style="color:var(--text-dim)">(Mehrfachauswahl)</span></div>
      <div class="chip-grid" id="purposes">
        ${VIDEO_PURPOSES.map(p => `<button class="chip" data-value="${p}" onclick="toggleChip(this)">${p}</button>`).join('')}
      </div>
    </div>

    <div class="question">
      <div class="question-label">Was sind eure größten Herausforderungen beim Thema Video? <span style="color:var(--text-dim)">(Mehrfachauswahl)</span></div>
      <div class="chip-grid" id="challenges">
        ${CHALLENGES.map(c => `<button class="chip" data-value="${c}" onclick="toggleChip(this)">${c}</button>`).join('')}
      </div>
    </div>

    <div class="question">
      <div class="question-label">Wie wichtig ist Video-Content für eure Wachstumsstrategie in den nächsten 12 Monaten?</div>
      <div class="scale-container" id="importance">
        ${[1,2,3,4,5].map(n => `<button class="scale-btn" data-value="${n}" onclick="selectScale('importance', this)">${n}</button>`).join('')}
      </div>
      <div class="scale-labels">
        <span>Nicht wichtig</span>
        <span>Sehr wichtig</span>
      </div>
    </div>

    <div class="btn-row">
      <button class="btn-secondary" onclick="prevStep()">&larr; Zurück</button>
      <button class="btn-primary" onclick="validateAndNext(3)">Weiter &rarr;</button>
    </div>`;
}

function renderReadiness() {
  return `
    <h2 class="step-title">Budget & Bereitschaft</h2>
    <p class="step-subtitle">Letzte Fragen - dann berechnen wir deinen Score!</p>

    <div class="question">
      <div class="question-label">Habt ihr ein Budget für Video-Produktion eingeplant?</div>
      <div class="option-cards" id="budget">
        ${BUDGET_OPTIONS.map(o => `<div class="option-card" data-value="${o.value}" data-points="${o.points}" onclick="selectOption('budget', this)">
          <div class="radio"></div>
          <span class="option-text">${o.label}</span>
        </div>`).join('')}
      </div>
    </div>

    <div class="question">
      <div class="question-label">Wann möchtet ihr mit Video-Marketing starten (oder ausbauen)?</div>
      <div class="option-cards" id="timeline">
        ${TIMELINE_OPTIONS.map(o => `<div class="option-card" data-value="${o.value}" data-points="${o.points}" onclick="selectOption('timeline', this)">
          <div class="radio"></div>
          <span class="option-text">${o.label}</span>
        </div>`).join('')}
      </div>
    </div>

    <div class="question">
      <div class="question-label">Wie zufrieden seid ihr mit eurer aktuellen Online-Präsenz (Website, Social Media)?</div>
      <div class="scale-container" id="onlinePresence">
        ${[1,2,3,4,5].map(n => `<button class="scale-btn" data-value="${n}" onclick="selectScale('onlinePresence', this)">${n}</button>`).join('')}
      </div>
      <div class="scale-labels">
        <span>Gar nicht</span>
        <span>Sehr zufrieden</span>
      </div>
    </div>

    <div class="btn-row">
      <button class="btn-secondary" onclick="prevStep()">&larr; Zurück</button>
      <button class="btn-primary" id="submitBtn" onclick="submitQuiz()">Score berechnen &#x1F680;</button>
    </div>`;
}

function renderLoading() {
  return `
    <div class="loading-screen">
      <div class="loader-ring"></div>
      <h2>Dein Report wird erstellt...</h2>
      <p>Wir analysieren deine Antworten und deine Website</p>
      <div class="loading-steps">
        <div class="loading-step" id="load-1"><span class="step-icon">&#x23F3;</span> Antworten auswerten</div>
        <div class="loading-step" id="load-2"><span class="step-icon">&#x23F3;</span> Video-Score berechnen</div>
        <div class="loading-step" id="load-3"><span class="step-icon">&#x23F3;</span> Website analysieren</div>
        <div class="loading-step" id="load-4"><span class="step-icon">&#x23F3;</span> Empfehlungen generieren</div>
        <div class="loading-step" id="load-5"><span class="step-icon">&#x23F3;</span> Report per E-Mail senden</div>
      </div>
    </div>`;
}

// ==================
// INTERACTION HANDLERS
// ==================

function selectOption(groupId, element) {
  const group = document.getElementById(groupId);
  group.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  element.classList.add('selected');
  answers[groupId] = {
    value: element.dataset.value,
    points: parseInt(element.dataset.points) || 0
  };
}

function toggleChip(element) {
  element.classList.toggle('selected');
}

function selectScale(groupId, element) {
  const container = document.getElementById(groupId);
  container.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('selected'));
  element.classList.add('selected');
  answers[groupId] = parseInt(element.dataset.value);
}

function getSelectedChips(groupId) {
  const container = document.getElementById(groupId);
  return Array.from(container.querySelectorAll('.chip.selected')).map(c => c.dataset.value);
}

// ==================
// NAVIGATION
// ==================

function showStep(stepNum) {
  stepsContainer.innerHTML = '';
  const step = renderStep(stepNum);
  stepsContainer.appendChild(step);

  // Update progress
  if (stepNum > 0 && stepNum <= CONFIG.totalSteps) {
    progressContainer.classList.add('visible');
    const percent = ((stepNum) / CONFIG.totalSteps) * 100;
    progressFill.style.width = percent + '%';
    progressCurrent.textContent = stepNum;
    progressTotal.textContent = CONFIG.totalSteps;
  } else {
    progressContainer.classList.remove('visible');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep() {
  currentStep++;
  showStep(currentStep);
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

// ==================
// VALIDATION
// ==================

function validateAndNext(step) {
  const errorEl = document.getElementById('contact-error');

  switch (step) {
    case 1: {
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const email = document.getElementById('email').value.trim();
      const company = document.getElementById('company').value.trim();
      const website = document.getElementById('website').value.trim();
      const branche = document.getElementById('branche').value;
      const position = document.getElementById('position').value.trim();

      if (!firstName || !lastName || !email || !company || !branche) {
        showError(errorEl, 'Bitte fülle alle Pflichtfelder aus.');
        return;
      }
      if (!isValidEmail(email)) {
        showError(errorEl, 'Bitte gib eine gültige E-Mail-Adresse ein.');
        return;
      }
      if (!answers.companySize) {
        showError(errorEl, 'Bitte wähle die Unternehmensgröße aus.');
        return;
      }

      answers.firstName = firstName;
      answers.lastName = lastName;
      answers.email = email;
      answers.company = company;
      answers.website = website;
      answers.branche = branche;
      answers.position = position;
      break;
    }
    case 2: {
      if (!answers.videoUsage) {
        alert('Bitte beantworte alle Fragen.');
        return;
      }
      if (!answers.videoProduction) {
        alert('Bitte beantworte alle Fragen.');
        return;
      }
      answers.channels = getSelectedChips('channels');
      break;
    }
    case 3: {
      answers.purposes = getSelectedChips('purposes');
      answers.challenges = getSelectedChips('challenges');
      if (!answers.importance) {
        alert('Bitte bewerte die Wichtigkeit von Video-Content.');
        return;
      }
      break;
    }
  }

  nextStep();
}

function showError(el, msg) {
  if (el) {
    el.textContent = msg;
    el.classList.add('visible');
    setTimeout(() => el.classList.remove('visible'), 4000);
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ==================
// SCORING LOGIC
// ==================

function calculateScore() {
  const scores = {
    strategy: 0,    // max 25
    content: 0,     // max 25
    production: 0,  // max 25
    distribution: 0 // max 25
  };

  // Strategy (video usage + importance + purposes diversity)
  scores.strategy += (answers.videoUsage?.points || 1) * 2; // 2-8
  scores.strategy += (answers.importance || 1) * 2;         // 2-10
  scores.strategy += Math.min((answers.purposes?.length || 0) * 2, 7); // 0-7
  scores.strategy = Math.min(scores.strategy, 25);

  // Content (purposes + challenges awareness)
  scores.content += Math.min((answers.purposes?.length || 0) * 3, 12); // 0-12
  scores.content += Math.min((answers.challenges?.length || 0) * 2, 8); // 0-8 (awareness of challenges = good)
  scores.content += (answers.importance || 1);              // 1-5
  scores.content = Math.min(scores.content, 25);

  // Production (current production + budget + timeline)
  scores.production += (answers.videoProduction?.points || 1) * 2.5; // 2.5-10
  scores.production += (answers.budget?.points || 1) * 2.5;         // 2.5-10
  scores.production += (answers.timeline?.points || 1) * 1.25;      // 1.25-5
  scores.production = Math.min(Math.round(scores.production), 25);

  // Distribution (channels + online presence)
  const channelCount = (answers.channels || []).filter(c => c !== 'Nirgendwo').length;
  scores.distribution += Math.min(channelCount * 3, 15);  // 0-15
  scores.distribution += (answers.onlinePresence || 1) * 2; // 2-10
  scores.distribution = Math.min(scores.distribution, 25);

  const total = scores.strategy + scores.content + scores.production + scores.distribution;

  return { total, scores, maxScore: 100 };
}

function getScoreLevel(total) {
  if (total >= 80) return {
    label: 'Video-Pro',
    color: '#22c55e',
    description: 'Starke Position! Ihr nutzt Video-Marketing bereits effektiv. Jetzt geht es darum, die Qualität und Konsistenz auf das nächste Level zu heben.'
  };
  if (total >= 60) return {
    label: 'Video-Fortgeschritten',
    color: '#3b82f6',
    description: 'Solide Grundlage! Ihr wisst, dass Video wichtig ist, und setzt es teilweise ein. Mit einer klaren Strategie könnt ihr deutlich mehr rausholen.'
  };
  if (total >= 35) return {
    label: 'Video-Starter',
    color: '#eab308',
    description: 'Guter Startpunkt! Ihr habt Potenzial, das noch nicht ausgeschöpft wird. Mit den richtigen Schritten könnt ihr Video als Wachstumstreiber nutzen.'
  };
  return {
    label: 'Video-Neuling',
    color: '#e8590c',
    description: 'Große Chance! Ihr steht am Anfang, was bedeutet: Ihr könnt von Anfang an alles richtig machen. Das ist ein echter Vorteil gegenüber dem Wettbewerb.'
  };
}

function getCategoryRecommendations(scores) {
  const recs = [];

  // Strategy recommendations
  if (scores.strategy < 12) {
    recs.push({
      priority: 'high',
      title: 'Video-Strategie entwickeln',
      text: 'Definiert klare Ziele für euren Video-Content: Was wollt ihr erreichen? Wen wollt ihr ansprechen? Welche Botschaft soll ankommen?'
    });
  } else if (scores.strategy < 20) {
    recs.push({
      priority: 'medium',
      title: 'Video-Strategie verfeinern',
      text: 'Ihr habt eine Grundstrategie. Erstellt einen Content-Kalender und plant Video-Inhalte 3 Monate im Voraus.'
    });
  }

  // Content recommendations
  if (scores.content < 12) {
    recs.push({
      priority: 'high',
      title: 'Content-Plan erstellen',
      text: 'Startet mit einem einfachen Recruiting-Video oder Imagefilm. Ein professionelles Video kann die Bewerbungsrate um bis zu 34% steigern.'
    });
  } else {
    recs.push({
      priority: 'medium',
      title: 'Content-Mix optimieren',
      text: 'Nutzt verschiedene Videoformate für verschiedene Ziele: kurze Social-Clips für Reichweite, längere Videos für Vertrauen.'
    });
  }

  // Production recommendations
  if (scores.production < 12) {
    recs.push({
      priority: 'high',
      title: 'Professionelle Produktion starten',
      text: 'Ein professionell produziertes Video zahlt sich langfristig aus. Setzt auf Qualität statt Quantität beim Einstieg.'
    });
  } else {
    recs.push({
      priority: 'low',
      title: 'Produktionsworkflow optimieren',
      text: 'Bündelt Drehtage, um Kosten zu sparen. Ein Drehtag kann Material für 3-5 verschiedene Videos liefern.'
    });
  }

  // Distribution recommendations
  if (scores.distribution < 12) {
    recs.push({
      priority: 'high',
      title: 'Multi-Channel-Distribution aufbauen',
      text: 'Jedes Video sollte auf mindestens 3 Kanälen ausgespielt werden. Passt Format und Länge je nach Plattform an.'
    });
  } else {
    recs.push({
      priority: 'low',
      title: 'Reichweite maximieren',
      text: 'Testet bezahlte Promotion für eure besten Videos. Schon kleine Budgets auf LinkedIn können die Reichweite verzehnfachen.'
    });
  }

  // Add purpose-specific recs
  if (answers.purposes?.includes('Recruiting & Employer Branding')) {
    recs.push({
      priority: 'medium',
      title: 'Recruiting-Videos priorisieren',
      text: 'Employer-Branding-Videos sind aktuell einer der effektivsten Wege, um Fachkräfte zu gewinnen. Zeigt echte Mitarbeiter und echte Einblicke.'
    });
  }

  return recs;
}

function getCategoryTip(category, score) {
  const tips = {
    strategy: {
      low: 'Tipp: Startet mit einem klaren Ziel pro Video. "Wir wollen X erreichen" statt "Wir brauchen ein Video".',
      mid: 'Tipp: Plant Video-Content im Voraus und bindet ihn in eure Marketing-Strategie ein.',
      high: 'Tipp: Messt den ROI eurer Videos und optimiert basierend auf Daten.'
    },
    content: {
      low: 'Tipp: Beginnt mit den Formaten, die den größten Impact haben: Recruiting oder Testimonials.',
      mid: 'Tipp: Erstellt einen Mix aus Evergreen-Content (Imagefilm) und aktuellem Content (Social Media).',
      high: 'Tipp: Experimentiert mit neuen Formaten wie Behind-the-Scenes oder Live-Content.'
    },
    production: {
      low: 'Tipp: Ein professionelles Basispaket mit 2-3 Videos ist der beste Einstieg.',
      mid: 'Tipp: Nutzt gebündelte Drehtage, um mehr Content pro Budget zu produzieren.',
      high: 'Tipp: Baut einen regelmäßigen Produktionsrhythmus auf (z.B. monatlich).'
    },
    distribution: {
      low: 'Tipp: Jedes Video gehört auf eure Website UND in Social Media. Minimum 3 Kanäle.',
      mid: 'Tipp: Passt jedes Video an die Plattform an: Hochformat für Stories, Querformat für YouTube.',
      high: 'Tipp: Setzt auf Employee Advocacy - lasst Mitarbeiter Videos auf ihren Profilen teilen.'
    }
  };

  const level = score < 10 ? 'low' : score < 18 ? 'mid' : 'high';
  return tips[category][level];
}

// ==================
// SUBMIT & RESULTS
// ==================

async function submitQuiz() {
  // Collect remaining answers
  if (!answers.budget) {
    alert('Bitte beantworte alle Fragen.');
    return;
  }
  if (!answers.timeline) {
    alert('Bitte beantworte alle Fragen.');
    return;
  }

  currentStep = 5;
  showStep(5);

  // Calculate score
  const { total, scores } = calculateScore();
  const level = getScoreLevel(total);

  // Animate loading steps
  const loadingSteps = ['load-1', 'load-2', 'load-3', 'load-4', 'load-5'];
  for (let i = 0; i < loadingSteps.length; i++) {
    await delay(600);
    const el = document.getElementById(loadingSteps[i]);
    if (el) {
      el.classList.add('active');
      el.querySelector('.step-icon').innerHTML = '&#x23F3;';
    }
    if (i > 0) {
      const prev = document.getElementById(loadingSteps[i - 1]);
      if (prev) {
        prev.classList.remove('active');
        prev.classList.add('done');
        prev.querySelector('.step-icon').innerHTML = '&#x2705;';
      }
    }
  }

  // Submit to backend (non-blocking)
  const payload = {
    ...answers,
    score: total,
    scores: scores,
    level: level.label,
    timestamp: new Date().toISOString()
  };

  let backendResult = null;
  try {
    if (APPS_SCRIPT_URL && !APPS_SCRIPT_URL.includes('%%')) {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });
      backendResult = await response.json();
    }
  } catch (e) {
    console.log('Backend submission failed (non-critical):', e);
  }

  // Mark last loading step as done
  await delay(400);
  const lastStep = document.getElementById('load-5');
  if (lastStep) {
    lastStep.classList.remove('active');
    lastStep.classList.add('done');
    lastStep.querySelector('.step-icon').innerHTML = '&#x2705;';
  }

  await delay(600);

  // Show results
  showResults(total, scores, level, backendResult);
}

function showResults(total, scores, level, backendResult) {
  currentStep = 6;
  progressContainer.classList.remove('visible');

  const recommendations = getCategoryRecommendations(scores);
  const websiteAnalysis = backendResult?.websiteAnalysis || null;

  const categoryNames = {
    strategy: 'Strategie',
    content: 'Content',
    production: 'Produktion',
    distribution: 'Distribution'
  };

  const categoryColors = {
    strategy: '#e8590c',
    content: '#3b82f6',
    production: '#22c55e',
    distribution: '#eab308'
  };

  const emailSent = backendResult?.emailSent === true;

  const html = `
    <div class="results">
      ${emailSent ? `
        <div class="email-banner">
          <span class="icon">&#x2709;&#xFE0F;</span>
          <span>Dein ausführlicher Report wurde an <strong>${answers.email}</strong> gesendet!</span>
        </div>
      ` : ''}

      <div class="score-hero">
        <div class="score-circle">
          <svg viewBox="0 0 160 160">
            <circle class="track" cx="80" cy="80" r="70" />
            <circle class="fill" id="scoreFill" cx="80" cy="80" r="70" />
          </svg>
          <div class="score-number" id="scoreNum">0<span>/100</span></div>
        </div>
        <div class="score-label" style="color:${level.color}">${level.label}</div>
        <p class="score-desc">${level.description}</p>
      </div>

      <div class="categories">
        ${Object.entries(scores).map(([key, score]) => `
          <div class="category-card">
            <div class="category-header">
              <span class="category-name">${categoryNames[key]}</span>
              <span class="category-score">${score}/25</span>
            </div>
            <div class="category-bar-bg">
              <div class="category-bar-fill" data-width="${(score / 25) * 100}" style="background: ${categoryColors[key]}"></div>
            </div>
            <div class="category-tip">${getCategoryTip(key, score)}</div>
          </div>
        `).join('')}
      </div>

      ${websiteAnalysis ? `
        <div class="website-analysis">
          <h3>&#x1F310; Website-Analyse: ${answers.website}</h3>
          <div class="analysis-grid">
            <div class="analysis-item">
              <div class="label">Video auf Website</div>
              <div class="value ${websiteAnalysis.hasVideo ? 'good' : 'bad'}">${websiteAnalysis.hasVideo ? 'Vorhanden' : 'Nicht gefunden'}</div>
            </div>
            <div class="analysis-item">
              <div class="label">Social Media Links</div>
              <div class="value ${websiteAnalysis.socialLinks > 2 ? 'good' : websiteAnalysis.socialLinks > 0 ? 'warning' : 'bad'}">${websiteAnalysis.socialLinks} gefunden</div>
            </div>
            <div class="analysis-item">
              <div class="label">Karriere-Seite</div>
              <div class="value ${websiteAnalysis.hasCareerPage ? 'good' : 'warning'}">${websiteAnalysis.hasCareerPage ? 'Vorhanden' : 'Nicht gefunden'}</div>
            </div>
            <div class="analysis-item">
              <div class="label">Gesamteindruck</div>
              <div class="value ${websiteAnalysis.overallRating === 'good' ? 'good' : websiteAnalysis.overallRating === 'ok' ? 'warning' : 'bad'}">${websiteAnalysis.overallLabel || 'Analysiert'}</div>
            </div>
          </div>
        </div>
      ` : answers.website ? `
        <div class="website-analysis">
          <h3>&#x1F310; Website-Analyse</h3>
          <p style="color:var(--text-muted); font-size: 0.9rem;">Die Website-Analyse wird in deinem E-Mail-Report bereitgestellt.</p>
        </div>
      ` : ''}

      <div class="recommendations">
        <h3>&#x1F4A1; Deine Top-Empfehlungen</h3>
        ${recommendations.map(r => `
          <div class="rec-item">
            <div class="rec-icon ${r.priority}">
              ${r.priority === 'high' ? '&#x1F525;' : r.priority === 'medium' ? '&#x1F4A1;' : '&#x2705;'}
            </div>
            <div class="rec-content">
              <h4>${r.title}</h4>
              <p>${r.text}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="cta-section">
        <h3>Bereit, euer Video-Marketing aufs nächste Level zu heben?</h3>
        <p>In einem kostenlosen 30-Minuten-Gespräch zeigen wir euch, wie ihr mit professionellem Video-Content mehr Kunden und Talente gewinnt.</p>
        <a href="${CONFIG.calendarLink}" target="_blank" class="btn-primary" style="text-decoration:none">
          Kostenloses Beratungsgespräch buchen &#x2192;
        </a>
      </div>

      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Film-labor &middot; Filmproduktion für B2B-Unternehmen</p>
        <p style="margin-top: 8px;"><a href="https://film-labor.de" target="_blank">film-labor.de</a></p>
      </div>
    </div>`;

  stepsContainer.innerHTML = html;

  // Animate score
  requestAnimationFrame(() => {
    setTimeout(() => {
      // Animate circle
      const circle = document.getElementById('scoreFill');
      if (circle) {
        const circumference = 2 * Math.PI * 70;
        const offset = circumference - (total / 100) * circumference;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = offset;
      }

      // Animate number
      animateNumber('scoreNum', 0, total, 1500);

      // Animate category bars
      document.querySelectorAll('.category-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }, 100);
  });
}

function animateNumber(elementId, start, end, duration) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);
    el.innerHTML = current + '<span>/100</span>';
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================
// INIT
// ==================

document.addEventListener('DOMContentLoaded', () => {
  showStep(0);
});
