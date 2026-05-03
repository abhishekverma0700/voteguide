/* Modular JS for VoteGuide */
const botResponses = {
  "how do i register to vote?": "You can register at your local election office or online (if available). You'll typically need ID, proof of address, and to fill a registration form.",
  "what id do i need at polling booth?": "Bring an official photo ID accepted by your election commission (national ID, passport, driver's license). Rules vary by country — check local guidance.",
  "what is evm?": "EVM stands for Electronic Voting Machine — a device used to record votes electronically in many jurisdictions.",
  "when is the last date to register?": "Deadlines vary; check your local election authority. Registration usually closes weeks before voting day.",
  "how are votes counted?": "Votes are counted by election officials following a verified procedure. Electronic counts use EVM logs; paper ballots are tallied and reconciled.",
  "what is nota?": "NOTA means 'None Of The Above' — an option allowing voters to reject all candidates on the ballot.",
  "what is constituency?": "A constituency is a geographic area represented by an elected official.",
  "what is affidavit?": "An affidavit is a written statement confirmed by oath, often required for candidate nomination paperwork.",
  "what is model code of conduct?": "It's a set of guidelines political parties and candidates must follow during election campaigns to ensure fairness.",
  "who runs the election?": "Elections are conducted by an independent election commission or authority in your country.",
  "can i vote if i moved recently?": "If you've moved, update your address on the voter roll before the deadline; some places allow provisional or absentee voting.",
  "how to check polling station?": "Your local election authority publishes polling station info; often available online on voter lookup pages.",
  "is voting mandatory?": "Some countries have compulsory voting; many do not. Check your local laws for obligations and penalties.",
  "can i change vote after casting?": "Generally no — once a ballot or EVM selection is cast it's final. Follow polling staff instructions carefully.",
};

function qs(selector, root = document) { return root.querySelector(selector); }
function qsa(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }

function initTimeline(){
  const steps = qsa('.timeline-step');
  steps.forEach(step => {
    const btn = step.querySelector('.step-toggle');
    btn.addEventListener('click', () => {
      const isOpen = step.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
      if(isOpen){
        step.querySelector('.step-content').style.maxHeight = '240px';
      } else {
        step.querySelector('.step-content').style.maxHeight = '';
      }
    });
  });
}

