// === Cursor Glow ===
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// === Particles ===
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 6 + 's';
    p.style.animationDuration = (4 + Math.random() * 4) + 's';
    p.style.width = p.style.height = (1 + Math.random() * 2) + 'px';
    particlesContainer.appendChild(p);
}

// === Navbar Scroll & Active Link ===
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section, .hero');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 200;
        if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
});

// === Mobile Nav Toggle ===
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
});
navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
    });
});

// === Typing Effect ===
const phrases = [
    'Full-Stack Developer',
    'AI & ML Enthusiast',
    'Open Source Contributor',
    'Problem Solver'
];
const typedText = document.getElementById('typedText');
let phraseIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
    const current = phrases[phraseIndex];
    typedText.textContent = current.substring(0, charIndex);

    if (!isDeleting && charIndex < current.length) {
        charIndex++;
        setTimeout(typeEffect, 80);
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeEffect, 40);
    } else if (!isDeleting) {
        isDeleting = true;
        setTimeout(typeEffect, 1500);
    } else {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeEffect, 400);
    }
}
typeEffect();

// === Counter Animation ===
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        if (counter.dataset.animated) return;
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * eased);
            if (progress < 1) requestAnimationFrame(update);
            else { counter.textContent = target; counter.dataset.animated = 'true'; }
        }
        requestAnimationFrame(update);
    });
}

// === Scroll Reveal ===
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.closest('.hero')) animateCounters();
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

// Reveal sections on scroll
const revealElements = document.querySelectorAll(
    '.skill-category, .project-card, .timeline-item, .education-card, .contact-item, .highlight-card'
);
revealElements.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 0.1 + 's';
});
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });
revealElements.forEach(el => revealObserver.observe(el));

// === Trigger hero animations immediately ===
setTimeout(() => {
    document.querySelectorAll('.hero .animate-in').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 150);
    });
}, 300);

// === Interactive Skills Section ===
const skillsData = {
    "React": { icon: "fab fa-react", projects: [{ name: "VibExpert Shop", role: "Front-End", link: "https://vibexpert.shop" }, { name: "CarPooling", role: "Full-Stack", link: "https://github.com/gauravgupta654" }] },
    "JavaScript": { icon: "fab fa-js-square", projects: [{ name: "VibExpert Shop", role: "Front-End", link: "https://vibexpert.shop" }] },
    "Python": { icon: "fab fa-python", projects: [{ name: "eSim AI Chatbot", role: "AI Developer", link: "https://github.com/gauravgupta654" }] },
    "HTML5": { icon: "fab fa-html5", projects: [{ name: "VibExpert Shop", role: "Front-End", link: "https://vibexpert.shop" }] },
    "CSS3": { icon: "fab fa-css3-alt", projects: [{ name: "VibExpert Shop", role: "Front-End", link: "https://vibexpert.shop" }] },
    "REST APIs": { icon: "fas fa-plug", projects: [{ name: "VibExpert Shop", role: "Front-End", link: "https://vibexpert.shop" }] },
    "Express.js": { icon: "fas fa-rocket", projects: [{ name: "CarPooling", role: "Full-Stack", link: "https://github.com/gauravgupta654" }] },
    "PostgreSQL": { icon: "fas fa-elephant", projects: [{ name: "CarPooling", role: "Full-Stack", link: "https://github.com/gauravgupta654" }] },
    "LLMs": { icon: "fas fa-comments", projects: [{ name: "eSim AI Chatbot", role: "AI Developer", link: "https://github.com/gauravgupta654" }] },
    "Machine Learning": { icon: "fas fa-robot", projects: [{ name: "eSim AI Chatbot", role: "AI Developer", link: "https://github.com/gauravgupta654" }] }
};

const skillTags = document.querySelectorAll('.skill-tag');
const detailPane = document.getElementById('skillDetailPane');

skillTags.forEach(tag => {
    tag.addEventListener('click', () => {
        // Remove active class from all
        skillTags.forEach(t => t.classList.remove('active'));
        // Add active class to clicked
        tag.classList.add('active');

        const skillName = tag.getAttribute('data-skill');
        const skillIcon = tag.querySelector('i').className;
        const data = skillsData[skillName] || { icon: skillIcon, projects: [] };

        let projectsHtml = '';
        if (data.projects.length > 0) {
            projectsHtml = `
                <div class="skill-projects-label">Applied In Projects</div>
                <div class="skill-projects-list">
                    ${data.projects.map(p => `
                        <a href="${p.link}" target="_blank" rel="noopener" class="skill-project-card">
                            <div class="skill-project-name">${p.name} <i class="fas fa-arrow-right"></i></div>
                            <div class="skill-project-role">${p.role}</div>
                        </a>
                    `).join('')}
                </div>
            `;
        } else {
            projectsHtml = `
                <div class="skill-projects-label">Usage</div>
                <p style="font-size: 14px; color: var(--text2); line-height: 1.6;">
                    Applied in various academic assignments, problem-solving on LeetCode/GFG, and open-source contributions.
                </p>
            `;
        }

        detailPane.innerHTML = `
            <div class="skill-detail-content">
                <div class="skill-detail-header">
                    <div class="skill-detail-icon"><i class="${data.icon}"></i></div>
                    <div class="skill-detail-title">${skillName}</div>
                </div>
                ${projectsHtml}
            </div>
        `;
    });
});

