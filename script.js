// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking
            const navMenu = document.getElementById('navMenu');
            const hamburger = document.getElementById('hamburger');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Add active state to navigation on scroll
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Enhanced fade in animation on scroll
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    // Check if section is already in viewport
    const rect = section.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInViewport) {
        // If already visible, make it visible immediately
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    } else {
        // Otherwise, set initial hidden state
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    }
    
    observer.observe(section);
});

// Animate elements within sections
const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 150);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.experience-content-box > *, .about-profile > *, .contact-form').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    elementObserver.observe(el);
});

// Parallax effect for hero background
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const heroBackground = document.querySelector('.hero-background');
    const navbar = document.querySelector('.navbar');
    
    if (heroBackground && scrollTop < window.innerHeight) {
        const parallaxSpeed = 0.5;
        heroBackground.style.transform = `translateY(${scrollTop * parallaxSpeed}px) scale(1.1)`;
    }
    
    // Navbar background opacity on scroll
    if (navbar) {
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.3)';
        }
    }
    
    lastScrollTop = scrollTop;
});


// Add mouse move parallax effect to hero content
document.addEventListener('mousemove', (e) => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && window.pageYOffset < window.innerHeight) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        heroContent.style.transform = `translate(${x}px, ${y}px)`;
    }
});

// Background music autoplay with user interaction
const bgMusic = document.getElementById('bgMusic');
const audioToggle = document.getElementById('audioToggle');
const audioIcon = document.getElementById('audioIcon');

// Muted icon SVG path
const mutedIconPath = 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z';
const unmutedIconPath = 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z';

let isMuted = true;

// Toggle audio on button click
audioToggle.addEventListener('click', () => {
    if (isMuted) {
        bgMusic.play();
        audioIcon.setAttribute('d', unmutedIconPath);
        audioToggle.classList.remove('muted');
        isMuted = false;
    } else {
        bgMusic.pause();
        audioIcon.setAttribute('d', mutedIconPath);
        audioToggle.classList.add('muted');
        isMuted = true;
    }
});

// Initialize as muted
audioIcon.setAttribute('d', mutedIconPath);
audioToggle.classList.add('muted');

// Try to play on load
document.addEventListener('DOMContentLoaded', () => {
    bgMusic.play().then(() => {
        // If autoplay succeeds, update button state
        audioIcon.setAttribute('d', unmutedIconPath);
        audioToggle.classList.remove('muted');
        isMuted = false;
    }).catch(() => {
        // Autoplay blocked - stay muted, user needs to click button
        console.log('Autoplay blocked. Click the audio button to play music.');
    });
});

// Contact form handling with EmailJS
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    // Initialize EmailJS with your public key
    // IMPORTANT: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    emailjs.init('pK2J1HbtlatWBPJgf');
    
    // Function to validate date format (DD/MM/YYYY) and check if it's not in the past
    function validateProjectDate(dateString) {
        if (!dateString) {
            return { valid: true }; // Optional field, so empty is valid
        }
        
        // Check format DD/MM/YYYY
        const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = dateString.match(datePattern);
        
        if (!match) {
            return { 
                valid: false, 
                message: 'Please enter date in DD/MM/YYYY format' 
            };
        }
        
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);
        
        // Validate date components
        if (month < 1 || month > 12) {
            return { 
                valid: false, 
                message: 'Invalid month. Please enter a valid date.' 
            };
        }
        
        if (day < 1 || day > 31) {
            return { 
                valid: false, 
                message: 'Invalid day. Please enter a valid date.' 
            };
        }
        
        // Create date object (month is 0-indexed in JavaScript)
        const projectDate = new Date(year, month - 1, day);
        
        // Check if date is valid (e.g., not 31/02/2024)
        if (projectDate.getDate() !== day || 
            projectDate.getMonth() !== month - 1 || 
            projectDate.getFullYear() !== year) {
            return { 
                valid: false, 
                message: 'Invalid date. Please enter a valid date.' 
            };
        }
        
        // Check if date is not in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        projectDate.setHours(0, 0, 0, 0);
        
        if (projectDate < today) {
            return { 
                valid: false, 
                message: 'Project date cannot be in the past. Please select today or a future date.' 
            };
        }
        
        return { valid: true };
    }
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate project date
        const projectDateInput = document.getElementById('project_date');
        const dateValidation = validateProjectDate(projectDateInput.value);
        
        if (!dateValidation.valid) {
            alert(dateValidation.message);
            projectDateInput.focus();
            return;
        }
        
        // Disable submit button to prevent multiple submissions
        const submitBtn = contactForm.querySelector('.form-submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'SENDING...';
        submitBtn.disabled = true;
        
        // Prepare template parameters
        const templateParams = {
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            project_date: document.getElementById('project_date').value || 'Not provided',
            location: document.getElementById('location').value || 'Not provided',
            event_type: document.getElementById('event_type').value,
            budget: document.getElementById('budget').value,
            referral: document.getElementById('referral').value || 'Not provided',
            message: document.getElementById('message').value || 'Not provided',
            to_email: 'hello.victoryvows@gmail.com'
        };
        
        // Send email using EmailJS
        // IMPORTANT: Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs
        emailjs.send('service_victoryvows', 'template_victoryvows_web', templateParams)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                alert('Thank you for your inquiry! We will get back to you soon.');
                contactForm.reset();
            })
            .catch((error) => {
                console.error('FAILED...', error);
                alert('Sorry, there was an error sending your message. Please try again or email us directly at hello.victoryvows@gmail.com');
            })
            .finally(() => {
                // Re-enable submit button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
}

