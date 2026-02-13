// ... (ваш предыдущий код) ...

// ===== ЛОГИКА РЫЦАРЯ И АНИМАЦИЯ =====
const knight = document.getElementById('knight');
let scrollTimeout; // Переменная для отслеживания остановки скролла

function moveKnight() {
    if (!knight) return;

    // 1. Движение вниз (как было)
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;

    const minTop = 10; 
    const maxTop = 90; 
    const currentTop = minTop + (scrollPercent * (maxTop - minTop));

    knight.style.top = currentTop + '%';

    // 2. Анимация скачки (Новое)
    // Добавляем класс, чтобы иконка начала прыгать
    knight.classList.add('galloping');

    // Сбрасываем старый таймер, если скролл продолжается
    clearTimeout(scrollTimeout);

    // Устанавливаем новый таймер: если скролла нет 150мс, остановить скачку
    scrollTimeout = setTimeout(() => {
        knight.classList.remove('galloping');
    }, 150);
}

window.addEventListener('scroll', moveKnight);
