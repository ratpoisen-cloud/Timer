// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
const music = document.getElementById('bg-music');
const soundControl = document.getElementById('sound-control');
const soundIcon = document.getElementById('sound-icon');
const knight = document.getElementById('knight');
const entryPage = document.getElementById('entry-page');
const mainPage = document.getElementById('main-page');
const pathContainer = document.querySelector('.adventure-path-container');

// ===== ЛОГИКА РЫЦАРЯ (ВЕРТИКАЛЬНЫЙ СПУСК) =====
function updateKnightPosition() {
    if (mainPage.style.display === 'none' || !pathContainer) return; 

    // Размеры и позиция контейнера
    const containerRect = pathContainer.getBoundingClientRect();
    const containerTop = containerRect.top; // Расстояние от верха окна до начала контейнера
    const containerHeight = containerRect.height;
    const windowHeight = window.innerHeight;

    // Вычисляем, насколько мы прокрутили контейнер
    // Мы хотим, чтобы рыцарь начал движение, когда контейнер появился на экране
    // И дошел до низа, когда мы доскроллили до конца контейнера
    
    // offset - насколько пикселей верх контейнера ушел вверх за границу экрана
    // Добавляем отступ (например, рыцарь всегда на 200px ниже верха экрана, если мы внутри блока)
    
    // Простая логика:
    // Рыцарь должен быть привязан к скроллу.
    // Если начало контейнера выше середины экрана, рыцарь начинает спускаться.
    
    // Вычисляем прогресс прокрутки контейнера (0 = начало, 1 = конец)
    // startPoint: когда верх контейнера касается середины экрана
    const startPoint = windowHeight / 2;
    // distance: сколько мы проехали внутри контейнера
    let scrollDist = startPoint - containerTop; 
    
    // Ограничиваем рыцаря границами контейнера
    if (scrollDist < 0) scrollDist = 0;
    if (scrollDist > containerHeight - 60) scrollDist = containerHeight - 60; // 60 - высота рыцаря

    // Применяем позицию (relative к path-container, так как position: absolute у рыцаря)
    // Но подождите, рыцарь внутри sticky-контейнера? Нет, он просто absolute внутри path-container.
    
    knight.style.top = `${scrollDist}px`;
}

window.addEventListener('scroll', updateKnightPosition);

// ===== ОБЩИЕ ФУНКЦИИ =====
window.toggleMusic = function() {
  if (music.paused) {
    music.play();
    soundIcon.className = 'fas fa-volume-up';
  } else {
    music.pause();
    soundIcon.className = 'fas fa-volume-mute';
  }
}

window.toggleFaq = function(element) {
  const isActive = element.classList.contains('active');
  document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
  if (!isActive) element.classList.add('active');
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
    
    // Листья
    if (Date.now() - lastLeafTime > 100) {
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

// ВХОД
document.addEventListener('DOMContentLoaded', () => {
    const entryOverlay = document.getElementById('entry-overlay-transition');
    const treeBtn = document.getElementById('entry-tree-btn');

    if (treeBtn) {
        treeBtn.addEventListener('click', enterMainSite);
    }

    function enterMainSite() {
        try { music.volume = 0.5; music.play(); } catch (e) {}
        
        entryOverlay.style.opacity = '1';
        entryOverlay.style.pointerEvents = 'all';
        treeBtn.style.transform = 'translate(-50%, -50%) scale(3)';
        treeBtn.style.opacity = '0';

        setTimeout(() => {
            entryPage.style.display = 'none';
            mainPage.style.display = 'block';
            if(soundControl) soundControl.style.opacity = '1';
            initFireflies();
        }, 800);
    }
    
    function initFireflies() {
        const container = document.getElementById('fireflies-container');
        if(!container) return;
        for (let i = 0; i < 30; i++) {
            const f = document.createElement('div');
            f.className = 'firefly';
            f.style.left = Math.random() * 100 + '%';
            f.style.top = Math.random() * 100 + '%';
            f.style.animationDelay = Math.random() * 5 + 's';
            container.appendChild(f);
        }
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
        };
        setVal('days', d); setVal('hours', h); setVal('minutes', m); setVal('seconds', s);
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();
});
