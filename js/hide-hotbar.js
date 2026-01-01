// hide-hotbar.js - Скрытие нижней панели браузера при скролле
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hide hotbar script initialized');
    
    const isMobile = 'ontouchstart' in window;
    if (!isMobile) return;
    
    // Функция для управления высотой
    function updateHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Для iOS Safari
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            const docHeight = window.innerHeight;
            document.documentElement.style.height = docHeight + 'px';
            document.body.style.height = docHeight + 'px';
        }
        
        console.log('Height updated:', window.innerHeight, 'px');
    }
    
    // Инициализация высоты
    updateHeight();
    
    // Обработчики изменения размера
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', function() {
        setTimeout(updateHeight, 100);
    });
    
    // Управление хотбаром при скролле
    let lastScrollTop = 0;
    let isScrolling = false;
    let scrollTimeout;
    
    function handleScroll() {
        if (!isScrolling) {
            isScrolling = true;
            
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
            
            // Если скроллим вниз и не в самом верху - скрываем хотбар
            if (scrollDirection === 'down' && scrollTop > 50) {
                document.body.classList.add('hide-hotbar');
            } 
            // Если скроллим вверх или в самом верху - показываем хотбар
            else if (scrollDirection === 'up' || scrollTop < 10) {
                document.body.classList.remove('hide-hotbar');
            }
            
            lastScrollTop = scrollTop;
            
            // Сбрасываем таймер скролла
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                isScrolling = false;
            }, 100);
        }
    }
    
    // Обработчик скролла
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Обработчик касания
    document.addEventListener('touchstart', function() {
        // При касании обновляем высоту
        setTimeout(updateHeight, 100);
        
        // Если не в самом верху, скрываем хотбар
        if (window.pageYOffset > 50) {
            document.body.classList.add('hide-hotbar');
        }
    }, { passive: true });
    
    // Восстанавливаем хотбар при паузе в скролле
    let hideTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(function() {
            document.body.classList.remove('hide-hotbar');
        }, 2000);
    }, { passive: true });
    
    // Инициализация при загрузке
    setTimeout(function() {
        // Прокручиваем немного для активации правильной высоты
        if (window.pageYOffset === 0) {
            window.scrollTo(0, 1);
            setTimeout(function() {
                window.scrollTo(0, 0);
                updateHeight();
            }, 50);
        }
        
        updateHeight();
    }, 500);
    
    console.log('Hide hotbar script applied');
});