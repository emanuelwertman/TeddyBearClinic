// Gallery Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get all gallery items and lightbox elements
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const yearTabs = document.querySelectorAll('.year-tab');
    const yearSections = document.querySelectorAll('.gallery-year-section');

    let currentImageIndex = 0;
    let images = [];

    // ============================================
    // PERFORMANCE OPTIMIZATION: Progressive Image Loading
    // ============================================
    
    // Create Intersection Observer for lazy loading with early trigger
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const img = item.querySelector('img');
                
                if (img && img.dataset.src) {
                    // Start loading the image
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    
                    // Add loaded class when image is ready
                    img.onload = () => {
                        item.classList.add('loaded');
                        item.classList.remove('loading');
                    };
                    
                    img.onerror = () => {
                        item.classList.add('error');
                        item.classList.remove('loading');
                    };
                }
                
                // Stop observing this item
                observer.unobserve(item);
            }
        });
    }, {
        rootMargin: '200px 0px', // Start loading 200px before entering viewport
        threshold: 0.01
    });

    // Initialize lazy loading for all gallery items
    function initLazyLoading() {
        galleryItems.forEach(item => {
            const img = item.querySelector('img');
            if (img) {
                // Move src to data-src for lazy loading
                const currentSrc = img.getAttribute('src');
                if (currentSrc && !img.dataset.src) {
                    img.dataset.src = currentSrc;
                    // Use a tiny transparent placeholder
                    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"%3E%3C/svg%3E';
                    item.classList.add('loading');
                }
                
                // Observe this item
                imageObserver.observe(item);
            }
        });
    }

    // Initialize lazy loading
    initLazyLoading();

    // Collect all full resolution images from the current visible year section
    function collectImages() {
        images = [];
        const activeYear = document.querySelector('.year-tab.active')?.dataset.year || '2025';
        const activeSection = document.querySelector(`.gallery-year-section[data-year="${activeYear}"]`);
        
        if (activeSection) {
            activeSection.querySelectorAll('.gallery-item').forEach(item => {
                // Use data-fullres attribute for full resolution, fallback to img src or data-src
                const img = item.querySelector('img');
                const fullResUrl = item.dataset.fullres || img?.dataset.src || img?.src;
                if (fullResUrl && !fullResUrl.startsWith('data:')) {
                    images.push(fullResUrl);
                }
            });
        }
    }

    // Open lightbox with full resolution image
    function openLightbox(index) {
        collectImages();
        currentImageIndex = index;
        
        // Show loading state
        lightboxImg.style.opacity = '0.5';
        
        // Create new image to preload full resolution
        const fullResImage = new Image();
        fullResImage.onload = function() {
            lightboxImg.src = images[currentImageIndex];
            lightboxImg.style.opacity = '1';
        };
        fullResImage.onerror = function() {
            // Fallback to direct load if preload fails
            lightboxImg.src = images[currentImageIndex];
            lightboxImg.style.opacity = '1';
        };
        fullResImage.src = images[currentImageIndex];
        
        // Set src immediately for faster perceived load
        lightboxImg.src = images[currentImageIndex];
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Load full resolution image with loading state
    function loadFullResImage(index) {
        // Show loading state
        lightboxImg.style.opacity = '0.5';
        
        const fullResImage = new Image();
        fullResImage.onload = function() {
            lightboxImg.src = images[index];
            lightboxImg.style.opacity = '1';
        };
        fullResImage.onerror = function() {
            lightboxImg.src = images[index];
            lightboxImg.style.opacity = '1';
        };
        fullResImage.src = images[index];
    }

    // Navigate to previous image
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        loadFullResImage(currentImageIndex);
    }

    // Navigate to next image
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        loadFullResImage(currentImageIndex);
    }

    // Add click event to all gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Find the index within the current visible section
            const activeYear = document.querySelector('.year-tab.active')?.dataset.year || '2025';
            const activeSection = document.querySelector(`.gallery-year-section[data-year="${activeYear}"]`);
            
            if (activeSection) {
                const sectionItems = activeSection.querySelectorAll('.gallery-item');
                const itemIndex = Array.from(sectionItems).indexOf(item);
                if (itemIndex !== -1) {
                    openLightbox(itemIndex);
                }
            }
        });
    });

    // Close button click
    lightboxClose?.addEventListener('click', closeLightbox);

    // Previous button click
    lightboxPrev?.addEventListener('click', prevImage);

    // Next button click
    lightboxNext?.addEventListener('click', nextImage);

    // Close on background click
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox?.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });

    // Year tab switching
    yearTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const year = tab.dataset.year;
            
            // Update active tab
            yearTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show/hide year sections
            yearSections.forEach(section => {
                if (section.dataset.year === year) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });

    // Touch swipe support for lightbox
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox?.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox?.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
    }
});
