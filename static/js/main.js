// Main JavaScript file

// ===== MOBILE NAVIGATION =====
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var navToggle = document.querySelector('.nav-toggle');
        var navLinks = document.querySelector('.nav-links');
        
        if (!navToggle || !navLinks) {
            console.log('Nav elements not found');
            return;
        }
        
        // Create overlay
        var overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
        
        // Toggle menu on hamburger click
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
        
        // Close on overlay click
        overlay.addEventListener('click', closeMenu);
        
        function toggleMenu() {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        }
        
        function closeMenu() {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
        
        // Handle dropdown clicks on mobile using event delegation
        navLinks.addEventListener('click', function(e) {
            // Only on mobile
            if (window.innerWidth > 768) return;
            
            // Find the clicked element or its parent anchor
            var target = e.target;
            var anchor = target.closest('.dropdown > a');
            
            if (anchor) {
                e.preventDefault();
                e.stopPropagation();
                
                var dropdown = anchor.parentElement;
                var wasOpen = dropdown.classList.contains('open');
                
                // Close all dropdowns
                var allDropdowns = navLinks.querySelectorAll('.dropdown');
                for (var i = 0; i < allDropdowns.length; i++) {
                    allDropdowns[i].classList.remove('open');
                }
                
                // Toggle the clicked one
                if (!wasOpen) {
                    dropdown.classList.add('open');
                }
            }
        });
        
        // Handle submenu link clicks - close menu and navigate
        var submenuLinks = document.querySelectorAll('.dropdown-menu a');
        for (var i = 0; i < submenuLinks.length; i++) {
            submenuLinks[i].addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    // Let the link navigate, but close menu
                    closeMenu();
                    var allDropdowns = navLinks.querySelectorAll('.dropdown');
                    for (var j = 0; j < allDropdowns.length; j++) {
                        allDropdowns[j].classList.remove('open');
                    }
                }
            });
        }
        
        // Reset on resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMenu();
                var allDropdowns = navLinks.querySelectorAll('.dropdown');
                for (var i = 0; i < allDropdowns.length; i++) {
                    allDropdowns[i].classList.remove('open');
                }
            }
        });
    });
})();