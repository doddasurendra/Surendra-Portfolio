/* ============================================================
   PORTFOLIO JAVASCRIPT — Surendra Dodda
   ============================================================ */

// ──────────── DARK / LIGHT THEME ────────────
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

function updateThemeIcon(theme) {
  if (theme === 'dark') themeIcon.className = 'fas fa-sun';
  else if (theme === 'light') themeIcon.className = 'fas fa-moon';
  else themeIcon.className = 'fas fa-moon';
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

// ──────────── PEACOCK THEME TOGGLE ────────────
const peacockBtn = document.getElementById('peacock-toggle');
peacockBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'peacock' ? 'dark' : 'peacock';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
  showToast(next === 'peacock' ? '🦚 Peacock theme activated!' : '🌙 Back to Dark theme');
});

// ──────────── SECTION TOOLBAR (CRUD) ────────────
const sectionFileInputs = {};

document.querySelectorAll('.section-toolbar').forEach(toolbar => {
  const sectionId = toolbar.getAttribute('data-section');
  const section = document.getElementById(sectionId);
  if (!section) return;

  // Hidden file input per section
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*,.pdf,.doc,.docx,.txt';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);
  sectionFileInputs[sectionId] = fileInput;

  // UPLOAD
  toolbar.querySelector('.stb-upload')?.addEventListener('click', () => {
    fileInput.click();
  });
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.cssText = 'max-width:100%;border-radius:12px;margin-top:16px;display:block';
        section.querySelector('.container')?.appendChild(img);
        showToast(`📤 Image uploaded to ${sectionId}!`);
      };
      reader.readAsDataURL(file);
    } else {
      showToast(`📄 File "${file.name}" selected for ${sectionId}`);
    }
  });

  // ADD — append a new editable card
  toolbar.querySelector('.stb-add')?.addEventListener('click', () => {
    const container = section.querySelector('.container');
    const card = document.createElement('div');
    card.style.cssText = `
      background:var(--bg-card);border:1.5px dashed var(--accent);
      border-radius:12px;padding:20px 24px;margin-top:16px;
      font-size:.95rem;color:var(--text);outline:none;
    `;
    card.contentEditable = 'true';
    card.textContent = '✏️ New item — click to edit this text...';
    container?.appendChild(card);
    card.focus();
    // Select all text
    const range = document.createRange();
    range.selectNodeContents(card);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    showToast(`➕ New item added to ${sectionId}. Type to edit.`);
  });

  // EDIT — toggle contenteditable on all text in section
  let editActive = false;
  toolbar.querySelector('.stb-edit')?.addEventListener('click', (e) => {
    editActive = !editActive;
    const editBtn = e.currentTarget;
    const editables = section.querySelectorAll('p, h2, h3, span, li, .detail-item, .project-title, .project-desc, .about-summary');
    editables.forEach(el => {
      el.contentEditable = editActive ? 'true' : 'false';
    });
    editBtn.style.background = editActive ? '#D4AF37' : '';
    editBtn.style.color = editActive ? '#000' : '';
    showToast(editActive ? `✏️ Edit mode ON for ${sectionId}` : `💾 Edit mode OFF — click Update to save`);
  });

  // DELETE — remove last added custom card, or last item in a list
  toolbar.querySelector('.stb-delete')?.addEventListener('click', () => {
    // Try last dynamic card first
    const dynCards = section.querySelectorAll('[contenteditable]:not(.about-summary):not(h2):not(h3):not(p):not(li)');
    if (dynCards.length > 0) {
      dynCards[dynCards.length - 1].remove();
      showToast(`🗑️ Last item removed from ${sectionId}`);
      return;
    }
    // Otherwise try last li in any list
    const lists = section.querySelectorAll('ul');
    if (lists.length > 0) {
      const lastList = lists[lists.length - 1];
      const items = lastList.querySelectorAll('li');
      if (items.length > 0) {
        items[items.length - 1].remove();
        showToast(`🗑️ Last list item deleted in ${sectionId}`);
        return;
      }
    }
    showToast(`⚠️ Nothing to delete in ${sectionId}`);
  });

  // UPDATE — save section innerHTML to localStorage + toast
  toolbar.querySelector('.stb-update')?.addEventListener('click', () => {
    // Turn off edit mode first
    section.querySelectorAll('[contenteditable="true"]').forEach(el => {
      el.contentEditable = 'false';
    });
    localStorage.setItem(`section_${sectionId}`, section.querySelector('.container')?.innerHTML || '');
    showToast(`✅ ${sectionId} saved! Changes stored locally.`);
  });

  // Restore saved content on load
  const saved = localStorage.getItem(`section_${sectionId}`);
  if (saved) {
    const container = section.querySelector('.container');
    if (container) container.innerHTML = saved;
  }
});



// ──────────── PROFILE PHOTO UPLOAD ────────────
const photoInput = document.getElementById('photoInput');
const photoUploadBtn = document.getElementById('photoUploadBtn');
const profilePhoto = document.getElementById('profilePhoto');
const profileImg = document.getElementById('profileImg');
const profileInitials = document.getElementById('profileInitials');

