// Carousel Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all carousels
    initCarousel('products-carousel', 'products-prev', 'products-next', 'products-dots');
    initCarousel('principles-carousel', 'principles-prev', 'principles-next', 'principles-dots');
    initCarousel('plants-carousel', 'plants-prev', 'plants-next', 'plants-dots');
    initCarousel('testimonials-carousel', 'testimonials-prev', 'testimonials-next', 'testimonials-dots');
    
    function initCarousel(trackClass, prevBtnClass, nextBtnClass, dotsClass) {
        const track = document.querySelector(`.${trackClass}`);
        if (!track) return;
        
        const slides = Array.from(track.children);
        const prevButton = document.querySelector(`.${prevBtnClass}`);
        const nextButton = document.querySelector(`.${nextBtnClass}`);
        const dotsContainer = document.querySelector(`.${dotsClass}`);
        
        if (!slides.length || !prevButton || !nextButton || !dotsContainer) return;
        
        let slideWidth;
        let slidesPerView = 1;
        let currentIndex = 0;
        
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });
        
        const dots = Array.from(dotsContainer.children);
        
        // Set initial position and slidesPerView based on screen size
        function setupCarousel() {
            // Calculate slidesPerView based on screen width
            if (window.innerWidth >= 1024) {
                slidesPerView = 4;
            } else if (window.innerWidth >= 768) {
                slidesPerView = 3;
            } else if (window.innerWidth >= 640) {
                slidesPerView = 2;
            } else {
                slidesPerView = 1;
            }
            
            // Calculate slide width
            slideWidth = track.parentElement.offsetWidth / slidesPerView;
            
            // Set slide widths
            slides.forEach(slide => {
                slide.style.minWidth = `${slideWidth}px`;
            });
            
            // Reset position
            goToSlide(currentIndex);
        }
        
        function goToSlide(index) {
            // Ensure index is within bounds
            if (index < 0) {
                index = 0;
            } else if (index > slides.length - slidesPerView) {
                index = slides.length - slidesPerView;
            }
            
            currentIndex = index;
            
            // Move track
            track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
            
            // Disable/enable buttons
            prevButton.disabled = index === 0;
            nextButton.disabled = index >= slides.length - slidesPerView;
            
            // Visual indication of disabled buttons
            prevButton.style.opacity = index === 0 ? 0.5 : 1;
            nextButton.style.opacity = index >= slides.length - slidesPerView ? 0.5 : 1;
        }
        
        // Event listeners
        prevButton.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
        
        nextButton.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
        
        // Handle window resize
        window.addEventListener('resize', setupCarousel);
        
        // Initial setup
        setupCarousel();
        
        // Add touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const difference = touchStartX - touchEndX;
            // Threshold for swipe detection - 50px
            if (Math.abs(difference) > 50) {
                if (difference > 0) {
                    // Swipe left - go to next slide
                    goToSlide(currentIndex + 1);
                } else {
                    // Swipe right - go to previous slide
                    goToSlide(currentIndex - 1);
                }
            }
        }
    }
}); 