// === Command Palette (⌘K quick jump) ===
const cmdkOverlay = document.getElementById('cmdkOverlay');
const cmdkInput = document.getElementById('cmdkInput');
const cmdkList = document.getElementById('cmdkList');
const cmdkTrigger = document.getElementById('cmdkTrigger');

const cmdkCommands = [
    { label: 'Go to About', hint: 'about.md', icon: 'fas fa-user', action: () => scrollToSection('about') },
    { label: 'Go to Skills', hint: 'skills.json', icon: 'fas fa-cogs', action: () => scrollToSection('skills') },
    { label: 'Go to Projects', hint: 'projects.tsx', icon: 'fas fa-rocket', action: () => scrollToSection('projects') },
    { label: 'Go to Experience', hint: 'experience.log', icon: 'fas fa-briefcase', action: () => scrollToSection('experience') },
    { label: 'Go to Education', hint: 'education.yml', icon: 'fas fa-graduation-cap', action: () => scrollToSection('education') },
    { label: 'Go to Contact', hint: 'contact.sh', icon: 'fas fa-envelope', action: () => scrollToSection('contact') },
    { label: 'Copy email address', hint: 'gauravgupta662454@gmail.com', icon: 'fas fa-copy', action: () => copyEmail() },
    { label: 'Open GitHub', hint: 'github.com/gauravgupta654', icon: 'fab fa-github', action: () => window.open('https://github.com/gauravgupta654', '_blank') },
    { label: 'Open LinkedIn', hint: 'linkedin.com/in/gaurav-gupta', icon: 'fab fa-linkedin-in', action: () => window.open('https://www.linkedin.com/in/gaurav-gupta-960027286/', '_blank') },
    { label: 'Open LeetCode profile', hint: 'leetcode.com/u/gauravgupta654', icon: 'fas fa-code', action: () => window.open('https://leetcode.com/u/gauravgupta654/', '_blank') },
];

let cmdkFiltered = cmdkCommands;
let cmdkSelected = 0;

function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    closeCmdk();
}

function copyEmail() {
    navigator.clipboard?.writeText('gauravgupta662454@gmail.com');
    closeCmdk();
}

function renderCmdk() {
    const query = cmdkInput.value.toLowerCase().trim();
    cmdkFiltered = cmdkCommands.filter(c =>
        c.label.toLowerCase().includes(query) || c.hint.toLowerCase().includes(query)
    );
    cmdkSelected = 0;
    if (cmdkFiltered.length === 0) {
        cmdkList.innerHTML = `<li class="cmdk-empty">No matching command</li>`;
        return;
    }
    cmdkList.innerHTML = cmdkFiltered.map((c, i) => `
        <li class="cmdk-item${i === 0 ? ' selected' : ''}" data-index="${i}">
            <i class="${c.icon}"></i>
            <span class="cmdk-item-label">${c.label}</span>
            <span class="cmdk-item-hint">${c.hint}</span>
        </li>
    `).join('');
}

function updateCmdkSelection() {
    [...cmdkList.children].forEach((li, i) => li.classList.toggle('selected', i === cmdkSelected));
    cmdkList.children[cmdkSelected]?.scrollIntoView({ block: 'nearest' });
}

function openCmdk() {
    if (!cmdkOverlay) return;
    cmdkOverlay.classList.add('active');
    cmdkInput.value = '';
    renderCmdk();
    document.body.style.overflow = 'hidden';
    setTimeout(() => cmdkInput.focus(), 60);
}

function closeCmdk() {
    if (!cmdkOverlay) return;
    cmdkOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (cmdkOverlay) {
    cmdkTrigger?.addEventListener('click', openCmdk);
    cmdkOverlay.addEventListener('click', e => { if (e.target === cmdkOverlay) closeCmdk(); });
    cmdkInput.addEventListener('input', renderCmdk);
    cmdkList.addEventListener('click', e => {
        const item = e.target.closest('.cmdk-item');
        if (!item) return;
        cmdkFiltered[parseInt(item.dataset.index, 10)]?.action();
    });

    document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            cmdkOverlay.classList.contains('active') ? closeCmdk() : openCmdk();
            return;
        }
        if (!cmdkOverlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeCmdk();
        if (e.key === 'ArrowDown') { e.preventDefault(); cmdkSelected = Math.min(cmdkSelected + 1, cmdkFiltered.length - 1); updateCmdkSelection(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); cmdkSelected = Math.max(cmdkSelected - 1, 0); updateCmdkSelection(); }
        if (e.key === 'Enter') { e.preventDefault(); cmdkFiltered[cmdkSelected]?.action(); }
    });
}

// === Spotlight hover glow on cards ===
document.querySelectorAll(
    '.project-card, .skill-category, .timeline-content, .education-card, .contact-item, .highlight-card, .contact-terminal'
).forEach(el => {
    el.classList.add('spotlight');
    el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
});

// === Magnetic buttons ===
document.querySelectorAll('.btn, .cmdk-trigger').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});