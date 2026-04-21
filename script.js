(function () {
  'use strict';
 
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
 
  /* ── DOM ── */
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);
 
  /* ── PROJECT DATA ── */
  const PROJECTS = [
    {
      tag: 'IoT', title: 'Smart Farming IoT',
      desc: 'End-to-end farm monitoring — sensors for soil moisture, temperature, and humidity feed data to a cloud dashboard via MQTT broker. Farmers monitor conditions from any device in real-time.',
      stack: ['ESP32', 'MQTT', 'Node-RED', 'InfluxDB', 'Grafana', 'Telegram Bot'],
      highlights: ['Real-time MQTT sensor pipeline with sub-second latency', 'Auto-irrigation trigger on soil moisture threshold', 'Telegram alert on anomaly detection', 'Historical data in InfluxDB + Grafana dashboards']
    },
    {
      tag: 'AI', title: 'AI Website Builder',
      desc: 'Describe your website in plain language — the AI generates complete HTML, CSS, and JavaScript instantly. Supports custom themes, component selection, and one-click deployment.',
      stack: ['Python', 'FastAPI', 'GPT-4 API', 'React', 'Tailwind', 'Vercel'],
      highlights: ['Natural language → production code pipeline', 'Live browser preview sandbox', 'Export as ZIP or auto-deploy to hosting', '50+ starter templates with AI customization']
    },
    {
      tag: 'DevOps', title: 'DevOps Automation',
      desc: 'Full CI/CD pipeline from git push to live production. Automated build, test, containerize, and zero-downtime deploy to VPS with health checks and Telegram alerting.',
      stack: ['Docker', 'GitHub Actions', 'Nginx', 'Certbot', 'Telegram Bot', 'Shell'],
      highlights: ['Zero-downtime rolling deployment with Docker', 'Automatic SSL renewal via Certbot', 'Uptime monitor every 60s with Telegram alerts', 'Auto rollback on failed health checks']
    }
  ];
 
  /* ══════════════════════
     THEME
  ══════════════════════ */
  const Theme = (() => {
    const KEY = 'fadhil-theme';
    let dark = localStorage.getItem(KEY) === 'dark';
 
    function apply(d) {
      dark = d;
      document.body.classList.toggle('dark-mode', d);
      document.body.classList.toggle('light-mode', !d);
      const ic = $('themeIcon');
      if (ic) ic.className = d ? 'fas fa-moon' : 'fas fa-sun';
      localStorage.setItem(KEY, d ? 'dark' : 'light');
    }
 
    return {
      init() {
        apply(dark);
        const btn = $('themeToggle');
        if (btn) btn.addEventListener('click', () => apply(!dark));
      },
      isDark: () => dark
    };
  })();
 
  /* ══════════════════════
     CURSOR
  ══════════════════════ */
  const Cursor = (() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const lerp = (a, b, t) => a + (b - a) * t;
 
    return {
      init() {
        if (window.matchMedia('(max-width:768px)').matches) return;
        const dot = $('cursorDot'), ring = $('cursorRing');
        if (!dot || !ring) return;
 
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
 
        const tick = () => {
          rx = lerp(rx, mx, 0.14); ry = lerp(ry, my, 0.14);
          dot.style.left = mx + 'px'; dot.style.top = my + 'px';
          ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
          requestAnimationFrame(tick);
        };
        tick();
 
        $$('a,button,.proj-card,.sk-card,.cert-card').forEach(el => {
          el.addEventListener('mouseenter', () => { ring.style.width = '48px'; ring.style.height = '48px'; });
          el.addEventListener('mouseleave', () => { ring.style.width = '30px'; ring.style.height = '30px'; });
        });
      }
    };
  })();
 
  /* ══════════════════════
     PROGRESS BAR
  ══════════════════════ */
  const Progress = {
    init() {
      const bar = $('pageProgress');
      if (!bar) return;
      window.addEventListener('scroll', () => {
        const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
        bar.style.width = pct + '%';
      }, { passive: true });
    }
  };
 
  /* ══════════════════════
     NAVBAR
  ══════════════════════ */
  const Navbar = (() => {
    let menuOpen = false;
 
    function updateActive() {
      const sections = $$('header[id],section[id]');
      let cur = '';
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 90) cur = s.id; });
      $$('.nl').forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
    }
 
    return {
      init() {
        window.addEventListener('scroll', updateActive, { passive: true });
 
        const ham = $('hamburger'), drawer = $('mobDrawer');
        ham && ham.addEventListener('click', () => {
          menuOpen = !menuOpen;
          ham.classList.toggle('open', menuOpen);
          drawer && drawer.classList.toggle('open', menuOpen);
        });
 
        $$('.mob-link').forEach(l => l.addEventListener('click', () => {
          menuOpen = false;
          ham && ham.classList.remove('open');
          drawer && drawer.classList.remove('open');
        }));
 
        $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
          const t = document.querySelector(a.getAttribute('href'));
          if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
        }));
      }
    };
  })();
 
  /* ══════════════════════
     TYPING
  ══════════════════════ */
  const Typing = (() => {
    const phrases = ['IoT Engineer', 'AI Web Builder', 'DevOps Engineer'];
    let pi = 0, ci = 0, del = false, delay = 100;
 
    return {
      init() {
        const el = $('typingText');
        if (!el) return;
        const tick = () => {
          const cur = phrases[pi];
          if (!del) {
            el.textContent = cur.slice(0, ++ci);
            delay = 80;
            if (ci === cur.length) { del = true; delay = 2200; }
          } else {
            el.textContent = cur.slice(0, --ci);
            delay = 38;
            if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; delay = 380; }
          }
          setTimeout(tick, delay);
        };
        setTimeout(tick, 1300);
      }
    };
  })();
 
  /* ══════════════════════
     SCROLL REVEAL (fallback for non-GSAP)
  ══════════════════════ */
  const Reveal = {
    init() {
      const obs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 100);
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      $$('[data-reveal]').forEach(el => obs.observe(el));
    }
  };
 
  /* ══════════════════════
     GSAP ANIMATIONS
  ══════════════════════ */
  const Anims = {
    init() {
      if (typeof gsap === 'undefined') return;
 
      const stagger = (selector, trigger) =>
        gsap.from(selector, {
          scrollTrigger: { trigger, start: 'top 72%' },
          opacity: 0, y: 36, stagger: 0.13, duration: 0.65, ease: 'power2.out'
        });
 
      stagger('.sk-card', '.skills-sec');
      stagger('.proj-card', '.proj-sec');
      stagger('.cert-card', '.certs-sec');
      stagger('.dc', '.dash-sec');
    }
  };
 
  /* ══════════════════════
     MODAL
  ══════════════════════ */
  const Modal = (() => {
    function build(p) {
      return `
        <span class="m-tag">${p.tag}</span>
        <h2 class="m-title">${p.title}</h2>
        <p class="m-desc">${p.desc}</p>
        <div class="m-stack">${p.stack.map(s => `<span>${s}</span>`).join('')}</div>
        <div class="m-hl">
          <h4>Key Features</h4>
          <ul>${p.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
        </div>`;
    }
 
    return {
      init() {
        const ov = $('mOv'), close = $('mClose'), content = $('mContent');
 
        $$('.proj-card').forEach(card => {
          card.addEventListener('click', () => {
            content.innerHTML = build(PROJECTS[+card.dataset.project]);
            ov.classList.add('open');
            document.body.style.overflow = 'hidden';
          });
        });
 
        const closeModal = () => { ov.classList.remove('open'); document.body.style.overflow = ''; };
        close && close.addEventListener('click', closeModal);
        ov && ov.addEventListener('click', e => { if (e.target === ov) closeModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
      }
    };
  })();
 
  /* ══════════════════════
     TOAST
  ══════════════════════ */
  const Toast = (() => {
    let t;
    return {
      show(msg, dur = 3200) {
        const el = $('toast');
        if (!el) return;
        el.textContent = msg; el.classList.add('show');
        clearTimeout(t); t = setTimeout(() => el.classList.remove('show'), dur);
      }
    };
  })();
 
  /* ══════════════════════
     CONTACT FORM
  ══════════════════════ */
  const Form = {
    init() {
      const form = $('contactForm');
      if (!form) return;
      form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = $('submitBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        setTimeout(() => {
          const ok = $('cfSuccess');
          if (ok) ok.classList.add('show');
          form.reset();
          btn.disabled = false;
          btn.innerHTML = 'Kirim Pesan <i class="fas fa-paper-plane"></i>';
          Toast.show('✅ Pesan berhasil terkirim!');
          setTimeout(() => ok && ok.classList.remove('show'), 5000);
        }, 1600);
      });
    }
  };
 
  /* ══════════════════════
     IoT SENSOR + CHART
  ══════════════════════ */
  const IoT = (() => {
    const labels = Array.from({ length: 12 }, (_, i) => `${12 - i}m`).reverse();
    const genArr = (base, range) => Array.from({ length: 12 }, () => +(base + Math.random() * range).toFixed(1));
    let tempHist = genArr(24, 8), humHist = genArr(52, 22), soilHist = genArr(32, 36);
    let chart;
 
    function mkChart() {
      const ctx = $('sensorChart');
      if (!ctx) return;
      const dark = document.body.classList.contains('dark-mode');
      const grid = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
      const tick = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
      const line1 = dark ? '#FFE600' : '#000000';
 
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'Temp °C', data: [...tempHist], borderColor: line1, backgroundColor: dark ? 'rgba(255,230,0,0.07)' : 'rgba(0,0,0,0.05)', tension: 0.42, fill: true, pointRadius: 2, borderWidth: 2 },
            { label: 'Humidity %', data: [...humHist], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.05)', tension: 0.42, fill: false, pointRadius: 2, borderWidth: 1.5 },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: true,
          interaction: { intersect: false, mode: 'index' },
          plugins: { legend: { labels: { color: tick, font: { size: 11, family: 'DM Mono' }, boxWidth: 12 } } },
          scales: {
            x: { grid: { color: grid }, ticks: { color: tick, font: { size: 10 } } },
            y: { grid: { color: grid }, ticks: { color: tick, font: { size: 10 } } }
          }
        }
      });
    }
 
    function update() {
      const nT = +(24 + Math.random() * 8).toFixed(1);
      const nH = +(52 + Math.random() * 22).toFixed(1);
      const nS = +(32 + Math.random() * 36).toFixed(1);
 
      const tv = $('tempVal'), hv = $('humVal'), sv = $('soilVal');
      if (tv) tv.textContent = nT + '°C';
      if (hv) hv.textContent = nH + '%';
      if (sv) sv.textContent = nS + '%';
 
      if (chart) {
        chart.data.datasets[0].data.shift(); chart.data.datasets[0].data.push(nT);
        chart.data.datasets[1].data.shift(); chart.data.datasets[1].data.push(nH);
        chart.update('none');
      }
    }
 
    return {
      init() {
        mkChart();
        update();
        setInterval(update, 2500);
        $('themeToggle') && $('themeToggle').addEventListener('click', () => {
          setTimeout(() => { if (chart) { chart.destroy(); chart = null; } mkChart(); }, 350);
        });
      }
    };
  })();
 
  /* ══════════════════════
     SERVER STATUS
  ══════════════════════ */
  const Server = {
    init() {
      function update() {
        const vals = [
          Math.floor(18 + Math.random() * 48),
          Math.floor(38 + Math.random() * 38),
          Math.floor(14 + Math.random() * 22)
        ];
        const ids = [['cpuBar','cpuPct'],['ramBar','ramPct'],['diskBar','diskPct']];
        ids.forEach(([bid, pid], i) => {
          const b = $(bid), p = $(pid);
          if (b) b.style.width = vals[i] + '%';
          if (p) p.textContent = vals[i] + '%';
        });
      }
      update();
      setInterval(update, 4000);
    }
  };
 
  /* ══════════════════════
     GITHUB API
  ══════════════════════ */
  const GitHub = {
    async init() {
      try {
        const res = await fetch('https://api.github.com/users/fadhilstudy');
        if (!res.ok) throw 0;
        const d = await res.json();
        const set = (id, v) => { const el = $(id); if (el) el.textContent = v ?? '—'; };
        set('ghRepos', d.public_repos);
        set('ghFollowers', d.followers);
        set('ghFollowing', d.following);
      } catch {
        const fallback = { ghRepos: 12, ghFollowers: 24, ghFollowing: 18 };
        Object.entries(fallback).forEach(([id, v]) => { const el = $(id); if (el) el.textContent = v; });
      }
    }
  };
 
  /* ══════════════════════
     HERO GSAP
  ══════════════════════ */
  const HeroAnim = {
    init() {
      if (typeof gsap === 'undefined') return;
      gsap.from('#heroName', { opacity: 0, y: 60, duration: 1, delay: 0.3, ease: 'power3.out' });
    }
  };
 
  /* ══════════════════════
     BOOT
  ══════════════════════ */
  function boot() {
    Theme.init();
    Cursor.init();
    Progress.init();
    Navbar.init();
    Typing.init();
    Reveal.init();
    Anims.init();
    Modal.init();
    Form.init();
    IoT.init();
    Server.init();
    GitHub.init();
    HeroAnim.init();
  }
 
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();
 
})();
