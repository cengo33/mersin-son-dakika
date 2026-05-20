/* ========================================
   MERSİN HABER - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

    // === TARİH & SAAT ===
    function updateDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateEl = document.getElementById('currentDate');
        if (dateEl) {
            dateEl.textContent = now.toLocaleDateString('tr-TR', options);
        }
    }
    updateDate();

    // Kur saati
    const kurTimeEl = document.getElementById('kurTime');
    if (kurTimeEl) {
        const now = new Date();
        kurTimeEl.textContent = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    }

    // Footer yılı
    const footerYearEl = document.getElementById('footerYear');
    if (footerYearEl) {
        footerYearEl.textContent = new Date().getFullYear();
    }

    // === TICKER DUPLIKASYON ===
    const ticker = document.getElementById('sdTicker');
    if (ticker) {
        // İçeriği çiftleştir (sonsuz akış için)
        ticker.innerHTML += ticker.innerHTML;
    }

    // === CAROUSEL ===
    const track = document.getElementById('carouselTrack');
    const slides = track ? track.querySelectorAll('.carousel-slide') : [];
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');

    let currentSlide = 0;
    let autoSlide;
    const totalSlides = slides.length;

    function goToSlide(n) {
        currentSlide = (n + totalSlides) % totalSlides;
        if (track) {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startAutoSlide() {
        autoSlide = setInterval(nextSlide, 5500);
    }

    function stopAutoSlide() {
        clearInterval(autoSlide);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoSlide(); nextSlide(); startAutoSlide(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoSlide(); prevSlide(); startAutoSlide(); });

    indicators.forEach((ind, i) => {
        ind.addEventListener('click', () => { stopAutoSlide(); goToSlide(i); startAutoSlide(); });
    });

    // Touch/Swipe support
    let touchStartX = 0;
    const carouselEl = document.getElementById('carousel');
    if (carouselEl) {
        carouselEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        carouselEl.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                stopAutoSlide();
                diff > 0 ? nextSlide() : prevSlide();
                startAutoSlide();
            }
        }, { passive: true });
    }

    startAutoSlide();

    // === HAMBURGERii MENU ===
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen.toString());
            hamburger.querySelectorAll('span').forEach((s, i) => {
                if (isOpen) {
                    if (i === 0) s.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (i === 1) s.style.opacity = '0';
                    if (i === 2) s.style.transform = 'rotate(-45deg) translate(5px, -5px)';
                } else {
                    s.style.transform = '';
                    s.style.opacity = '';
                }
            });
        });

        // Dışarı tıklanınca kapat
        document.addEventListener('click', e => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.querySelectorAll('span').forEach(s => {
                    s.style.transform = '';
                    s.style.opacity = '';
                });
            }
        });
    }

    // === BACK TO TOP ===
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // === SCROLL EFFECT: STICKY HEADER SHADOW ===
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (header) {
            header.style.boxShadow = window.scrollY > 60
                ? '0 4px 24px rgba(0,0,0,0.12)'
                : 'none';
        }
    }, { passive: true });

    // === SEARCH BOX ===
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const q = searchInput.value.trim();
            if (q) {
                alert('Arama: "' + q + '"\n\n(Bu bir demo sitedir, gerçek arama yapılmamaktadır.)');
            }
        });

        searchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') searchBtn.click();
        });
    }

    // === ACTIVE NAV ITEM (demo) ===
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            document.querySelectorAll('.nav-item').forEach(li => li.classList.remove('active'));
            this.closest('.nav-item').classList.add('active');
        });
    });

    // === KUR CANLANMA ANİMASYONU ===
    function animateKur() {
        const kurVals = document.querySelectorAll('.kur-val');
        kurVals.forEach(el => {
            el.style.transition = 'color 0.4s';
            el.style.color = '#2e7d32';
            setTimeout(() => { el.style.color = ''; }, 800);
        });
    }
    setTimeout(animateKur, 2000);

    // === INTERSECTION OBSERVER: Fade-in cards on scroll ===
    const fadeEls = document.querySelectorAll('.news-card, .news-list-item, .sidebar-widget, .popular-item');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        fadeEls.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(18px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }

    // === SON DAKİKA pause on hover ===
    const sdTicker = document.querySelector('.sd-ticker');
    const sdWrap = document.querySelector('.sd-ticker-wrap');
    if (sdTicker && sdWrap) {
        sdWrap.addEventListener('mouseenter', () => {
            sdTicker.style.animationPlayState = 'paused';
        });
        sdWrap.addEventListener('mouseleave', () => {
            sdTicker.style.animationPlayState = 'running';
        });
    }

    // === SIMÜLE: Kur değerleri rastgele dalgalanma (demo) ===
    function simulateKurUpdate() {
        const kurItems = [
            { id: 'kur-dolar', base: 38.42 },
            { id: 'kur-euro',  base: 41.87 },
            { id: 'kur-gbp',   base: 48.65 },
        ];

        kurItems.forEach(item => {
            const el = document.getElementById(item.id);
            if (!el) return;
            const valEl = el.querySelector('.kur-val');
            const changeEl = el.querySelector('.kur-change');
            if (!valEl || !changeEl) return;

            const delta = (Math.random() * 0.04 - 0.02);
            const newVal = (item.base + delta).toFixed(2);
            const pct = ((delta / item.base) * 100).toFixed(2);
            const isUp = delta >= 0;

            valEl.textContent = newVal;
            changeEl.innerHTML = `<i class="fa-solid fa-caret-${isUp ? 'up' : 'down'}"></i> ${isUp ? '+' : ''}${pct}%`;
            changeEl.className = `kur-change ${isUp ? 'up' : 'down'}`;

            item.base = parseFloat(newVal);
        });

        const kurTimeEl = document.getElementById('kurTime');
        if (kurTimeEl) {
            const now = new Date();
            kurTimeEl.textContent = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        }
    }

    setInterval(simulateKurUpdate, 8000);

});
