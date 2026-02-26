/**
 * Muhammad Kashan - Portfolio
 * Vanilla JavaScript: Navbar (glassmorphism, slide-down, active link),
 * Typing effect, Counters, Skill progress bars, Contact form validation,
 * AOS, smooth scroll. No theme toggle - dark theme only.
 */

(function () {
    'use strict';

    // ========== AOS (Animate On Scroll) ==========
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 700,
                easing: 'ease-out-cubic',
                once: true,
                offset: 80
            });
        }
    });

    // ========== Navbar: Slide-down on load, Glassmorphism on scroll, Active link ==========
    var navbar = document.getElementById('mainNavbar');
    var navLinks = document.querySelectorAll('.navbar .nav-link[href^="#"]');

    function addNavbarVisible() {
        if (navbar && !navbar.classList.contains('navbar-visible')) {
            navbar.classList.add('navbar-visible');
        }
    }

    if (navbar) {
        setTimeout(addNavbarVisible, 100);
    }

    function updateNavbarScroll() {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    function updateActiveLink() {
        var sections = document.querySelectorAll('section[id]');
        var current = '';
        var scrollY = window.scrollY + 120;

        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                current = id;
                break;
            }
        }

        for (var j = 0; j < navLinks.length; j++) {
            var link = navLinks[j];
            var href = link.getAttribute('href');
            if (href === '#' + current) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    }

    window.addEventListener('scroll', function () {
        updateNavbarScroll();
        updateActiveLink();
    });
    updateNavbarScroll();
    updateActiveLink();

    // Smooth scroll + close mobile menu
    for (var k = 0; k < navLinks.length; k++) {
        navLinks[k].addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                var collapse = document.querySelector('.navbar-collapse');
                if (collapse && collapse.classList.contains('show')) {
                    collapse.classList.remove('show');
                }
            }
        });
    }

    // ========== Typing Effect (Hero) ==========
    var typedNameEl = document.getElementById('typed-name');
    var typedTitleEl = document.getElementById('typed-title');
    var nameText = 'Muhammad Kashan';
    var titleText = 'Entry-Level Full Stack Web Developer';

    function typeWriter(element, text, speed, callback) {
        var i = 0;
        if (!element) return;
        element.textContent = '';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }
        type();
    }

    function startTypingSequence() {
        if (!typedNameEl) return;
        typeWriter(typedNameEl, nameText, 80, function () {
            setTimeout(function () {
                if (typedTitleEl) {
                    typedTitleEl.style.opacity = '1';
                    typeWriter(typedTitleEl, titleText, 60);
                }
            }, 400);
        });
    }

    if (typedNameEl) {
        setTimeout(startTypingSequence, 600);
    }

    // ========== Animated Counters (About Section) ==========
    function animateCounters() {
        var counters = document.querySelectorAll('.counter[data-count]');
        if (!counters.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var target = parseInt(el.getAttribute('data-count'), 10);
                var duration = 1500;
                var step = target / (duration / 16);
                var current = 0;

                function updateCounter() {
                    current += step;
                    if (current < target) {
                        el.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target;
                    }
                }
                updateCounter();
                observer.unobserve(el);
            });
        }, { threshold: 0.5 });

        for (var c = 0; c < counters.length; c++) {
            observer.observe(counters[c]);
        }
    }

    animateCounters();

    // ========== Skill Progress Bars (animate when in viewport) ==========
    function animateSkillBars() {
        var bars = document.querySelectorAll('.skill-card .progress-bar[data-width]');
        if (!bars.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var bar = entry.target;
                var width = bar.getAttribute('data-width');
                var card = bar.closest('.skill-card');
                var percentEl = card ? card.querySelector('.skill-percent') : null;
                if (bar && width) {
                    bar.style.width = width + '%';
                    if (percentEl) {
                        var num = parseInt(width, 10);
                        var step = num / 30;
                        var current = 0;
                        var interval = setInterval(function () {
                            current += step;
                            if (current >= num) {
                                current = num;
                                clearInterval(interval);
                            }
                            percentEl.textContent = Math.floor(current) + '%';
                        }, 50);
                    }
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.3 });

        for (var b = 0; b < bars.length; b++) {
            observer.observe(bars[b]);
        }
    }

    if (document.querySelector('.skill-card')) {
        setTimeout(animateSkillBars, 500);
    }

    // ========== Contact Form: Validation, Success/Error states, Smooth submit ==========
    var contactForm = document.getElementById('contactForm');
    var formStatus = document.getElementById('formStatus');
    var submitBtn = document.getElementById('submitBtn');
    var fields = {
        name: document.getElementById('contactName'),
        email: document.getElementById('contactEmail'),
        message: document.getElementById('contactMessage')
    };
    var errors = {
        name: document.getElementById('nameError'),
        email: document.getElementById('emailError'),
        message: document.getElementById('messageError')
    };

    function showFormStatus(type, message) {
        if (!formStatus) return;
        formStatus.className = 'form-status show ' + type;
        formStatus.textContent = message;
        formStatus.setAttribute('aria-live', 'polite');
    }

    function hideFormStatus() {
        if (formStatus) {
            formStatus.classList.remove('show', 'success', 'error');
            formStatus.textContent = '';
        }
    }

    function showError(fieldName, message) {
        var field = fields[fieldName];
        var errEl = errors[fieldName];
        if (field) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
        }
        if (errEl) errEl.textContent = message;
    }

    function clearError(fieldName) {
        var field = fields[fieldName];
        var errEl = errors[fieldName];
        if (field) {
            field.classList.remove('is-invalid');
        }
        if (errEl) errEl.textContent = '';
    }

    function validateName() {
        var val = (fields.name && fields.name.value) ? fields.name.value.trim() : '';
        if (val.length < 2) {
            showError('name', 'Name must be at least 2 characters.');
            return false;
        }
        clearError('name');
        if (fields.name) fields.name.classList.add('is-valid');
        return true;
    }

    function validateEmail() {
        var val = (fields.email && fields.email.value) ? fields.email.value.trim() : '';
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(val)) {
            showError('email', 'Please enter a valid email address.');
            return false;
        }
        clearError('email');
        if (fields.email) fields.email.classList.add('is-valid');
        return true;
    }

    function validateMessage() {
        var val = (fields.message && fields.message.value) ? fields.message.value.trim() : '';
        if (val.length < 10) {
            showError('message', 'Message must be at least 10 characters.');
            return false;
        }
        clearError('message');
        if (fields.message) fields.message.classList.add('is-valid');
        return true;
    }

    if (fields.name) fields.name.addEventListener('blur', validateName);
    if (fields.email) fields.email.addEventListener('blur', validateEmail);
    if (fields.message) fields.message.addEventListener('blur', validateMessage);

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            hideFormStatus();

            var valid = true;
            if (!validateName()) valid = false;
            if (!validateEmail()) valid = false;
            if (!validateMessage()) valid = false;

            if (!valid) {
                showFormStatus('error', 'Please fix the errors below.');
                return;
            }

            var btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
            var originalText = btnText ? btnText.innerHTML : 'Send Message';
            if (submitBtn) {
                submitBtn.classList.add('sending');
                if (btnText) btnText.innerHTML = 'Sending...';
            }

            setTimeout(function () {
                if (submitBtn) {
                    submitBtn.classList.remove('sending');
                    if (btnText) btnText.innerHTML = 'Sent!';
                }
                showFormStatus('success', 'Thank you! Your message has been sent successfully.');
                contactForm.reset();
                for (var key in fields) {
                    if (fields[key]) fields[key].classList.remove('is-valid', 'is-invalid');
                }
                setTimeout(function () {
                    if (btnText) btnText.innerHTML = originalText;
                }, 2500);
            }, 800);
        });
    }
})();