function applyPhoto(dataUrl) {
  profileImg.src = dataUrl;
  profileImg.style.display = 'block';
  profileInitials.style.display = 'none';
}

// Restore saved photo
const savedPhoto = localStorage.getItem('portfolioPhoto');
if (savedPhoto) applyPhoto(savedPhoto);

// Clicking the camera button OR the photo circle triggers upload
[photoUploadBtn, profilePhoto].forEach(el => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    photoInput.click();
  });
});

photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    applyPhoto(dataUrl);
    localStorage.setItem('portfolioPhoto', dataUrl);
    showToast('📸 Photo updated!');
  };
  reader.readAsDataURL(file);
});

// ──────────── RESUME UPLOAD ────────────
const resumeInput = document.getElementById('resumeInput');
const uploadResumeBtn = document.getElementById('uploadResumeBtn');
const downloadResumeBtn = document.getElementById('downloadResumeBtn');

// Restore saved resume
const savedResumeName = localStorage.getItem('portfolioResumeName');
if (savedResumeName) {
  downloadResumeBtn.innerHTML = `<i class="fas fa-download"></i> ${savedResumeName}`;
  downloadResumeBtn.title = `Download: ${savedResumeName}`;
}

uploadResumeBtn.addEventListener('click', () => resumeInput.click());

resumeInput.addEventListener('change', () => {
  const file = resumeInput.files[0];
  if (!file) return;

  const blobUrl = URL.createObjectURL(file);
  downloadResumeBtn.href = blobUrl;
  downloadResumeBtn.download = file.name;
  downloadResumeBtn.innerHTML = `<i class="fas fa-download"></i> ${file.name}`;
  downloadResumeBtn.title = `Download: ${file.name}`;

  // Persist name only (blob URLs are session-only)
  localStorage.setItem('portfolioResumeName', file.name);

  showToast(`📄 Resume "${file.name}" ready!`);
});

// ──────────── TOAST HELPER ────────────
function showToast(message) {
  const existing = document.querySelector('.upload-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'upload-toast';
  toast.innerHTML = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}


// ──────────── NAVBAR HAMBURGER ────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ──────────── ACTIVE NAV LINK ────────────
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      allNavLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${id}`) a.classList.add('active');
      });
    }
  });

  // Navbar background on scroll
  const navbar = document.getElementById('navbar');
  navbar.style.boxShadow = window.scrollY > 20
    ? '0 4px 20px rgba(0,0,0,0.4)'
    : 'none';
}, { passive: true });

// ──────────── PARTICLES ────────────
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 35;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.width = (Math.random() * 3 + 1) + 'px';
    p.style.height = p.style.width;
    p.style.animationDuration = (Math.random() * 20 + 15) + 's';
    p.style.animationDelay = (Math.random() * 15) + 's';
    p.style.opacity = Math.random() * 0.6 + 0.1;
    container.appendChild(p);
  }
}
createParticles();

// ──────────── SCROLL REVEAL ────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.stat-card, .why-card, .skill-card, .project-card, .ai-feature, ' +
  '.learning-card, .goal-item, .timeline-item, .about-text, .timeline, ' +
  '.github-card, .linkedin-card, .contact-detail, .contact-form, ' +
  '.cert-badge, .career-goals, .ai-demo, .footer-brand'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ──────────── COUNTER ANIMATION ────────────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.getAttribute('data-target'), 10);
    const dur = 1500;
    const step = Math.ceil(dur / (target || 1));
    let current = 0;
    const timer = setInterval(() => {
      current++;
      el.textContent = current;
      if (current >= target) {
        clearInterval(timer);
        el.textContent = target;
      }
    }, step);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ──────────── SKILL BAR ANIMATION ────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.width = bar.getAttribute('data-width') + '%';
    });
    skillObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-category').forEach(c => skillObserver.observe(c));

// ──────────── AI AGENT DEMO ────────────
const aiResponses = {
  find: `🔍 Searching for software developer jobs...\n\n✅ Found 47 Java Developer roles today:\n• Jr. Java Developer @ TCS — Hyderabad\n• Software Engineer @ Infosys — Chennai\n• Backend Dev @ Wipro — Remote\n• Java Fresher @ Accenture — Bangalore\n\n💡 Tip: Apply within 24 hours for higher response rates!`,
  skills: `📚 Skills recommended for you based on your profile:\n\n🔥 High Demand:\n• Spring Boot (Java framework)\n• REST APIs\n• SQL / MySQL\n\n⭐ Nice to Have:\n• React (frontend)\n• Docker basics\n• Cloud fundamentals (AWS/GCP)\n\n📈 Your current Java skills are a great foundation — keep building!`,
  explain: `🤖 About the AI Job Assistant:\n\nThis intelligent agent is designed to automate your job search and career growth:\n\n1️⃣ Daily job scan — finds relevant openings\n2️⃣ Profile analyzer — reviews your LinkedIn score\n3️⃣ Post generator — writes professional content\n4️⃣ Application tracker — monitors your submissions\n5️⃣ Skill advisor — suggests learning paths\n\nBuilt by Surendra Dodda as part of his AI project portfolio.`,
  default: `🤖 I'm the AI Job Assistant! Here's what I can help with:\n\n• Finding software developer jobs\n• Suggesting skills to learn\n• Improving your LinkedIn profile\n• Tracking your job applications\n\nTry one of the quick prompts above, or ask me anything about Surendra's projects!`
};

