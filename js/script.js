// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
const music = document.getElementById('bg-music');
const soundControl = document.getElementById('sound-control');
const soundIcon = document.getElementById('sound-icon');
const knight = document.getElementById('knight');
const mapTarget = document.getElementById('map-target');
const entryPage = document.getElementById('entry-page');
const mainPage = document.getElementById('main-page');

// ===== ЛОГИКА РЫЦАРЯ =====
function updateKnightPosition() {
    if (mainPage.style.display === 'none') return; 

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Зоны движения
    const startY = windowHeight; // Рыцарь стартует после шапки
    const endY = mapTarget.offsetTop; // Финиширует у карты
    
    // Прогресс (от 0 до 1)
    let progress = (scrollY + windowHeight/2 - startY) / (endY - startY);
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    let xOffset = 0;
    
    // Если мы на пути к карте
    if (scrollY > startY - windowHeight && scrollY < endY) {
        // Амплитуда зигзага
        const amplitude = window.innerWidth < 768 ? 35 : 40; 
        
        // Формула зигзага (синусоида)
        xOffset = Math.sin(progress * Math.PI * 5) * amplitude;
        
        // Поворот рыцаря в сторону движения
        const direction = Math.cos(progress * Math.PI * 5);
        if (direction > 0) {
            knight.style.transform = `translate(-50%, -50%) scaleX(1)`;
        } else {
            knight.style.transform = `translate(-50%, -50%) scaleX(-1)`;
        }
        
        knight.style.opacity = '1';
    } else {
        knight.style.opacity = '0'; // Прячем рыцаря вне пути
    }

    // Применяем координаты
    knight.style.left = `calc(50% + ${xOffset}vw)`;
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
    
    // Светлячки
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
    
    // Таймер
    const weddingDate = new Date('2026-08-02T15:00:00');
    function updateCountdown() {
        const diff = weddingDate - new Date();
        if (diff <= 0) return;
        document.getElementById('days').innerText = Math.floor(diff / (1000 * 60 * 60 * 24));
        document.getElementById('hours').innerText = Math.floor((diff / (1000 * 60 * 60)) % 24);
        document.getElementById('minutes').innerText = Math.floor((diff / (1000 * 60)) % 60);
        document.getElementById('seconds').innerText = Math.floor((diff / 1000) % 60);
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();
});
