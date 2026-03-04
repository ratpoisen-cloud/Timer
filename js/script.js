// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
const music = document.getElementById('bg-music');
const soundControl = document.getElementById('sound-control');
const soundIcon = document.getElementById('sound-icon');
let isPlaying = false;

// ===== ФУНКЦИИ УПРАВЛЕНИЯ =====

// Переключение музыки (глобальное)
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

// Аккордеон FAQ (глобальное)
window.toggleFaq = function(element) {
  const isActive = element.classList.contains('active');
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
  });
  if (!isActive) {
    element.classList.add('active');
  }
}

// ===== ЛОГИКА ВХОДА И ИНИЦИАЛИЗАЦИИ =====
document.addEventListener('DOMContentLoaded', () => {
    const entryPage = document.getElementById('entry-page');
    const mainPage = document.getElementById('main-page');
    const entryOverlay = document.getElementById('entry-overlay-transition');
    const waxSeal = document.getElementById('entry-wax-seal');

    // Клик теперь вешаем на ДЕРЕВО (кнопку)
    const treeBtn = document.getElementById('entry-tree-btn');

    if (treeBtn) {
        treeBtn.addEventListener('click', enterMainSite);
    }

    // Доступность (Enter/Space)
    document.addEventListener('keydown', (event) => {
        if ((event.code === 'Space' || event.code === 'Enter') && entryPage.style.display !== 'none') {
            enterMainSite();
        }
    });

    function enterMainSite() {
        // 1. Попытка запуска музыки
        try {
            music.volume = 0.5;
            const playPromise = music.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    isPlaying = true;
                    soundControl.style.opacity = '1';
                }).catch(error => {
                    console.log("Автозапуск блокирован, ждем клика");
                    soundControl.style.opacity = '1';
                });
            }
        } catch (e) { console.error(e); }

        // 2. Анимация исчезновения входа
        entryOverlay.style.opacity = '1';
        entryOverlay.style.pointerEvents = 'all';
        
        // Анимация дерева при клике (увеличение и исчезновение)
        if (treeBtn) {
            treeBtn.style.transform = 'translate(-50%, -50%) scale(3)';
            treeBtn.style.opacity = '0';
        }

        // 3. Смена экранов
        setTimeout(() => {
            entryPage.style.display = 'none';
            mainPage.style.display = 'block';
            
            // Запуск логики главной страницы
            initMainScripts();
            
            // Если музыка заиграла, показываем иконку
            setTimeout(() => {
                if (isPlaying) {
                    soundIcon.className = 'fas fa-volume-up';
                } else {
                    soundIcon.className = 'fas fa-volume-mute';
                }
                soundControl.style.opacity = '1';
            }, 1000);
        }, 800);
    }

    // Запуск светлячков на входе
    initEntryFireflies();
});

// Светлячки на входе
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
    // 1. Светлячки (основные)
    const container = document.getElementById('fireflies-container');
    for (let i = 0; i < 40; i++) {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');
        firefly.style.left = Math.random() * 100 + '%';
        firefly.style.top = Math.random() * 100 + '%';
        const size = Math.random() * 3 + 3;
        firefly.style.width = size + 'px';
        firefly.style.height = size + 'px';
        firefly.style.setProperty('--x2', (Math.random() * 200 - 100) + 'px');
        firefly.style.setProperty('--y2', (Math.random() * 200 - 100) + 'px');
        firefly.style.setProperty('--x4', (Math.random() * 200 - 100) + 'px');
        firefly.style.setProperty('--y4', (Math.random() * 200 - 100) + 'px');
        firefly.style.animationDuration = (Math.random() * 10 + 5) + 's';
        firefly.style.animationDelay = (Math.random() * 5) + 's';
        container.appendChild(firefly);
    }

    // 2. Таймер с падающими листьями
    const weddingDate = new Date('2026-08-02T15:00:00');
    let prevValues = { d: null, h: null, m: null, s: null };

    function updateCountdown() {
        const now = new Date();
        const diff = weddingDate - now;
        
        if (diff <= 0) return;
        
        const values = {
            d: Math.floor(diff / (1000 * 60 * 60 * 24)),
            h: Math.floor((diff / (1000 * 60 * 60)) % 24),
            m: Math.floor((diff / (1000 * 60)) % 60),
            s: Math.floor((diff / 1000) % 60)
        };

        const updatePart = (id, key) => {
            const el = document.getElementById(id);
            if (!el) return;
            const formattedVal = values[key] < 10 ? '0' + values[key] : values[key];
            if (prevValues[key] !== values[key]) {
                el.innerText = formattedVal;
                if (prevValues[key] !== null) {
                    spawnTimerLeaf(el.parentElement);
                }
                prevValues[key] = values[key];
            }
        };

        updatePart('days', 'd');
        updatePart('hours', 'h');
        updatePart('minutes', 'm');
        updatePart('seconds', 's');
    }
    
    // Функция создания листика для таймера
    function spawnTimerLeaf(container) {
        const leaf = document.createElement('i');
        leaf.classList.add('fas', 'fa-leaf', 'timer-leaf-anim');
        const randomX = (Math.random() * 60 - 30) + 'px';
        leaf.style.setProperty('--fall-x', randomX);
        container.appendChild(leaf);
        setTimeout(() => leaf.remove(), 1200);
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 3. Анимация появления (Fade In)
    function checkFadeIn() {
        document.querySelectorAll('.fade-in').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add('visible');
        });
    }
    window.addEventListener('scroll', checkFadeIn);
    checkFadeIn();
}

