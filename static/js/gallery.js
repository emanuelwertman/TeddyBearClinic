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

    // Collect all images from the current visible year section
    function collectImages() {
        images = [];
        const activeYear = document.querySelector('.year-tab.active')?.dataset.year || '2025';
        const activeSection = document.querySelector(`.gallery-year-section[data-year="${activeYear}"]`);
        
        if (activeSection) {
            activeSection.querySelectorAll('.gallery-item img').forEach(img => {
                images.push(img.src);
            });
        }
    }

    // Open lightbox
    function openLightbox(index) {
        collectImages();
        currentImageIndex = index;
        lightboxImg.src = images[currentImageIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Navigate to previous image
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentImageIndex];
    }

    // Navigate to next image
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImg.src = images[currentImageIndex];
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
