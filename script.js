// GSAP Animations and Three.js Setup
gsap.registerPlugin(ScrollTrigger);

// Loading Screen
window.addEventListener('load', () => {
    gsap.to('#loader', {
        opacity: 0,
        duration: 1,
        delay: 2,
        onComplete: () => {
            document.getElementById('loader').style.display = 'none';
            initAnimations();
        }
    });
});

// Three.js Background
let scene, camera, renderer, particles;

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('three-canvas'), 
        alpha: true,
        antialias: false, // Disable for better mobile performance
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance

    // Create particles (reduced count for better performance)
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    const particleCount = window.innerWidth > 1200 ? 3000 : 1500; // Adaptive particle count

    for (let i = 0; i < particleCount; i++) {
        vertices.push(
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000
        );
        
        colors.push(
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5,
            1
        );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: window.innerWidth > 768 ? 2 : 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 1000;

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.001;
    
    renderer.render(scene, camera);
}

// Initialize animations
function initAnimations() {
    // Hero section typing animation
    const heroText = document.querySelector('.typing');
    const text = heroText.textContent;
    heroText.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            heroText.classList.remove('typing');
        }
    };
    
    setTimeout(typeWriter, 1000);

    // Scroll-triggered animations
    gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.fromTo(element, 
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Skill bars animation
    gsap.utils.toArray('.skill-bar').forEach((bar) => {
        const width = bar.getAttribute('data-width');
        gsap.fromTo(bar,
            { width: '0%' },
            {
                width: width + '%',
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: bar,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Magnetic effect for buttons (desktop only)
    if (window.innerWidth > 768) {
        document.querySelectorAll('button, .card-hover').forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(element, {
                    x: x * 0.1,
                    y: y * 0.1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    x: 0,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    // Parallax scrolling
    gsap.utils.toArray('.floating').forEach((element, i) => {
        gsap.to(element, {
            y: -50,
            scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    // Navigation scroll effect
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: {
            className: 'scrolled',
            targets: 'nav'
        }
    });

    // Text shimmer effect for gradient text
    gsap.utils.toArray('.gradient-text').forEach(text => {
        gsap.to(text, {
            backgroundPosition: '200% center',
            duration: 3,
            ease: 'none',
            repeat: -1
        });
    });

    // Skill tags hover animation
    document.querySelectorAll('.skills span, .bg-purple-500, .bg-blue-500, .bg-green-500, .bg-orange-500').forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            gsap.to(tag, {
                scale: 1.1,
                rotation: 5,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });
        
        tag.addEventListener('mouseleave', () => {
            gsap.to(tag, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });
    });

    // Section title entrance animation
    gsap.utils.toArray('h2').forEach(title => {
        gsap.fromTo(title,
            { 
                opacity: 0,
                y: 30,
                scale: 0.8
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                ease: 'elastic.out(1, 0.5)',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Resume download with fallback
const resumeBtn = document.getElementById('resume-btn');
if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Create and trigger download
        const link = document.createElement('a');
        link.href = './resume.pdf';
        link.download = 'Sanjeevikumar_D_Resume.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Success animation
        gsap.to(e.target, {
            scale: 1.1,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
    });
}

// Cursor trail effect (desktop only)
let mouseX = 0, mouseY = 0;
let trail = [];

function createTrail() {
    if (window.innerWidth <= 768) return; // Skip on mobile
    
    trail.push({ x: mouseX, y: mouseY });
    
    if (trail.length > 20) {
        trail.shift();
    }
    
    // Remove existing trail elements
    document.querySelectorAll('.cursor-trail').forEach(el => el.remove());
    
    // Create new trail elements
    trail.forEach((point, index) => {
        const trailElement = document.createElement('div');
        trailElement.className = 'cursor-trail';
        trailElement.style.cssText = `
            position: fixed;
            width: ${20 - index}px;
            height: ${20 - index}px;
            background: radial-gradient(circle, rgba(102, 126, 234, ${0.8 - index * 0.04}) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${point.x}px;
            top: ${point.y}px;
            transform: translate(-50%, -50%);
            transition: all 0.1s ease;
        `;
        document.body.appendChild(trailElement);
    });
    
    requestAnimationFrame(createTrail);
}

// Enhanced mouse tracking with multiple effects
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Enhanced parallax effect
        const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
        
        gsap.to('.floating', {
            x: moveX,
            y: moveY,
            rotation: moveX * 0.1,
            duration: 1.5,
            ease: 'power2.out'
        });
        

    });
}

// Contact button animations
document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"], a[href*="linkedin"]').forEach(button => {
    button.addEventListener('click', () => {
        gsap.to(button, {
            scale: 1.1,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
    });
});

// Mobile Navigation
function initMobileNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mobileResumeBtn = document.getElementById('mobile-resume-btn');
    
    // Toggle mobile menu
    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenu.classList.add('active');
    });
    
    // Close mobile menu
    closeMenuBtn?.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
    
    // Close menu when clicking on nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
    
    // Mobile resume download with fallback
    mobileResumeBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Create and trigger download
        const link = document.createElement('a');
        link.href = './resume.pdf';
        link.download = 'Sanjeevikumar_D_Resume.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        mobileMenu.classList.remove('active');
        
        gsap.to(e.target, {
            scale: 1.1,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
}

// Remove Spline watermark
function removeSplineWatermark() {
    const splineViewer = document.getElementById('spline-robot');
    if (splineViewer) {
        const hideWatermark = () => {
            try {
                // Hide via CSS injection
                const style = document.createElement('style');
                style.textContent = `
                    #spline-robot * { pointer-events: none !important; }
                    #spline-robot *[style*="bottom"] { display: none !important; }
                    #spline-robot *[style*="right"] { display: none !important; }
                    #spline-robot div:last-child { display: none !important; }
                    #spline-robot::after { content: ''; position: absolute; bottom: 0; right: 0; width: 120px; height: 40px; background: black; z-index: 999; }
                `;
                document.head.appendChild(style);
                
                // Try shadow DOM access
                const shadowRoot = splineViewer.shadowRoot;
                if (shadowRoot) {
                    const elements = shadowRoot.querySelectorAll('*');
                    elements.forEach(el => {
                        const style = el.getAttribute('style') || '';
                        if (style.includes('position') && (style.includes('bottom') || style.includes('right'))) {
                            el.style.display = 'none';
                        }
                        if (el.textContent && el.textContent.toLowerCase().includes('spline')) {
                            el.style.display = 'none';
                        }
                    });
                }
                
                // Hide all positioned elements in viewer
                const allElements = splineViewer.querySelectorAll('*');
                allElements.forEach(el => {
                    const computedStyle = window.getComputedStyle(el);
                    if (computedStyle.position === 'absolute' || computedStyle.position === 'fixed') {
                        if (computedStyle.bottom !== 'auto' || computedStyle.right !== 'auto') {
                            el.style.display = 'none';
                        }
                    }
                });
            } catch (e) {}
        };
        
        // Run multiple times
        hideWatermark();
        setTimeout(hideWatermark, 1000);
        setTimeout(hideWatermark, 3000);
        setTimeout(hideWatermark, 5000);
        
        // Observe changes
        const observer = new MutationObserver(hideWatermark);
        observer.observe(splineViewer, { childList: true, subtree: true, attributes: true });
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize Three.js on larger screens for better performance
    if (window.innerWidth > 768) {
        initThreeJS();
        createTrail();
        initAdvancedEffects();
    } else {
        // Initialize a simpler background for mobile
        initMobileBackground();
    }
    
    initMobileNavigation();
    removeSplineWatermark();
    createScrollProgress();
    initHoverEffects();
    initTextRevealAnimations();
    createFloatingParticles();
    initMatrixRain();
});

// Additional hover effects
function initHoverEffects() {
    // Project card glow effect
    document.querySelectorAll('.glass').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                boxShadow: '0 0 30px rgba(102, 126, 234, 0.4)',
                duration: 0.3
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                duration: 0.3
            });
        });
    });
    
    // Social icons pulse effect
    document.querySelectorAll('a[href*="linkedin"], a[href*="github"], a[href*="leetcode"]').forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                scale: 1.2,
                rotation: 10,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });
        
        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });
    });
}

