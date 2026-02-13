// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
const music = document.getElementById('bg-music');
const knight = document.getElementById('knight');
const mapTarget = document.getElementById('map-target');
const entryPage = document.getElementById('entry-page');
const mainPage = document.getElementById('main-page');

// ===== ЛОГИКА РЫЦАРЯ =====
function updateKnightPosition() {
    if (mainPage.style.display === 'none') return; // Не двигаем, пока не вошли

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Начало пути (после хедера)
    const startY = windowHeight; 
    // Конец пути (карта)
    const endY = mapTarget.offsetTop;
    
    // Прогресс скролла от 0 до 1 между хедером и картой
    let progress = (scrollY + windowHeight/2 - startY) / (endY - startY);
    
    // Ограничиваем прогресс
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    // 1. Движение по вертикали (Y)
    // Рыцарь всегда по центру экрана (50vh), но если мы дошли до карты, он "паркуется" там
    // Для простоты: пусть он будет фиксирован по центру экрана, пока мы не доскроллим до конца
    
    // 2. Движение по горизонтали (X) - ЗИГЗАГ (Синусоида)
    // Math.sin создает волну. Умножаем progress на Math.PI * 4 (2 полных волны)
    // 40vw - амплитуда отклонения (насколько сильно влево/вправо)
    
    let xOffset = 0;
    
    // Включаем зигзаг только если мы в зоне "пути"
    if (scrollY > startY - windowHeight && scrollY < endY) {
        // На мобильных амплитуда меньше (35vw), на пк больше (40vw)
        const amplitude = window.innerWidth < 768 ? 35 : 40; 
        
        // Синусоида: progress * PI * кол-во витков
        xOffset = Math.sin(progress * Math.PI * 5) * amplitude;
        
        // Поворот рыцаря в сторону движения
        // Если производная синуса положительная -> едет вправо, иначе влево
        const direction = Math.cos(progress * Math.PI * 5);
        if (direction > 0) {
            knight.style.transform = `translate(-50%, -50%) scaleX(1)`; // Вправо
        } else {
            knight.style.transform = `translate(-50%, -50%) scaleX(-1)`; // Влево (зеркально)
        }
    } else {
        // Если мы не на пути (в хедере или внизу), рыцарь по центру
        xOffset = 0;
    }

    // Применяем позицию
    knight.style.left = `calc(50% + ${xOffset}vw)`;
    
    // Скрываем рыцаря в самом верху (на хедере) и в самом низу
    if (scrollY < windowHeight * 0.5) {
        knight.style.opacity = '0';
    } else {
        knight.style.opacity = '1';
    }
}

window.addEventListener('scroll', updateKnightPosition);


// ===== ОСТАЛЬНОЙ КОД (ВХОД, МУЗЫКА) =====
window.toggleMusic = function() {
  const icon = document.getElementById('sound-icon');
  if (music.paused) {
    music.play();
    icon.className = 'fas fa-volume-up';
  } else {
    music.pause();
    icon.className = 'fas fa-volume-mute';
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
            document.getElementById('sound-control').style.opacity = '1';
            
            // Инициализация светлячков на главной
            initFireflies();
        }, 800);
    }
    
    // Светлячки (общая функция)
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
