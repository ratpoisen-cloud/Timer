// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
const music = document.getElementById('bg-music');
const soundControl = document.getElementById('sound-control');
const soundIcon = document.getElementById('sound-icon');
let isPlaying = false;

// ===== ФУНКЦИИ УПРАВЛЕНИЯ =====
window.toggleMusic = function() {
  if (isPlaying) {
    music.pause();
    soundIcon.classList.remove('fa-volume-up');
    soundIcon.classList.add('fa-volume-mute');
  } else {
    music.play();
    soundIcon.classList.remove('fa-volume-mute');
    soundIcon.classList.add('fa-volume-up');
  }
  isPlaying = !isPlaying;
}

window.toggleFaq = function(element) {
  const isActive = element.classList.contains('active');
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
  });
  if (!isActive) {
    element.classList.add('active');
  }
}

// ===== РЫЦАРЬ И СКРОЛЛ =====
const knight = document.getElementById('knight');
let scrollTimeout;

function moveKnight() {
    if (!knight) return;

    // Считаем % прокрутки страницы
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;

    // Ограничиваем движение: от 10% до 90% высоты экрана
    const minTop = 10;
    const maxTop = 90;
    
    // Новая позиция (top в %)
    const currentTop = minTop + (scrollPercent * (maxTop - minTop));
    knight.style.top = currentTop + '%';

    // Эффект "скачки" (добавляем класс пока скроллим)
    knight.classList.add('galloping');
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        knight.classList.remove('galloping');
    }, 150); // Останавливаемся через 150мс после остановки скролла
}

window.addEventListener('scroll', moveKnight);


// ===== ЛОГИКА ВХОДА =====
document.addEventListener('DOMContentLoaded', () => {
    const entryPage = document.getElementById('entry-page');
    const mainPage = document.getElementById('main-page');
    const entryOverlay = document.getElementById('entry-overlay-transition');
    const treeBtn = document.getElementById('entry-tree-btn');

    if (treeBtn) {
        treeBtn.addEventListener('click', enterMainSite);
    }

    document.addEventListener('keydown', (event) => {
        if ((event.code === 'Space' || event.code === 'Enter') && entryPage.style.display !== 'none') {
            enterMainSite();
        }
    });

    function enterMainSite() {
        try {
            music.volume = 0.5;
            const playPromise = music.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    isPlaying = true;
                    soundControl.style.opacity = '1';
                }).catch(error => {
                    soundControl.style.opacity = '1';
                });
            }
        } catch (e) {}

        entryOverlay.style.opacity = '1';
        entryOverlay.style.pointerEvents = 'all';
        
        if (treeBtn) {
            treeBtn.style.transform = 'translate(-50%, -50%) scale(3)';
            treeBtn.style.opacity = '0';
        }

        setTimeout(() => {
            entryPage.style.display = 'none';
            mainPage.style.display = 'block';
            initMainScripts();
            
            setTimeout(() => {
                if (isPlaying) soundIcon.className = 'fas fa-volume-up';
                else soundIcon.className = 'fas fa-volume-mute';
                soundControl.style.opacity = '1';
            }, 1000);
        }, 800);
    }

    initEntryFireflies();
});

function initEntryFireflies() {
    const container = document.getElementById('entry-fireflies');
    if (!container) return;
    for (let i = 0; i < 25; i++) {
        const f = document.createElement('div');
        f.className = 'entry-firefly';
        f.style.left = Math.random() * 100 + '%';
        f.style.top = Math.random() * 100 + '%';
        f.style.animationDelay = Math.random() * 5 + 's';
        f.style.opacity = 0.3 + Math.random() * 0.5;
        container.appendChild(f);
    }
}

// ===== СКРИПТЫ ГЛАВНОЙ СТРАНИЦЫ =====
function initMainScripts() {
    const container = document.getElementById('fireflies-container');
    for (let i = 0; i < 40; i++) {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');
        firefly.style.left = Math.random() * 100 + '%';
        firefly.style.top = Math.random() * 100 + '%';
        firefly.style.animationDuration = (Math.random() * 10 + 5) + 's';
        container.appendChild(firefly);
    }

    const weddingDate = new Date('2026-08-02T15:00:00');
    
    function updateCountdown() {
        const diff = weddingDate - new Date();
        if (diff <= 0) return;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if(el) el.innerText = val < 10 ? '0'+val : val;
        }
        setVal('days', d); setVal('hours', h); setVal('minutes', m); setVal('seconds', s);
        
        // Листик на таймере (упрощено)
        if(Math.random() > 0.9) spawnTimerLeaf(document.getElementById('days').parentNode);
    }
    
    function spawnTimerLeaf(container) {
        const leaf = document.createElement('i');
        leaf.classList.add('fas', 'fa-leaf', 'timer-leaf-anim');
        container.appendChild(leaf);
        setTimeout(() => leaf.remove(), 1200);
    }
    
    setInterval(updateCountdown, 1000);
    updateCountdown();

    function checkFadeIn() {
        document.querySelectorAll('.fade-in').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add('visible');
        });
    }
    window.addEventListener('scroll', checkFadeIn);
    checkFadeIn();
}

// КУРСОР
const cursor = document.getElementById('custom-cursor');
const entryCursor = document.getElementById('entry-cursor');
let lastLeafTime = 0;

document.addEventListener('mousemove', (e) => {
    const x = e.clientX + 'px';
    const y = e.clientY + 'px';
    if (cursor) { cursor.style.left = x; cursor.style.top = y; }
    if (entryCursor) { entryCursor.style.left = x; entryCursor.style.top = y; }
    
    // Эффект увеличения курсора на дереве
    const treeBtn = document.getElementById('entry-tree-btn');
    if (treeBtn && entryCursor) {
        const rect = treeBtn.getBoundingClientRect();
        const isHovering = (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom);
        entryCursor.style.transform = isHovering ? 'scale(1.5)' : 'scale(1)';
        entryCursor.style.color = isHovering ? '#ffd700' : '#C9A25B';
    }

    if (Date.now() - lastLeafTime > 80) {
        createLeaf(e.pageX, e.pageY);
        lastLeafTime = Date.now();
    }
});

function createLeaf(x, y) {
    const leaf = document.createElement('i');
    leaf.classList.add('fas', 'fa-leaf', 'cursor-leaf');
    const colors = ['#2A4B3C', '#8FAB93', '#C9A25B', '#e6c889'];
    leaf.style.color = colors[Math.floor(Math.random() * colors.length)];
    leaf.style.left = x + 'px';
    leaf.style.top = y + 'px';
    leaf.style.setProperty('--tx', (Math.random() * 100 - 50) + 'px');
    leaf.style.setProperty('--ty', (Math.random() * 100 + 50) + 'px');
    leaf.style.setProperty('--r', (Math.random() * 360) + 'deg');
    document.body.appendChild(leaf);
    setTimeout(() => leaf.remove(), 1500);
}
