document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle Code (Keep as is) ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const sunIcon = themeToggle.querySelector('.icon-sun');
    const moonIcon = themeToggle.querySelector('.icon-moon');

    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            if (moonIcon) moonIcon.style.display = 'none';
            if (sunIcon) sunIcon.style.display = 'inline-block';
            if (themeToggle) themeToggle.setAttribute('aria-label', 'Toggle Light Mode');
        } else {
            if (moonIcon) moonIcon.style.display = 'inline-block';
            if (sunIcon) sunIcon.style.display = 'none';
            if (themeToggle) themeToggle.setAttribute('aria-label', 'Toggle Dark Mode');
        }
    };

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            currentTheme = e.matches ? 'dark' : 'light';
            applyTheme(currentTheme);
        }
    });

    // --- Smooth Scroll Code (Keep as is) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                 e.preventDefault();
                 const targetElement = document.querySelector(href);
                 if (targetElement) {
                    const headerOffset = document.querySelector('header')?.offsetHeight || 80; // Adjust for sticky header height
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // Extra offset

                    window.scrollTo({
                         top: offsetPosition,
                         behavior: 'smooth'
                     });
                 }
            }
        });
    });


    // --- Intersection Observer for Scroll Animations (Enhanced for Staggering) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger index for CSS delay calculation
                entry.target.style.setProperty('--stagger-index', index);
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe individual elements needing animation
    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });

    // Observe containers for staggering children (if needed, though CSS handles it now)
    // document.querySelectorAll('.stagger-children, .stagger-children-grid').forEach(container => {
    //     const children = container.querySelectorAll('.scroll-animate');
    //     children.forEach((child, index) => {
    //         child.style.setProperty('--stagger-index', index); // Set index for CSS
    //         observer.observe(child);
    //     });
    // });


    // --- Subtle Parallax Effect ---
    const parallaxElements = document.querySelectorAll('.parallax-element');
    const handleScrollParallax = () => {
        const scrollY = window.pageYOffset;
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.speed) || 0.1;
            // Calculate transform based on element's position relative to viewport center for more centered effect
             const rect = el.getBoundingClientRect();
             const elementCenterY = rect.top + rect.height / 2;
             const viewportCenterY = window.innerHeight / 2;
             const diffY = elementCenterY - viewportCenterY;
             const ty = diffY * speed * -0.1; // Adjust multiplier for desired effect strength

            el.style.transform = `translateY(${ty}px)`;
        });
    };
    window.addEventListener('scroll', handleScrollParallax, { passive: true });
    handleScrollParallax(); // Initial position


    // --- 3D Card Tilt Effect ---
    const tiltCards = document.querySelectorAll('.card-hover-effect');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2; // x position within the element.
            const y = e.clientY - rect.top - rect.height / 2; // y position within the element.

            const rotateX = (y / rect.height) * -10; // Max rotation 10deg
            const rotateY = (x / rect.width) * 10;  // Max rotation 10deg

            card.style.setProperty('--rotateX', `${rotateX}deg`);
            card.style.setProperty('--rotateY', `${rotateY}deg`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rotateX', '0deg');
            card.style.setProperty('--rotateY', '0deg');
             // Reset transform smoothly via CSS transition
        });
    });

     // --- NEW: Make Project Cards Clickable ---
     const projectCards = document.querySelectorAll('.project-card');

     projectCards.forEach(card => {
         card.addEventListener('click', (event) => {
             // Prevent triggering if the original 'Know More' link itself was clicked
             // (although we made it non-interactive with pointer-events: none)
             // This check is belt-and-suspenders
             if (event.target.closest('.know-more')) {
                 // If somehow the inner link was clicked, do nothing here
                 return;
             }
 
             const url = card.dataset.url; // Get URL from data-url attribute
             if (url) {
                 // Open the URL in a new tab
                 window.open(url, '_blank', 'noopener noreferrer');
             } else {
                 console.warn('Project card clicked, but no data-url found:', card);
             }
         });
 
         // Optional: Add keyboard accessibility
         card.setAttribute('role', 'link'); // Indicate it acts like a link
         card.setAttribute('tabindex', '0'); // Make it focusable
         card.addEventListener('keydown', (event) => {
              if (event.key === 'Enter' || event.key === ' ') { // Handle Enter or Spacebar
                  event.preventDefault(); // Prevent default spacebar scroll
                  const url = card.dataset.url;
                  if (url) {
                      window.open(url, '_blank', 'noopener noreferrer');
                  }
              }
          });
     });
    

    // --- Button Ripple Effect (Optional) ---
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('span');
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;

            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${e.clientX - rect.left - radius}px`;
            ripple.style.top = `${e.clientY - rect.top - radius}px`;
            ripple.classList.add('ripple');

            // Check if a ripple exists already and remove it
            const existingRipple = button.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }

            button.appendChild(ripple);

            // Clean up ripple element after animation finishes
            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });


}); // End DOMContentLoaded