function appendMessage(text, who='bot'){
  const messages = qs('#messages');
  const el = document.createElement('div');
  el.className = `msg ${who}`;
  el.textContent = text;
  const ts = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  const small = document.createElement('small');
  small.textContent = ts;
  el.appendChild(small);
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

function getBotReply(question){
  if(!question) return "Sorry, I didn't quite get that. Try a different question.";
    // normalize input: remove punctuation, normalize whitespace, lowercase
    const normalize = s => s.toLowerCase().replace(/[^\w\s]/g,'').replace(/\s+/g,' ').trim();
    if(!window._normalizedBotResponses){
      window._normalizedBotResponses = {};
      Object.keys(botResponses).forEach(k=>{ window._normalizedBotResponses[normalize(k)] = botResponses[k]; });
    }
    const key = normalize(question);
  // exact normalized match
  if(window._normalizedBotResponses[key]) return window._normalizedBotResponses[key];
  // fuzzy: check keyword overlap
  const qTokens = key.split(' ').filter(Boolean);
  let bestMatch = null; let bestScore = 0;
  Object.keys(window._normalizedBotResponses).forEach(k=>{
    const kTokens = k.split(' ').filter(Boolean);
    const common = kTokens.filter(t => qTokens.includes(t)).length;
    if(common > bestScore){ bestScore = common; bestMatch = k; }
  });
  if(bestScore >= 1 && bestMatch){
    return window._normalizedBotResponses[bestMatch];
  }
  return "That's a great question — in many places the election office website has official guidance. Try a different phrasing or use a quick question.";
}

function initChatbot(){
  const form = qs('#chat-form');
  const input = qs('#chat-input');
  const quickBtns = qsa('.quick-btn');
  const clearBtn = qs('#clear-chat');

  // load persisted chat
  loadChat();

  quickBtns.forEach(btn => btn.addEventListener('click', (e)=>{
    const q = e.target.textContent;
    sendUserMessage(q);
  }));

  form.addEventListener('submit', e =>{
    e.preventDefault();
    const question = input.value.trim();
    if(!question) return;
    sendUserMessage(question);
    input.value = '';
  });

  clearBtn.addEventListener('click', ()=>{
    clearChat();
  });

  // seed welcome
  appendMessage('Hi! I can help with common voting questions. Try the quick questions.', 'bot');
}

function sendUserMessage(text){
  appendMessage(text, 'user');
  persistChat('user', text);
  // simulate thinking
  setTimeout(()=>{
    const reply = getBotReply(text);
    appendMessage(reply, 'bot');
    persistChat('bot', reply);
  }, 600);
}

function persistChat(who, text){
  try{
    const key = 'voteguide.chat';
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push({who,text,ts:Date.now()});
    localStorage.setItem(key, JSON.stringify(arr));
  }catch(e){/* ignore */}
}

function loadChat(){
  try{
    const key = 'voteguide.chat';
    const raw = localStorage.getItem(key);
    if(!raw) return;
    const arr = JSON.parse(raw);
    arr.forEach(item=> appendMessage(item.text, item.who));
  }catch(e){/* ignore */}
}

function clearChat(){
  const messages = qs('#messages');
  messages.innerHTML = '';
  localStorage.removeItem('voteguide.chat');
  // add seed message again
  appendMessage('Hi! I can help with common voting questions. Try the quick questions.', 'bot');
}

function initEligibilityChecker(){
  const ageInput = qs('#age');
  const citizenSelect = qs('#citizenship');
  const result = qs('#eligibility-result');

  function check(){
    const age = Number(ageInput.value);
    const citizen = citizenSelect.value;
    if(!ageInput.value){ result.textContent = ''; return; }
    if(age >= 18 && citizen === 'yes'){
      result.textContent = 'You are likely eligible to vote. Next: register, check your polling station, and prepare ID.';
      result.className = 'result ok';
    } else if(age >= 18 && citizen !== 'yes'){
      result.textContent = 'Age meets requirement, but citizenship status may affect eligibility. Check local rules.';
      result.className = 'result no';
    } else {
      result.textContent = 'Not eligible yet. You must reach the required voting age. Consider civic engagement activities until then.';
      result.className = 'result no';
    }
  }

  ageInput.addEventListener('input', check);
  citizenSelect.addEventListener('change', check);
}

function initGlossary(){
  const terms = [
    {term:'EVM', def:'Electronic Voting Machine used to record votes.'},
    {term:'NOTA', def:'None Of The Above option allowing voters to reject candidates.'},
    {term:'Constituency', def:'The geographic area represented by an elected official.'},
    {term:'Affidavit', def:'A sworn written statement.'},
    {term:'Model Code of Conduct', def:'Guidelines for fair campaigning.'},
    {term:'Polling Station', def:'Place where voters cast ballots.'},
    {term:'Electoral Roll', def:'List of registered voters.'},
    {term:'Incumbent', def:'Current office-holder.'},
    {term:'Absentee Ballot', def:'Ballot submitted by mail when voter can’t attend.'},
    {term:'Voter ID', def:'Official document to prove identity while voting.'},
    {term:'Ballot', def:'The paper or electronic record used to vote.'},
    {term:'Observer', def:'Person monitoring elections for fairness.'},
    {term:'Delimitation', def:'Redrawing of electoral boundaries.'},
    {term:'Electoral Roll', def:'List of eligible voters in a region.'},
    {term:'Polling Agent', def:'Representative of a candidate at a polling station.'},
    {term:'Recount', def:'Repeated counting of votes to confirm results.'},
    {term:'Proxy Voting', def:'Allowing another person to vote on your behalf (where permitted).'},
    {term:'Voter Turnout', def:'Percentage of eligible voters who actually voted.'},
    {term:'Nomination', def:'Formal submission of candidacy for election.'},
    {term:'Certification', def:'Official confirmation of election results.'}
  ];

  const list = qs('#glossary-list');
  const input = qs('#glossary-search');

  function render(filtered){
    list.innerHTML = '';
    filtered.forEach(item =>{
      const li = document.createElement('li');
      li.className = 'glossary-item';
      li.innerHTML = `<div class="glossary-term">${item.term}</div><div class="glossary-def">${item.def}</div>`;
      list.appendChild(li);
    });
  }

  input.addEventListener('input', ()=>{
    const q = input.value.trim().toLowerCase();
    if(!q){ render(terms); return; }
    render(terms.filter(t => t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q)));
  });

  render(terms);
}

function initProgressTracker(){
  const questions = [
    'Have you registered to vote?',
    'Do you know your polling station?',
    'Will you bring valid ID to vote?',
    'Do you know voting day and hours?',
    'Do you know how to mark your ballot?'
  ];

  const container = qs('#quiz-questions');
  const progressEl = qs('#readiness-progress');
  const percentEl = qs('#progress-percent');

  const answers = new Array(questions.length).fill(false);

  questions.forEach((q, i)=>{
    const row = document.createElement('div');
    row.className = 'question';
    row.innerHTML = `<div>${q}</div>`;
    const btns = document.createElement('div');
    const yes = document.createElement('button');
    yes.textContent = 'Yes';
    yes.type = 'button';
    const no = document.createElement('button');
    no.textContent = 'No';
    no.type = 'button';
    yes.addEventListener('click', ()=>{answers[i]=true; update(); markActive(yes,no)});
    no.addEventListener('click', ()=>{answers[i]=false; update(); markActive(no,yes)});
    btns.appendChild(yes); btns.appendChild(no);
    row.appendChild(btns);
    container.appendChild(row);
  });

  function markActive(activeBtn, inactiveBtn){
    activeBtn.style.background = 'var(--deep-blue)'; activeBtn.style.color='white'; inactiveBtn.style.background='transparent'; inactiveBtn.style.color='inherit';
  }

  function update(){
    const score = answers.filter(Boolean).length;
    const pct = Math.round((score / answers.length) * 100);
    progressEl.value = pct; percentEl.textContent = `${pct}%`;
  }

  update();
}

function initNavbarObserver(){
  const sections = qsa('main .section');
  const navLinks = qsa('.nav-links a');
  const observer = new IntersectionObserver(entries =>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = entry.target.id;
        navLinks.forEach(a=> a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
        // Track section view with Google Analytics if available
        try{ if(typeof trackSectionView === 'function'){ trackSectionView(id); } }catch(e){}
      }
    });
  }, {threshold:0.5});
  sections.forEach(s=>observer.observe(s));
}

document.addEventListener('DOMContentLoaded', ()=>{
  initTimeline();
  initChatbot();
  initEligibilityChecker();
  initGlossary();
  initProgressTracker();
  initNavbarObserver();
});
