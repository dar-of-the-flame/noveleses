// mobile-scroll-fix.js - Исправление мобильного скролла
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile scroll fix initialized');
    
    const isMobile = 'ontouchstart' in window;
    if (!isMobile) return;
    
    // 1. Улучшенный свайп для продолжения
    let touchStartY = 0;
    let isSwiping = false;
    
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
            isSwiping = true;
            
            // Обновляем высоту при касании
            setTimeout(() => {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            }, 100);
        }
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (!isSwiping || e.touches.length !== 1) return;
        
        const currentY = e.touches[0].clientY;
        const diffY = touchStartY - currentY;
        
        // Свайп вверх более 30px для продолжения
        if (diffY > 30) {
            const continueIndicator = document.getElementById('continue-indicator');
            if (continueIndicator && continueIndicator.classList.contains('visible')) {
                // Эмулируем клик
                const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                continueIndicator.dispatchEvent(clickEvent);
                
                // Визуальная обратная связь
                const feedback = document.createElement('div');
                feedback.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 3rem;
                    color: #9f7aea;
                    opacity: 0;
                    z-index: 10000;
                    pointer-events: none;
                    animation: swipeFeedback 1s ease forwards;
                `;
                feedback.innerHTML = '↑';
                document.body.appendChild(feedback);
                
                setTimeout(() => {
                    if (feedback.parentNode === document.body) {
                        document.body.removeChild(feedback);
                    }
                }, 1000);
                
                isSwiping = false;
            }
        }
    }, { passive: true });
    
    document.addEventListener('touchend', function() {
        isSwiping = false;
    }, { passive: true });
    
    // 2. Предотвращаем двойной тап для зума
    let lastTap = 0;
    document.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 300 && tapLength > 0) {
            e.preventDefault();
        }
        
        lastTap = currentTime;
    }, { passive: false });
    
    // 3. Включаем плавный скролл для всех контейнеров
    function enableSmoothScroll() {
        const scrollContainers = document.querySelectorAll('.text-container, .endings-grid, .modal-body, .inventory-items');
        scrollContainers.forEach(container => {
            container.style.webkitOverflowScrolling = 'touch';
            container.style.overflowY = 'auto';
        });
        
        // Разрешаем скролл для игры
        const gameContainer = document.querySelector('.game-container');
        const menuContainer = document.querySelector('.menu-container');
        
        if (gameContainer) {
            gameContainer.style.overflowY = 'auto';
            gameContainer.style.webkitOverflowScrolling = 'touch';
        }
        
        if (menuContainer) {
            menuContainer.style.overflowY = 'auto';
            menuContainer.style.webkitOverflowScrolling = 'touch';
        }
    }
    
    // Запускаем после загрузки
    setTimeout(enableSmoothScroll, 100);
    
    // 4. Обработчик для колеса мыши (для десктопа в мобильном режиме)
    document.addEventListener('wheel', function(e) {
        const continueIndicator = document.getElementById('continue-indicator');
        if (continueIndicator && continueIndicator.classList.contains('visible') && e.deltaY > 0) {
            continueIndicator.click();
        }
    });
    
    // 5. Улучшаем обработку касаний для кнопок
    document.addEventListener('touchstart', function(e) {
        const button = e.target.closest('button');
        if (button) {
            button.classList.add('active-touch');
        }
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        const button = e.target.closest('button');
        if (button) {
            setTimeout(() => {
                button.classList.remove('active-touch');
            }, 300);
        }
    }, { passive: true });
    
    // 6. Добавляем CSS для улучшения мобильного опыта
    const style = document.createElement('style');
    style.textContent = `
        @keyframes swipeFeedback {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            50% { opacity: 0.7; transform: translate(-50%, -60%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -70%) scale(0.5); }
        }
        
        /* Улучшаем кнопки на мобильных */
        .choice-btn, .control-btn, .menu-btn {
            touch-action: manipulation;
            min-height: 44px;
        }
        
        .choice-btn.active-touch, 
        .control-btn.active-touch, 
        .menu-btn.active-touch {
            transform: scale(0.95);
            transition: transform 0.1s;
        }
        
        /* Улучшаем скролл */
        .text-container {
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch !important;
        }
        
        .text-container::-webkit-scrollbar {
            display: none;
        }
        
        /* Исправляем высоту на iOS */
        @supports (-webkit-touch-callout: none) {
            .game-container, .menu-container {
                height: -webkit-fill-available;
                min-height: -webkit-fill-available;
            }
        }
        
        /* Улучшаем отзывчивость */
        * {
            -webkit-tap-highlight-color: transparent;
        }
    `;
    document.head.appendChild(style);
    
    console.log('Mobile scroll fix applied');
});