function appendAIMessage(container, text, isUser = false) {
  const msg = document.createElement('div');
  msg.className = `ai-demo-message ${isUser ? 'user-msg' : ''}`;
  if (!isUser) {
    const icon = document.createElement('i');
    icon.className = 'fas fa-robot bot-icon';
    msg.appendChild(icon);
  }
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.style.whiteSpace = 'pre-line';
  bubble.textContent = text;
  msg.appendChild(bubble);
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

document.querySelectorAll('.demo-prompt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const query = btn.getAttribute('data-query');
    const chat = document.getElementById('aiDemoChat');
    const userText = btn.textContent;
    appendAIMessage(chat, userText, true);
    // Typing delay
    setTimeout(() => {
      appendAIMessage(chat, aiResponses[query] || aiResponses.default);
    }, 900);
  });
});

const aiDemoInput = document.getElementById('aiDemoInput');
const aiDemoSend = document.getElementById('aiDemoSend');

function handleAIDemo() {
  const val = aiDemoInput.value.trim();
  if (!val) return;
  const chat = document.getElementById('aiDemoChat');
  appendAIMessage(chat, val, true);
  aiDemoInput.value = '';

  const lower = val.toLowerCase();
  let response = aiResponses.default;
  if (lower.includes('job') || lower.includes('find') || lower.includes('search')) response = aiResponses.find;
  else if (lower.includes('skill') || lower.includes('learn')) response = aiResponses.skills;
  else if (lower.includes('explain') || lower.includes('agent') || lower.includes('assistant')) response = aiResponses.explain;

  setTimeout(() => appendAIMessage(chat, response), 900);
}

aiDemoSend.addEventListener('click', handleAIDemo);
aiDemoInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleAIDemo(); });

// ──────────── CHATBOT ────────────
const chatbotFab = document.getElementById('chatbotFab');
const chatbotWindow = document.getElementById('chatbotWindow');
const closeChatbot = document.getElementById('closeChatbot');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatbotMessages');
const chatBadge = document.querySelector('.chatbot-badge');

const botKnowledge = {
  greet: ['hi', 'hello', 'hey', 'howdy', 'hola'],
  who: ['who is surendra', 'who are you', 'about surendra', 'tell me about'],
  proj: ['project', 'chandamama', 'hotel', 'milk', 'milkcenter', 'ai milk'],
  tech: ['technolog', 'skill', 'know', 'java', 'python', 'html', 'css', 'javascript', 'firebase', 'github', 'blender'],
  ai: ['ai agent', 'job assistant', 'linkedin assistant', 'ai project'],
  contact: ['contact', 'email', 'phone', 'reach', 'call'],
  goal: ['goal', 'career', 'dream', 'aspire', 'future'],
  edu: ['education', 'university', 'college', 'degree', 'saveetha', 'be', 'bachelor'],
};

const botAnswers = {
  greet: `👋 Hello! I'm SD Assistant — Surendra's portfolio bot. How can I help you today?\n\nYou can ask me about:\n• His projects\n• Skills & technologies\n• How to contact him`,
  who: `🙋 Surendra Dodda is a B.E Bachelor of engineering in Computer Science student at Saveetha University, Chennai. He is passionate about Java development, web development, and AI-powered applications. He enjoys building practical software that solves real-world problems.`,
  proj: `🚀 Surendra has 2 main projects:\n\n1. 🏨 Hotel Chandamama Website\n   A responsive hotel info website built with HTML, CSS, JS & Firebase.\n\n2. 🤖 AI Milk Center Management System\n   A digital system to manage milk center operations using AI-based ideas.`,
  tech: `💻 Surendra's tech stack:\n\n• Languages: Java, Python\n• Web: HTML, CSS, JavaScript\n• Tools: Firebase, GitHub, Blender\n• Learning: Spring Boot, React, ML basics`,
  ai: `🤖 The AI LinkedIn & Job Assistant is Surendra's AI project that:\n✅ Searches developer jobs daily\n✅ Suggests LinkedIn improvements\n✅ Generates professional posts\n✅ Tracks job applications\n✅ Recommends skills to learn`,
  contact: `📬 You can reach Surendra at:\n\n📧 surendra709364@gmail.com\n📱 +91 7093640044\n🔗 LinkedIn: linkedin.com/in/surendranadhdodda\n💻 GitHub: github.com/doddasurendra`,
  goal: `🎯 Surendra's career goals:\n1. Become a skilled software developer\n2. Build AI-powered applications\n3. Continuously improve programming skills`,
  edu: `🎓 Surendra is pursuing a B.E Bachelor of engineering in Computer Science at Saveetha University, Chennai — with a focus on Java development and AI-based applications.`,
  default: `🤔 I'm not sure about that, but I can tell you about:\n• Surendra's projects\n• His skills & tech stack\n• His AI job assistant project\n• How to contact him\n\nJust ask!`,
};