// Simple mobile background
function initMobileBackground() {
    const canvas = document.getElementById('three-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50; // Reduced for mobile performance
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1
        });
    }
    
    function animateMobileBackground() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(102, 126, 234, ${0.3 + Math.random() * 0.3})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animateMobileBackground);
    }
    
    animateMobileBackground();
}

// Handle window resize
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Reinitialize background if switching between mobile/desktop
    const canvas = document.getElementById('three-canvas');
    if (window.innerWidth <= 768 && canvas.getContext) {
        // Switch to mobile background if not already
        if (!canvas.getContext('2d')) {
            location.reload(); // Simple solution for demo
        }
    }
});

// Performance optimization
let ticking = false;

function updateAnimations() {
    // Update any continuous animations here
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

// Intersection Observer for better performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all reveal elements
document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

// Scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Add some interactive particles on click (reduced for mobile)
document.addEventListener('click', (e) => {
    createClickEffect(e.clientX, e.clientY);
});

function createClickEffect(x, y) {
    const particleCount = window.innerWidth > 768 ? 12 : 6;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#00f5ff', '#fc00ff'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, ${randomColor}, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
            box-shadow: 0 0 20px ${randomColor}, 0 0 40px ${randomColor};
        `;
        
        document.body.appendChild(particle);
        
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = (window.innerWidth > 768 ? 80 : 50) + Math.random() * 60;
        
        gsap.to(particle, {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            opacity: 0,
            scale: 0,
            rotation: 720,
            duration: 1.5,
            ease: 'power3.out',
            onComplete: () => {
                particle.remove();
            }
        });
    }
}

// Matrix rain effect
function initMatrixRain() {
    if (window.innerWidth <= 768) return;
    
    const matrixContainer = document.createElement('div');
    matrixContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    document.body.appendChild(matrixContainer);
    
    for (let i = 0; i < 15; i++) {
        const column = document.createElement('div');
        column.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: -100px;
            width: 2px;
            height: 100px;
            background: linear-gradient(transparent, #00f5ff, transparent);
            animation: matrixFall ${3 + Math.random() * 4}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        matrixContainer.appendChild(column);
    }
}

// Floating particles system
function createFloatingParticles() {
    if (window.innerWidth <= 768) return;
    
    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
    `;
    document.body.appendChild(particleContainer);
    
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const colors = ['#667eea', '#764ba2', '#f093fb', '#00f5ff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            box-shadow: 0 0 10px ${color};
            animation: floatParticle ${10 + Math.random() * 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particleContainer.appendChild(particle);
    }
}

// Advanced text reveal animations
function initTextRevealAnimations() {
    // Stagger animation for skill tags
    gsap.utils.toArray('.skills span, [class*="bg-"][class*="-500"]').forEach((tag, index) => {
        gsap.fromTo(tag,
            { opacity: 0, scale: 0, rotation: 180 },
            {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.8,
                delay: index * 0.1,
                ease: 'elastic.out(1, 0.5)',
                scrollTrigger: {
                    trigger: tag,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
    
    // Letter-by-letter animation for main title
    const mainTitle = document.querySelector('.typing');
    if (mainTitle) {
        const text = mainTitle.textContent;
        mainTitle.innerHTML = '';
        
        [...text].forEach((letter, i) => {
            const span = document.createElement('span');
            span.textContent = letter === ' ' ? '\u00A0' : letter;
            span.style.opacity = '0';
            mainTitle.appendChild(span);
            
            gsap.to(span, {
                opacity: 1,
                y: 0,
                duration: 0.1,
                delay: i * 0.05,
                ease: 'power2.out'
            });
        });
    }
}

// Advanced hover and interaction effects
function initAdvancedEffects() {
    // Holographic card effect
    document.querySelectorAll('.glass').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.background = `
                radial-gradient(circle at ${x}% ${y}%, 
                rgba(102, 126, 234, 0.3) 0%, 
                rgba(17, 25, 40, 0.75) 50%)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.background = 'rgba(17, 25, 40, 0.75)';
        });
    });
    
    // Magnetic buttons with enhanced effect
    document.querySelectorAll('button, a[class*="bg-gradient"]').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                rotationX: y * 0.1,
                rotationY: x * 0.1,
                duration: 0.3,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                rotationX: 0,
                rotationY: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
    
    // Glitch effect on hover for tech icons
    document.querySelectorAll('.floating i').forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                scaleX: 1.2,
                scaleY: 0.8,
                duration: 0.1,
                yoyo: true,
                repeat: 3,
                ease: 'power2.inOut'
            });
        });
    });
}