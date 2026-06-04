/* ===== PARTICLES ===== */
(function () {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let w, h, stars = [];

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    function createStars(n) {
        stars = [];
        for (let i = 0; i < n; i++) {
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.5 + 0.3,
                speed: Math.random() * 0.15 + 0.05,
                opacity: Math.random() * 0.6 + 0.2,
                color: Math.random() > 0.85 
                    ? `rgba(167,139,250,${Math.random() * 0.6 + 0.3})`
                    : Math.random() > 0.7
                        ? `rgba(34,211,238,${Math.random() * 0.5 + 0.2})`
                        : `rgba(226,232,240,${Math.random() * 0.4 + 0.2})`
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        for (const s of stars) {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.fill();
            s.y += s.speed;
            if (s.y > h) { s.y = -2; s.x = Math.random() * w; }
        }
        requestAnimationFrame(draw);
    }

    resize();
    createStars(200);
    draw();
    window.addEventListener('resize', () => { resize(); createStars(200); });
})();

/* ===== SIDEBAR TOGGLE ===== */
const sidebar   = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');

hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

/* ===== ACTIVE NAV ON SCROLL ===== */
const navLinks  = document.querySelectorAll('.nav-link[data-section]');
const sections  = document.querySelectorAll('section[id]');

const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            navLinks.forEach(l => l.classList.remove('active'));
            const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    }
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

/* ===== RECIPE FILTER ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const recipeCards = document.querySelectorAll('.recipe-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        recipeCards.forEach(card => {
            const cats = card.dataset.category || '';
            if (filter === 'all' || cats.split(' ').includes(filter)) {
                card.classList.remove('hidden');
                card.style.animation = 'none';
                requestAnimationFrame(() => {
                    card.style.animation = 'slide-up 0.25s ease both';
                });
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

/* ===== SMOOTH SCROLL + MOBILE CLOSE ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
            e.preventDefault();
            sidebar.classList.remove('open');
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ===== DOWNLOAD BTN PULSE ===== */
const dlBtn = document.getElementById('download-btn');
if (dlBtn) {
    let pulse = true;
    setInterval(() => {
        if (pulse) {
            dlBtn.style.boxShadow = '0 8px 35px rgba(139,92,246,0.7), inset 0 1px 0 rgba(255,255,255,0.2)';
        } else {
            dlBtn.style.boxShadow = '0 4px 20px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.15)';
        }
        pulse = !pulse;
    }, 1500);
}

/* ===== INTERSECTION ANIMATIONS ===== */
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .mob-card, .recipe-card, .boss-card, .timeline-item, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.25s, box-shadow 0.25s';
    fadeObserver.observe(el);
});