// ===== КУРСОР И ЛИСТЬЯ (МОБИЛЬНАЯ ОПТИМИЗАЦИЯ) =====

const cursor = document.getElementById('custom-cursor');
const entryCursor = document.getElementById('entry-cursor');

const isMobile = window.matchMedia("(pointer: coarse)").matches;

let lastLeafTime = 0;
const LEAF_INTERVAL_DESKTOP = 80;
const LEAF_INTERVAL_MOBILE = 140;

// ===== СОЗДАНИЕ ЛИСТА =====
function createLeaf(x, y) {
  const leaf = document.createElement('i');
  leaf.classList.add('fas', 'fa-leaf', 'cursor-leaf');

  const colors = ['#283618', '#606c38', '#C9A25B', '#8cac74'];
  leaf.style.color = colors[Math.floor(Math.random() * colors.length)];

  leaf.style.left = x + 'px';
  leaf.style.top = y + 'px';

  leaf.style.setProperty('--tx', (Math.random() * 100 - 50) + 'px');
  leaf.style.setProperty('--ty', (Math.random() * 100 + 50) + 'px');
  leaf.style.setProperty('--r', (Math.random() * 360) + 'deg');

  document.body.appendChild(leaf);

  // гарантированное удаление
  setTimeout(() => {
    if (leaf && leaf.parentNode) leaf.remove();
  }, 1200);
}

// ===== ДЕСКТОП =====
if (!isMobile) {
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX + 'px';
    const y = e.clientY + 'px';

    if (cursor) {
      cursor.style.left = x;
      cursor.style.top = y;
    }

    if (entryCursor) {
      entryCursor.style.left = x;
      entryCursor.style.top = y;

      const treeBtn = document.getElementById('entry-tree-btn');
      if (treeBtn) {
        const rect = treeBtn.getBoundingClientRect();
        const isHovering =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        entryCursor.style.transform = isHovering ? 'scale(1.5)' : 'scale(1)';
        entryCursor.style.color = isHovering ? '#C9A25B' : '#e6c889';
      }
    }

    if (Date.now() - lastLeafTime > LEAF_INTERVAL_DESKTOP) {
      createLeaf(e.pageX, e.pageY);
      lastLeafTime = Date.now();
    }
  });
}

// ===== МОБИЛЬНЫЕ =====
if (isMobile) {

  function spawnLeafFromViewport() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    createLeaf(x, y);
  }

  document.addEventListener('touchmove', (e) => {
    if (Date.now() - lastLeafTime > LEAF_INTERVAL_MOBILE) {
      const touch = e.touches[0];
      if (touch) {
        createLeaf(touch.pageX, touch.pageY);
      }
      lastLeafTime = Date.now();
    }
  }, { passive: true });

  // ⭐ листья при скролле страницы
  window.addEventListener('scroll', () => {
    if (Date.now() - lastLeafTime > LEAF_INTERVAL_MOBILE) {
      spawnLeafFromViewport();
      lastLeafTime = Date.now();
    }
  }, { passive: true });

  document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    if (touch) createLeaf(touch.pageX, touch.pageY);
  }, { passive: true });

  document.addEventListener('touchend', () => {
    lastLeafTime = 0;
  });
}
// Легкий параллакс для секции подарков (опционально)
if (document.querySelector('.gift-section')) {
  window.addEventListener('scroll', () => {
    document.querySelectorAll('.parallax-bg').forEach(bg => {
      const speed = parseFloat(bg.dataset.speed) || 0.15;
      const yPos = -(window.scrollY * speed);
      bg.style.transform = `translateY(${yPos}px)`;
    });
  });
}
// ===== RSVP ВЫБОР ОТВЕТА =====
let selectedResponse = '';

window.showContactOptions = function(response) {
    selectedResponse = response;
    
    // Создаем шаблоны сообщений
    let telegramMessage = '';
    let emailSubject = '';
    let emailBody = '';
    
    if (response === 'yes') {
        telegramMessage = 'Дорогие! Буду как штык 2 августа 2026.';
        emailSubject = 'Буду как штык';
        emailBody = 'Дорогие! Буду как штык 2 августа 2026.';
    } else {
        telegramMessage = 'Дорогие! К сожалению, не смогу быть. Обнимаю!';
        emailSubject = 'Не обессудь';
        emailBody = 'Дорогие! Не смогу быть. Обнимаю!';
    }
    
    // Кодируем для URL
    const encodedTelegramMessage = encodeURIComponent(telegramMessage);
    const encodedEmailSubject = encodeURIComponent(emailSubject);
    const encodedEmailBody = encodeURIComponent(emailBody);
    
    // Обновляем ссылки
    const telegramLink = document.getElementById('telegramLink');
    const emailLink = document.getElementById('emailLink');
    
    if (telegramLink) {
        telegramLink.href = `https://t.me/RTPSN?text=${encodedTelegramMessage}`;
    }
    
    if (emailLink) {
        emailLink.href = `mailto:ratpoisen@yandex.ru?subject=${encodedEmailSubject}&body=${encodedEmailBody}`;
    }
    
    // Показываем блок с выбором контакта
    const contactOptions = document.getElementById('contactOptions');
    if (contactOptions) {
        contactOptions.style.display = 'block';
        
        // Прокручиваем к блоку
        setTimeout(() => {
            contactOptions.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
}

// Функция копирования email в буфер обмена
window.copyEmailToClipboard = function() {
    const email = 'ratpoisen@yandex.ru';
    
    // Создаем временный элемент
    const tempInput = document.createElement('input');
    tempInput.value = email;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    // Показываем уведомление
    alert('Email скопирован: ' + email);
}
