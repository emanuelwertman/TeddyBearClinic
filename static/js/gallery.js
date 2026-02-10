// Gallery JavaScript - Carousels and Lightbox (Performance Optimized)
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== UTILITY FUNCTIONS =====
    // Throttle function to limit how often a function runs
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Debounce function for resize events
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // ===== ELEMENTS =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentIndex = 0;
    let galleryImages = [];

    // ===== LAZY LOADING WITH INTERSECTION OBSERVER =====
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const item = entry.target;
                const img = item.querySelector('img');
                
                if (img && img.dataset.src) {
                    // Add loading class for skeleton animation
                    item.classList.add('loading');
                    
                    // Create new image to preload
                    const newImg = new Image();
                    newImg.onload = function() {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        item.classList.remove('loading');
                        item.classList.add('loaded');
                    };
                    newImg.onerror = function() {
                        item.classList.remove('loading');
                    };
                    newImg.src = img.dataset.src;
                }
                
                // Stop observing this item
                observer.unobserve(item);
            }
        });
    }, {
        root: null,
        rootMargin: '100px', // Load images 100px before they enter viewport
        threshold: 0.01
    });

    // Convert images to lazy load (move src to data-src)
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(function(item) {
        const img = item.querySelector('img');
        if (img && img.src && !img.dataset.src) {
            img.dataset.src = img.src;
            // Use a tiny placeholder or leave empty
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            img.loading = 'lazy'; // Native lazy loading as fallback
        }
        imageObserver.observe(item);
    });

    // ===== SETUP CAROUSELS =====
    const categories = document.querySelectorAll('.gallery-category');
    const carouselData = []; // Store carousel data for efficient updates
    
    categories.forEach(function(category, index) {
        const grid = category.querySelector('.gallery-grid');
        if (!grid) return;

        // Wrap grid in carousel container
        const container = document.createElement('div');
        container.className = 'carousel-container';
        grid.parentNode.insertBefore(container, grid);
        container.appendChild(grid);

        // Create navigation buttons
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-nav prev';
        prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        prevBtn.setAttribute('aria-label', 'Previous');

        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-nav next';
        nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        nextBtn.setAttribute('aria-label', 'Next');

        container.appendChild(prevBtn);
        container.appendChild(nextBtn);

        // Store carousel data
        carouselData.push({ grid, prevBtn, nextBtn });

        // Scroll amount (3 items at a time)
        const scrollAmount = 450;

        // Navigation handlers
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        // Throttled scroll handler
        const updateButtons = throttle(function() {
            const needsScroll = grid.scrollWidth > grid.clientWidth + 5;
            
            if (!needsScroll) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
                prevBtn.disabled = grid.scrollLeft <= 0;
                nextBtn.disabled = grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 5;
            }
        }, 100);

        grid.addEventListener('scroll', updateButtons, { passive: true });
        
        // Initial update after a small delay to ensure layout is complete
        requestAnimationFrame(updateButtons);
    });

    // Debounced resize handler for all carousels
    const handleResize = debounce(function() {
        carouselData.forEach(function(data) {
            const { grid, prevBtn, nextBtn } = data;
            const needsScroll = grid.scrollWidth > grid.clientWidth + 5;
            
            if (!needsScroll) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
                prevBtn.disabled = grid.scrollLeft <= 0;
                nextBtn.disabled = grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 5;
            }
        });
    }, 150);

    window.addEventListener('resize', handleResize, { passive: true });

    // ===== BUILD IMAGES ARRAY (cached) =====
    let galleryArrayBuilt = false;
    function buildGalleryArray() {
        if (galleryArrayBuilt) return;
        galleryImages = [];
        galleryItems.forEach(function(item) {
            const img = item.querySelector('img');
            const src = item.getAttribute('data-fullres') || img?.dataset.src || img?.src;
            if (src && src !== 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7') {
                galleryImages.push(src);
            }
        });
        galleryArrayBuilt = true;
    }

    // ===== LIGHTBOX =====
    function openLightbox(index) {
        buildGalleryArray();
        currentIndex = index;
        if (lightbox && lightboxImg && galleryImages[currentIndex]) {
            lightboxImg.src = galleryImages[currentIndex];
            lightbox.style.display = 'flex';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Preload adjacent images
            preloadAdjacentImages();
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.style.display = 'none';
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            // Clear the image src to free memory
            if (lightboxImg) lightboxImg.src = '';
        }
    }

    function preloadAdjacentImages() {
        // Preload next and previous images for smoother navigation
        const nextIdx = (currentIndex + 1) % galleryImages.length;
        const prevIdx = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        
        if (galleryImages[nextIdx]) {
            const nextImg = new Image();
            nextImg.src = galleryImages[nextIdx];
        }
        if (galleryImages[prevIdx]) {
            const prevImg = new Image();
            prevImg.src = galleryImages[prevIdx];
        }
    }

    function showNext() {
        if (galleryImages.length === 0) return;
        currentIndex = (currentIndex + 1) % galleryImages.length;
        if (lightboxImg) {
            lightboxImg.src = galleryImages[currentIndex];
            preloadAdjacentImages();
        }
    }

    function showPrev() {
        if (galleryImages.length === 0) return;
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        if (lightboxImg) {
            lightboxImg.src = galleryImages[currentIndex];
            preloadAdjacentImages();
        }
    }

    // ===== EVENT DELEGATION FOR GALLERY ITEMS =====
    // Use event delegation instead of individual listeners
    document.addEventListener('click', function(e) {
        const item = e.target.closest('.gallery-item');
        if (item) {
            e.preventDefault();
            const items = Array.from(galleryItems);
            const idx = items.indexOf(item);
            if (idx !== -1) openLightbox(idx);
        }
    });

    // ===== LIGHTBOX CONTROLS =====
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeLightbox();
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showNext();
        });
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showPrev();
        });
    }

    // Close on background click
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox || lightbox.style.display !== 'flex') return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    // Touch swipe for lightbox
    let touchStartX = 0;
    if (lightbox) {
        lightbox.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', function(e) {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) showNext();
                else showPrev();
            }
        }, { passive: true });
    }

    // Initialize
    buildGalleryArray();
});
