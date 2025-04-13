// Animation & Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // PART 1: HERO SLIDER ANIMATIONS
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.hero-dot');
    let currentSlide = 0;
    let slideInterval;

    // Start the slideshow
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 6000);
    }

    // Show a specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show the selected slide
        slides[index].classList.add('active');
        
        // Update dots
        if (dots.length) {
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }

    // Next slide function
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) {
            next = 0;
        }
        showSlide(next);
    }

    // Previous slide function
    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 0) {
            prev = slides.length - 1;
        }
        showSlide(prev);
    }

    // Setup slider if elements exist
    if (slides.length) {
        // Initialize with first slide active
        showSlide(0);
        
        // Add dot click handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                showSlide(index);
                startSlideshow();
            });
        });
        
        // Add swipe support for hero slider
        let touchStartX = 0;
        let touchEndX = 0;
        
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) {
            heroSlider.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            }, {passive: true});
            
            heroSlider.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleHeroSwipe();
            }, {passive: true});
            
            function handleHeroSwipe() {
                const difference = touchStartX - touchEndX;
                if (Math.abs(difference) > 50) {
                    clearInterval(slideInterval);
                    if (difference > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                    startSlideshow();
                }
            }
        }
        
        // Start the slideshow
        startSlideshow();
    }

    // PART 2: SCROLL ANIMATIONS
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
        );
    }
    
    // Function to handle scroll animations
    function handleScrollAnimations() {
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('show');
                
                // Check for stagger children
                if (element.classList.contains('stagger-children')) {
                    const children = element.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 100); // 100ms delay between each child
                    });
                }
            }
        });
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Initial check for elements in viewport
    handleScrollAnimations();

    // PART 3: CAROUSEL FUNCTIONALITY
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
        dotsContainer.innerHTML = ''; // Clear existing dots
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
        }, {passive: true});
        
        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
        
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

    // PART 4: AYURVEDIC ELEMENTS ANIMATION
    // Animate ayurvedic decorative elements
    const ayurvedicElements = document.querySelectorAll('.ayurvedic-element, .leaf-bg');
    
    function animateAyurvedicElements() {
        ayurvedicElements.forEach(element => {
            // Random translation within a small range
            const translateX = Math.random() * 20 - 10; // -10px to +10px
            const translateY = Math.random() * 20 - 10; // -10px to +10px
            const rotation = Math.random() * 10 - 5; // -5deg to +5deg
            
            element.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`;
            
            // Reset after animation completes
            setTimeout(() => {
                element.style.transition = 'transform 3s ease';
                element.style.transform = '';
                
                // Remove transition after it completes to prevent interference with the next animation
                setTimeout(() => {
                    element.style.transition = '';
                }, 3000);
            }, 3000);
        });
    }
    
    // Initial animation
    animateAyurvedicElements();
    
    // Repeat animation at intervals
    setInterval(animateAyurvedicElements, 6000);

    // PART 5: MOBILE MENU
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if(menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('show');
        });
        
        // Close mobile menu when a link is clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('show');
            });
        });
    }
    
    // PART 6: SMOOTH SCROLLING
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Get the target element
            const targetId = this.getAttribute('href');
            if(targetId === '#') return; // Skip if href is just "#"
            
            const targetElement = document.querySelector(targetId);
            if(!targetElement) return; // Skip if target element doesn't exist
            
            // Get header height for offset
            const headerHeight = document.querySelector('header').offsetHeight;
            
            // Calculate position to scroll to
            const position = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            // Scroll smoothly
            window.scrollTo({
                top: position,
                behavior: 'smooth'
            });
        });
    });

    // PART 7: LAZY LOADING
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img.lazy');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    const src = lazyImage.getAttribute('data-src');
                    
                    if(src) {
                        lazyImage.src = src;
                        lazyImage.classList.remove('lazy');
                        lazyImage.classList.add('loaded');
                        imageObserver.unobserve(lazyImage);
                    }
                }
            });
        });
        
        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.addEventListener('scroll', function() {
            const lazyImages = document.querySelectorAll('img.lazy');
            lazyImages.forEach(img => {
                if(isInViewport(img)) {
                    const src = img.getAttribute('data-src');
                    if(src) {
                        img.src = src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                    }
                }
            });
        });
    }
}); 