function getBotReply(input) {
  const lower = input.toLowerCase();
  for (const [key, patterns] of Object.entries(botKnowledge)) {
    if (patterns.some(p => lower.includes(p))) return botAnswers[key];
  }
  return botAnswers.default;
}

function appendChat(text, isUser = false) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${isUser ? 'user' : 'bot'}`;

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.style.whiteSpace = 'pre-line';
  bubble.textContent = text;
  msg.appendChild(bubble);
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const indicator = document.createElement('div');
  indicator.className = 'chat-msg bot';
  indicator.id = 'typingIndicator';
  const dots = document.createElement('div');
  dots.className = 'chat-bubble typing-indicator';
  dots.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  indicator.appendChild(dots);
  chatMessages.appendChild(indicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChat() {
  const val = chatInput.value.trim();
  if (!val) return;
  appendChat(val, true);
  chatInput.value = '';
  showTyping();
  setTimeout(() => {
    document.getElementById('typingIndicator')?.remove();
    appendChat(getBotReply(val));
  }, 1000);
}

chatbotFab.addEventListener('click', () => {
  chatbotWindow.classList.toggle('open');
  chatbotFab.querySelector('i').className = chatbotWindow.classList.contains('open')
    ? 'fas fa-times'
    : 'fas fa-comment-dots';
  if (chatbadge) chatBadge.style.display = 'none';
});

const chatbadge = document.querySelector('.chatbot-badge');
closeChatbot.addEventListener('click', () => {
  chatbotWindow.classList.remove('open');
  chatbotFab.querySelector('i').className = 'fas fa-comment-dots';
});

chatSend.addEventListener('click', handleChat);
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleChat(); });

// Quick replies
document.querySelectorAll('.quick-reply').forEach(btn => {
  btn.addEventListener('click', () => {
    const msg = btn.getAttribute('data-msg');
    appendChat(msg, true);
    showTyping();
    btn.closest('.chat-quick-replies')?.remove();
    setTimeout(() => {
      document.getElementById('typingIndicator')?.remove();
      appendChat(getBotReply(msg));
    }, 1000);
  });
});

// ──────────── CONTACT FORM ────────────
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const status = document.getElementById('formStatus');
  status.className = 'form-status success';
  status.textContent = '✅ Message sent! Surendra will get back to you soon.';
  this.reset();
  setTimeout(() => { status.style.display = 'none'; }, 5000);
});

// ──────────── SMOOTH SCROLL (fallback) ────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ══════════════════════════════════════════════════
//  PORTFOLIO AI — Tab switching + Command palette
// ══════════════════════════════════════════════════

// --- Tab switching ---
document.querySelectorAll('.chat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.chatbot-tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panelId = tab.getAttribute('data-tab') === 'chat' ? 'tabChat' : 'tabAi';
    document.getElementById(panelId).classList.add('active');
  });
});

// --- Command Palette open/close ---
const cmdPalette = document.getElementById('cmdPalette');
const cmdPaletteBtn = document.getElementById('cmdPaletteBtn');
const closeCmdPalette = document.getElementById('closeCmdPalette');

cmdPaletteBtn.addEventListener('click', () => cmdPalette.classList.toggle('open'));
closeCmdPalette.addEventListener('click', () => cmdPalette.classList.remove('open'));

// --- Clicking a cmd-example fills the AI input ---
document.querySelectorAll('.cmd-example').forEach(el => {
  el.addEventListener('click', () => {
    const aiInput = document.getElementById('aiEditInput');
    aiInput.value = el.getAttribute('data-cmd');
    cmdPalette.classList.remove('open');
    // Switch to AI tab
    document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.chatbot-tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelector('[data-tab="ai"]').classList.add('active');
    document.getElementById('tabAi').classList.add('active');
    aiInput.focus();
  });
});

// ══════════════════════════════════════════════════
//  PORTFOLIO AI — Command Engine
// ══════════════════════════════════════════════════

const aiEditInput = document.getElementById('aiEditInput');
const aiEditSend = document.getElementById('aiEditSend');
const aiEditMessages = document.getElementById('aiEditMessages');

function appendAIEdit(text, isUser = false) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.style.whiteSpace = 'pre-line';
  bubble.innerHTML = text;
  msg.appendChild(bubble);
  aiEditMessages.appendChild(msg);
  aiEditMessages.scrollTop = aiEditMessages.scrollHeight;
}

function portfolioAIProcess(input) {
  const raw = input.trim();
  const lower = raw.toLowerCase();

  // ── SHOW COMMANDS ──────────────────────────────
  if (lower === 'show commands' || lower === 'help' || lower === 'commands') {
    cmdPalette.classList.add('open');
    return '📖 Opening command palette! Click any example to use it.';
  }

  // ── ADD PROJECT ────────────────────────────────
  if (lower.startsWith('add project')) {
    const rest = raw.slice(11).trim();               // everything after "add project"
    const parts = rest.split('|').map(s => s.trim());
    const title = parts[0] || 'New Project';
    const desc = parts[1] || 'A new project added via Portfolio AI.';
    const tech = parts[2] || 'Code';

    const grid = document.querySelector('.projects-grid');
    if (!grid) return '❌ Could not find Projects section.';

    const techTags = tech.split(',').map(t =>
      `<span>${t.trim()}</span>`
    ).join('');

    const article = document.createElement('article');
    article.className = 'project-card reveal';
    article.innerHTML = `
      <div class="project-image" style="background:linear-gradient(135deg,var(--bg-card2),var(--bg-card));min-height:140px;display:flex;align-items:center;justify-content:center;font-size:3rem;">🚀</div>
      <div class="project-body">
        <h3 class="project-title">${title}</h3>
        <p class="project-desc">${desc}</p>
        <div class="project-tech">${techTags}</div>
        <div class="project-links">
          <a href="https://github.com/doddasurendra" class="btn btn-sm btn-primary" target="_blank"><i class="fab fa-github"></i> View Code</a>
        </div>
      </div>`;
    grid.appendChild(article);
    revealObserver.observe(article);
    scrollToSection('projects');
    autosaveSection('projects');
    return `✅ Project "<strong>${title}</strong>" added to your Projects section! 🚀`;
  }

  // ── ADD SKILL ──────────────────────────────────
  if (lower.startsWith('add skill')) {
    const name = raw.slice(9).trim() || 'New Skill';
    const row = document.querySelector('.skills-category:last-child .skills-row');
    if (!row) return '❌ Could not find Skills section.';

    const colors = ['#00BFA5', '#0094D4', '#8A4FE8', '#D4AF37', '#FF5555', '#00E5A0'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const card = document.createElement('div');
    card.className = 'skill-card reveal';
    card.innerHTML = `
      <div class="skill-icon" style="background:${color}"><i class="fas fa-code"></i></div>
      <span>${name}</span>
      <div class="skill-bar"><div class="skill-fill" data-width="75" style="width:75%"></div></div>`;
    row.appendChild(card);
    revealObserver.observe(card);
    scrollToSection('skills');
    autosaveSection('skills');
    return `✅ Skill "<strong>${name}</strong>" added to your Skills section! 💻`;
  }

  // ── ADD CERTIFICATION ──────────────────────────
  if (lower.startsWith('add certification') || lower.startsWith('add cert')) {
    const name = raw.replace(/^add cert(ification)?/i, '').trim() || 'New Certification';
    const certArea = document.querySelector('#learning .learning-card:nth-child(3) .cert-badge')?.parentNode
      || document.querySelector('#learning .learning-card:nth-child(3)');

    if (!certArea) return '❌ Could not find Certifications section.';
    const badge = document.createElement('div');
    badge.className = 'cert-badge';
    badge.innerHTML = `<i class="fas fa-certificate"></i> ${name}`;
    certArea.appendChild(badge);
    scrollToSection('learning');
    autosaveSection('learning');
    return `✅ Certification "<strong>${name}</strong>" added! 📜`;
  }

  // ── ADD ACHIEVEMENT ────────────────────────────
  if (lower.startsWith('add achievement')) {
    const text = raw.slice(15).trim() || 'New Achievement';
    const ul = document.querySelector('#learning .learning-card:nth-child(4) .learning-list');
    if (!ul) return '❌ Could not find Achievements section.';
    const li = document.createElement('li');
    li.innerHTML = `<i class="fas fa-star"></i> ${text}`;
    ul.appendChild(li);
    scrollToSection('learning');
    autosaveSection('learning');
    return `✅ Achievement "<strong>${text}</strong>" added! 🏆`;
  }

  // ── ADD GOAL ───────────────────────────────────
  if (lower.startsWith('add goal')) {
    const text = raw.slice(8).trim() || 'New Goal';
    const grid = document.querySelector('.goals-grid');
    if (!grid) return '❌ Could not find Career Goals section.';
    const item = document.createElement('div');
    item.className = 'goal-item reveal';
    item.innerHTML = `<i class="fas fa-bullseye"></i><p>${text}</p>`;
    grid.appendChild(item);
    revealObserver.observe(item);
    scrollToSection('learning');
    autosaveSection('learning');
    return `✅ Career goal "<strong>${text}</strong>" added! 🎯`;
  }

  // ── ADD LEARNING ───────────────────────────────
  if (lower.startsWith('add learning') || lower.startsWith('add learn')) {
    const text = raw.replace(/^add learn(ing)?/i, '').trim() || 'New Technology';
    const ul = document.querySelector('#learning .learning-card:nth-child(2) .learning-list');
    if (!ul) return '❌ Could not find Learning section.';
    const li = document.createElement('li');
    li.innerHTML = `<i class="fas fa-arrow-right"></i> ${text}`;
    ul.appendChild(li);
    scrollToSection('learning');
    autosaveSection('learning');
    return `✅ "<strong>${text}</strong>" added to your learning roadmap! 📚`;
  }

  // ── UPDATE TAGLINE ─────────────────────────────
  if (lower.startsWith('update tagline')) {
    const match = raw.match(/update tagline to (.+)/i);
    const text = match ? match[1].trim() : null;
    if (!text) return '⚠️ Please say: update tagline to [Your New Tagline]';
    const el = document.querySelector('.hero-tagline');
    if (!el) return '❌ Could not find the hero tagline.';
    el.innerHTML = text.split('|').map(p => p.trim()).join(' &nbsp;|&nbsp; ');
    autosaveSection('home');
    return `✅ Tagline updated to: "<strong>${text}</strong>"! ✨`;
  }

  // ── UPDATE NAME ────────────────────────────────
  if (lower.startsWith('update name')) {
    const match = raw.match(/update name to (.+)/i);
    const text = match ? match[1].trim() : null;
    if (!text) return '⚠️ Please say: update name to [Your Name]';
    const el = document.querySelector('.hero-name .gradient-text');
    if (el) el.textContent = text;
    return `✅ Name updated to: "<strong>${text}</strong>"! 🙋`;
  }

  // ── ADD TIMELINE STAGE ─────────────────────────
  if (lower.startsWith('add stage') || lower.startsWith('add timeline')) {
    const text = raw.replace(/^add (stage|timeline)/i, '').trim() || 'New Stage';
    const container = document.querySelector('.timeline-items');
    if (!container) return '❌ Could not find Timeline.';
    const stageNum = container.querySelectorAll('.timeline-item').length + 1;
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `<div class="timeline-dot"></div><div class="timeline-content"><span class="timeline-stage">Stage ${stageNum}</span><p>${text}</p></div>`;
    container.appendChild(item);
    scrollToSection('about');
    autosaveSection('about');
    return `✅ Timeline Stage ${stageNum} "<strong>${text}</strong>" added! 🗺️`;
  }

  // ══ DELETE COMMANDS ══════════════════════════════

  // ── DELETE PROJECT ──────────────────────────────
  if (/^(delete|remove) project/i.test(lower)) {
    const name = raw.replace(/^(delete|remove) project/i, '').trim();
    const cards = [...document.querySelectorAll('.project-card')];
    const found = cards.find(c => c.querySelector('.project-title')?.textContent.toLowerCase().includes(name.toLowerCase()));
    if (!found) return `❌ No project found matching "<strong>${name}</strong>". Check the title and try again.`;
    found.remove();
    autosaveSection('projects');
    scrollToSection('projects');
    return `🗑️ Project "<strong>${name}</strong>" deleted!`;
  }

  // ── DELETE SKILL ────────────────────────────────
  if (/^(delete|remove) skill/i.test(lower)) {
    const name = raw.replace(/^(delete|remove) skill/i, '').trim();
    const found = [...document.querySelectorAll('.skill-card')].find(c => c.querySelector('span')?.textContent.toLowerCase().includes(name.toLowerCase()));
    if (!found) return `❌ No skill found matching "<strong>${name}</strong>".`;
    found.remove();
    autosaveSection('skills');
    return `🗑️ Skill "<strong>${name}</strong>" deleted!`;
  }

  // ── DELETE CERTIFICATION ─────────────────────────
  if (/^(delete|remove) cert/i.test(lower)) {
    const name = raw.replace(/^(delete|remove) cert(ification)?/i, '').trim();
    const found = [...document.querySelectorAll('.cert-badge')].find(b => b.textContent.toLowerCase().includes(name.toLowerCase()));
    if (!found) return `❌ No certification found matching "<strong>${name}</strong>".`;
    found.remove();
    autosaveSection('learning');
    return `🗑️ Certification "<strong>${name}</strong>" deleted!`;
  }

  // ── DELETE ACHIEVEMENT ──────────────────────────
  if (/^(delete|remove) achievement/i.test(lower)) {
    const text = raw.replace(/^(delete|remove) achievement/i, '').trim();
    const found = [...document.querySelectorAll('#learning .learning-card:nth-child(4) .learning-list li')]
      .find(li => li.textContent.toLowerCase().includes(text.toLowerCase()));
    if (!found) return `❌ No achievement found matching "<strong>${text}</strong>".`;
    found.remove();
    autosaveSection('learning');
    return `🗑️ Achievement deleted!`;
  }

  // ── DELETE GOAL ─────────────────────────────────
  if (/^(delete|remove) goal/i.test(lower)) {
    const text = raw.replace(/^(delete|remove) goal/i, '').trim();
    const found = [...document.querySelectorAll('.goal-item')].find(item => item.querySelector('p')?.textContent.toLowerCase().includes(text.toLowerCase()));
    if (!found) return `❌ No goal found matching "<strong>${text}</strong>".`;
    found.remove();
    autosaveSection('learning');
    return `🗑️ Goal deleted!`;
  }

  // ── DELETE LEARNING ─────────────────────────────
  if (/^(delete|remove) learn/i.test(lower)) {
    const text = raw.replace(/^(delete|remove) learn(ing)?/i, '').trim();
    const found = [...document.querySelectorAll('#learning .learning-card:nth-child(2) .learning-list li')]
      .find(li => li.textContent.toLowerCase().includes(text.toLowerCase()));
    if (!found) return `❌ No learning item found matching "<strong>${text}</strong>".`;
    found.remove();
    autosaveSection('learning');
    return `🗑️ Learning item "<strong>${text}</strong>" removed!`;
  }

  // ── DELETE STAGE ─────────────────────────────────
  if (/^(delete|remove) stage/i.test(lower)) {
    const text = raw.replace(/^(delete|remove) stage/i, '').trim();
    const items = [...document.querySelectorAll('.timeline-item')];
    const found = isNaN(text)
      ? items.find(i => i.textContent.toLowerCase().includes(text.toLowerCase()))
      : items[parseInt(text) - 1];
    if (!found) return `❌ No timeline stage found matching "<strong>${text}</strong>".`;
    found.remove();
    autosaveSection('about');
    return `🗑️ Timeline stage deleted!`;
  }

  // ══ EDIT / UPDATE COMMANDS ════════════════════════

  // ── EDIT PROJECT ────────────────────────────────
  // Format: edit project [title] | [new title] | [new desc] | [new tech]
  if (/^edit project/i.test(lower)) {
    const rest = raw.slice(12).trim();
    const parts = rest.split('|').map(s => s.trim());
    const search = parts[0];
    const newTitle = parts[1] || null;
    const newDesc = parts[2] || null;
    const newTech = parts[3] || null;
    if (!search) return '⚠️ Format: edit project [Title] | [New Title] | [New Desc] | [Tech1, Tech2]';
    const found = [...document.querySelectorAll('.project-card')].find(c => c.querySelector('.project-title')?.textContent.toLowerCase().includes(search.toLowerCase()));
    if (!found) return `❌ No project found matching "<strong>${search}</strong>".`;
    if (newTitle) found.querySelector('.project-title').textContent = newTitle;
    if (newDesc) found.querySelector('.project-desc').textContent = newDesc;
    if (newTech) {
      const techDiv = found.querySelector('.project-tech');
      if (techDiv) techDiv.innerHTML = newTech.split(',').map(t => `<span>${t.trim()}</span>`).join('');
    }
    autosaveSection('projects');
    scrollToSection('projects');
    return `✅ Project "<strong>${newTitle || search}</strong>" updated! 🚀`;
  }

  // ── EDIT SKILL ──────────────────────────────────
  // Format: edit skill [Old Name] to [New Name]
  if (/^edit skill/i.test(lower)) {
    const match = raw.match(/edit skill (.+?) to (.+)/i);
    if (!match) return '⚠️ Format: edit skill [Old Name] to [New Name]';
    const [, search, newName] = match;
    const found = [...document.querySelectorAll('.skill-card')].find(c => c.querySelector('span')?.textContent.toLowerCase().includes(search.toLowerCase()));
    if (!found) return `❌ No skill found matching "<strong>${search}</strong>".`;
    found.querySelector('span').textContent = newName.trim();
    autosaveSection('skills');
    return `✅ Skill renamed to "<strong>${newName.trim()}</strong>"! 💻`;
  }

  // ── EDIT ACHIEVEMENT ────────────────────────────
  if (/^edit achievement/i.test(lower)) {
    const match = raw.match(/edit achievement (.+?) to (.+)/i);
    if (!match) return '⚠️ Format: edit achievement [Old Text] to [New Text]';
    const [, search, newText] = match;
    const found = [...document.querySelectorAll('#learning .learning-card:nth-child(4) .learning-list li')]
      .find(li => li.textContent.toLowerCase().includes(search.toLowerCase()));
    if (!found) return `❌ No achievement found matching "<strong>${search}</strong>".`;
    found.innerHTML = `<i class="fas fa-star"></i> ${newText.trim()}`;
    autosaveSection('learning');
    return `✅ Achievement updated to "<strong>${newText.trim()}</strong>"! 🏆`;
  }

  // ── EDIT GOAL ───────────────────────────────────
  if (/^edit goal/i.test(lower)) {
    const match = raw.match(/edit goal (.+?) to (.+)/i);
    if (!match) return '⚠️ Format: edit goal [Old Text] to [New Text]';
    const [, search, newText] = match;
    const found = [...document.querySelectorAll('.goal-item')].find(i => i.querySelector('p')?.textContent.toLowerCase().includes(search.toLowerCase()));
    if (!found) return `❌ No goal found matching "<strong>${search}</strong>".`;
    found.querySelector('p').textContent = newText.trim();
    autosaveSection('learning');
    return `✅ Goal updated to "<strong>${newText.trim()}</strong>"! 🎯`;
  }

  // ── EDIT LEARNING ───────────────────────────────
  if (/^edit learning/i.test(lower)) {
    const match = raw.match(/edit learning (.+?) to (.+)/i);
    if (!match) return '⚠️ Format: edit learning [Old Tech] to [New Tech]';
    const [, search, newText] = match;
    const found = [...document.querySelectorAll('#learning .learning-card:nth-child(2) .learning-list li')]
      .find(li => li.textContent.toLowerCase().includes(search.toLowerCase()));
    if (!found) return `❌ No learning item found matching "<strong>${search}</strong>".`;
    found.innerHTML = `<i class="fas fa-arrow-right"></i> ${newText.trim()}`;
    autosaveSection('learning');
    return `✅ Learning item updated to "<strong>${newText.trim()}</strong>"! 📚`;
  }

  // ── EDIT CERTIFICATION ──────────────────────────
  if (/^edit cert/i.test(lower)) {
    const match = raw.match(/edit cert(?:ification)? (.+?) to (.+)/i);
    if (!match) return '⚠️ Format: edit certification [Old Name] to [New Name]';
    const [, search, newText] = match;
    const found = [...document.querySelectorAll('.cert-badge')].find(b => b.textContent.toLowerCase().includes(search.toLowerCase()));
    if (!found) return `❌ No certification found matching "<strong>${search}</strong>".`;
    found.innerHTML = `<i class="fas fa-certificate"></i> ${newText.trim()}`;
    autosaveSection('learning');
    return `✅ Certification updated to "<strong>${newText.trim()}</strong>"! 📜`;
  }

  // ── UPDATE ABOUT ────────────────────────────────
  if (/^update about/i.test(lower)) {
    const match = raw.match(/update about(?: to)? (.+)/i);
    if (!match) return '⚠️ Format: update about to [Your new bio text]';
    const el = document.querySelector('.about-summary');
    if (!el) return '❌ Could not find About summary.';
    el.textContent = match[1].trim();
    autosaveSection('about');
    return `✅ About section updated!`;
  }

  // ── UPDATE EMAIL ────────────────────────────────
  if (/^update email/i.test(lower)) {
    const match = raw.match(/update email to (.+)/i);
    if (!match) return '⚠️ Format: update email to [your@email.com]';
    const email = match[1].trim();
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => { a.href = `mailto:${email}`; a.textContent = email; });
    return `✅ Email updated to "<strong>${email}</strong>"!`;
  }

  // ── UPDATE PHONE ────────────────────────────────
  if (/^update phone/i.test(lower)) {
    const match = raw.match(/update phone to (.+)/i);
    if (!match) return '⚠️ Format: update phone to [+91 xxxxxxxxxx]';
    const phone = match[1].trim();
    document.querySelectorAll('a[href^="tel:"]').forEach(a => { a.href = `tel:${phone.replace(/\s/g, '')}`; a.textContent = phone; });
    return `✅ Phone updated to "<strong>${phone}</strong>"!`;
  }

  // ── UPDATE INTRO ────────────────────────────────
  if (/^update intro/i.test(lower)) {
    const match = raw.match(/update intro(?: to)? (.+)/i);
    if (!match) return '⚠️ Format: update intro to [Your intro text]';
    const el = document.querySelector('.hero-intro');
    if (!el) return '❌ Could not find hero intro.';
    el.textContent = match[1].trim();
    return `✅ Hero intro updated!`;
  }

  // ── FALLBACK ────────────────────────────────────
  return `🤔 I didn't understand that command. Try:<br><br>
