// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
const music = document.getElementById('bg-music');
const soundControl = document.getElementById('sound-control');
const soundIcon = document.getElementById('sound-icon');
const knight = document.getElementById('knight');
const mapTarget = document.getElementById('map-target');
const startMarker = document.getElementById('start-marker'); // ФОТО ПАРЫ
const entryPage = document.getElementById('entry-page');
const mainPage = document.getElementById('main-page');

// ===== ЛОГИКА РЫЦАРЯ =====
function updateKnightPosition() {
    if (mainPage.style.display === 'none') return; 

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Получаем позицию, где заканчивается фото пары
    // startY = отступ фото от верха страницы + высота фото
    // Рыцарь начнет движение, когда это место будет где-то в середине экрана
    let startY = 0;
    if (startMarker) {
        const rect = startMarker.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;
        startY = absoluteTop + rect.height; // Координата низа фото
    } else {
        startY = windowHeight; // Фолбэк, если фото не найдено
    }

    const endY = mapTarget.offsetTop; // Финиш у карты
    
    // Прогресс скролла (рыцарь начинает путь от startY до endY)
    // Добавляем windowHeight/2, чтобы он начинал движение, когда мы доскроллили до места
    let progress = (scrollY + windowHeight*0.6 - startY) / (endY - startY);
    
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    let xOffset = 0;
    
    // Показываем рыцаря только если мы прошли фото
    if (scrollY > startY - windowHeight * 0.8 && scrollY < endY + windowHeight) {
        // Амплитуда зигзага
        const amplitude = window.innerWidth < 768 ? 35 : 40; 
        
        // Зигзаг
        xOffset = Math.sin(progress * Math.PI * 5) * amplitude;
        
        // Поворот
        const direction = Math.cos(progress * Math.PI * 5);
        if (direction > 0) {
            knight.style.transform = `translate(-50%, -50%) scaleX(1)`;
        } else {
            knight.style.transform = `translate(-50%, -50%) scaleX(-1)`;
        }
        
        knight.style.opacity = '1';
    } else {
        knight.style.opacity = '0';
    }

    // Применяем
    knight.style.left = `calc(50% + ${xOffset}vw)`;
}

window.addEventListener('scroll', updateKnightPosition);

// ===== ОСТАЛЬНОЙ ФУНКЦИОНАЛ =====
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

// КУРСОР И ЛИСТЬЯ
const cursor = document.getElementById('custom-cursor');
const entryCursor = document.getElementById('entry-cursor');
let lastLeafTime = 0;

document.addEventListener('mousemove', (e) => {
    const x = e.clientX + 'px';
    const y = e.clientY + 'px';
    
    if (cursor) { cursor.style.left = x; cursor.style.top = y; }
    if (entryCursor) { entryCursor.style.left = x; entryCursor.style.top = y; }
    
    const treeBtn = document.getElementById('entry-tree-btn');
    if (treeBtn && entryCursor) {
        const rect = treeBtn.getBoundingClientRect();
        const isHovering = (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom);
        if(isHovering) {
             entryCursor.style.transform = 'scale(1.5)';
             entryCursor.style.color = '#ffd700';
        } else {
             entryCursor.style.transform = 'scale(1)';
             entryCursor.style.color = '#C9A25B';
        }
    }

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

// ЗАГРУЗКА И ВХОД
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
