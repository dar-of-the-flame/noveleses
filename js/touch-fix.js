// touch-fix.js - Исправление проблем с касанием на мобильных
document.addEventListener('DOMContentLoaded', function() {
    console.log('Touch fix initialized');
    
    // 1. Предотвращаем зум при двойном касании
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // 2. Предотвращаем контекстное меню при долгом касании
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // 3. Исправляем :active состояние на iOS
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // 4. Добавляем класс для стилей касания
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Исправляем задержку на iOS для кнопок
        document.addEventListener('touchstart', function(e) {
            const target = e.target;
            
            if (target.tagName === 'BUTTON' || 
                target.tagName === 'A' || 
                target.closest('button') || 
                target.closest('a')) {
                
                target.classList.add('touched');
                setTimeout(() => {
                    if (target) target.classList.remove('touched');
                }, 300);
            }
        }, { passive: true });
    }
    
    // 5. Устанавливаем правильную высоту для мобильных
    function setMobileHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Для iOS
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            const docHeight = window.innerHeight;
            document.documentElement.style.height = docHeight + 'px';
            document.body.style.height = docHeight + 'px';
        }
    }
    
    setMobileHeight();
    
    // 6. Обработчики изменения размера
    window.addEventListener('resize', setMobileHeight);
    window.addEventListener('orientationchange', function() {
        setTimeout(setMobileHeight, 100);
        setTimeout(setMobileHeight, 500);
    });
    
    // 7. Обработчик для скрытия хотбара при скролле
    let lastScrollPosition = 0;
    let ticking = false;
    
    function handleScroll() {
        lastScrollPosition = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                // Скрываем хотбар при скролле вниз
                if (lastScrollPosition > 50) {
                    document.body.classList.add('hide-hotbar');
                } else {
                    document.body.classList.remove('hide-hotbar');
                }
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 8. Показываем хотбар при начале касания
    document.addEventListener('touchstart', function() {
        document.body.classList.remove('hide-hotbar');
    }, { passive: true });
    
    // 9. Скрываем хотбар через 2 секунды после последнего касания
    let touchTimeout;
    document.addEventListener('touchstart', function() {
        clearTimeout(touchTimeout);
    }, { passive: true });
    
    document.addEventListener('touchend', function() {
        if (window.scrollY > 50) {
            touchTimeout = setTimeout(function() {
                document.body.classList.add('hide-hotbar');
            }, 2000);
        }
    }, { passive: true });
    
    // 10. Инициализация при загрузке
    setTimeout(function() {
        setMobileHeight();
        
        // Прокручиваем немного для активации правильной высоты на iOS
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            if (window.scrollY === 0) {
                window.scrollTo(0, 1);
                setTimeout(function() {
                    window.scrollTo(0, 0);
                }, 100);
            }
        }
    }, 1000);
    
    console.log('Touch fix applied');
});