<strong>➕ Add:</strong><br>
• <em>add project [Name] | [Desc] | [Tech]</em><br>
• <em>add skill [Name]</em> &nbsp;•&nbsp; <em>add certification [Name]</em><br>
• <em>add achievement [Text]</em> &nbsp;•&nbsp; <em>add goal [Text]</em><br>
• <em>add learning [Tech]</em><br><br>
<strong>🗑️ Delete:</strong><br>
• <em>delete project [Title]</em><br>
• <em>delete skill [Name]</em> &nbsp;•&nbsp; <em>delete certification [Name]</em><br>
• <em>delete achievement [Text]</em> &nbsp;•&nbsp; <em>delete goal [Text]</em><br>
• <em>delete learning [Tech]</em><br><br>
<strong>✏️ Edit:</strong><br>
• <em>edit project [Title] | [New Title] | [New Desc] | [Tech]</em><br>
• <em>edit skill [Old] to [New]</em><br>
• <em>edit achievement [Old] to [New]</em><br>
• <em>edit goal [Old] to [New]</em><br><br>
<strong>🔄 Update:</strong><br>
• <em>update tagline to [Text]</em><br>
• <em>update about to [Bio]</em><br>
• <em>update email to [Email]</em> &nbsp;•&nbsp; <em>update phone to [Phone]</em><br>
• <em>show commands</em>`;
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
}

function autosaveSection(id) {
  const section = document.getElementById(id);
  if (section) {
    const container = section.querySelector('.container') || section;
    localStorage.setItem(`section_${id}`, container.innerHTML);
  }
}

function handlePortfolioAI() {
  const val = aiEditInput.value.trim();
  if (!val) return;
  appendAIEdit(val, true);
  aiEditInput.value = '';

  // Show typing indicator
  const typing = document.createElement('div');
  typing.className = 'chat-msg bot';
  typing.id = 'aiTyping';
  typing.innerHTML = '<div class="chat-bubble typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
  aiEditMessages.appendChild(typing);
  aiEditMessages.scrollTop = aiEditMessages.scrollHeight;

  setTimeout(() => {
    document.getElementById('aiTyping')?.remove();
    const result = portfolioAIProcess(val);
    appendAIEdit(result);
  }, 700);
}

aiEditSend.addEventListener('click', handlePortfolioAI);
aiEditInput.addEventListener('keydown', e => { if (e.key === 'Enter') handlePortfolioAI(); });


