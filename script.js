document.addEventListener('DOMContentLoaded', () => {
    
    // --- Core View Layout Switcher Targets ---
    const viewLanding = document.getElementById('viewLanding');
    const viewGalleryArchive = document.getElementById('viewGalleryArchive');
    const lightboxModal = document.getElementById('lightboxModal');
    
    // --- Top Navigation Links ---
    const navHome = document.getElementById('navHome');
    const navWorks = document.getElementById('navWorks');
    
    // --- Chevron Hero Down-Scroll Anchors ---
    const btnScrollToGrid = document.getElementById('btnScrollToGrid');
    const landingCategoryGrid = document.getElementById('landingCategoryGrid');
    
    // --- Pop-up Lightbox Frame Elements ---
    const lightboxMainImg = document.getElementById('lightboxMainImg');
    const lbTitle = document.getElementById('lbTitle');
    const lbDesc = document.getElementById('lbDesc');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    const btnCloseLightbox = document.getElementById('btnCloseLightbox');
    const btnZoomHD = document.getElementById('btnZoomHD');
    const btnDownloadAsset = document.getElementById('btnDownloadAsset');

    // --- Side Social Slide Menu Selectors ---
    const btnToggleSocials = document.getElementById('btnToggleSocials');
    const socialDropdownPanel = document.getElementById('socialDropdownPanel');

    // --- Theme Toggle Selectors ---
    const btnToggleTheme = document.getElementById('btnToggleTheme');
    const themeIconMoon = document.querySelector('.icon-moon');
    const themeIconsSun = document.querySelectorAll('.icon-sun');

    // --- EN / JP Language Click Handles ---
    const btnLangEN = document.getElementById('btnLangEN');
    const btnLangJP = document.getElementById('btnLangJP');

    // --- Core Component Gallery State Trackers ---
    let currentGallerySet = [];
    let currentPointerIndex = 0;
    let currentLanguageCode = 'en';

    // --- Theme State Initialization ---
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
    }

    function setTheme(theme) {
        const html = document.documentElement;
        if (theme === 'light') {
            html.classList.add('light-mode');
            if (themeIconMoon) themeIconMoon.style.display = 'none';
            themeIconsSun.forEach(icon => icon.style.display = 'block');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.remove('light-mode');
            if (themeIconMoon) themeIconMoon.style.display = 'block';
            themeIconsSun.forEach(icon => icon.style.display = 'none');
            localStorage.setItem('theme', 'dark');
        }
    }

    function toggleTheme() {
        const html = document.documentElement;
        const isLightMode = html.classList.contains('light-mode');
        setTheme(isLightMode ? 'dark' : 'light');
    }

    if (btnToggleTheme) {
        btnToggleTheme.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTheme();
        });
    }

    // Initialize theme on page load
    initTheme();

    // --- View Route Router Switcher ---
    function navigateToView(targetView, fallbackActiveLink) {
        if (!targetView) return;
        
        if (viewLanding) viewLanding.classList.remove('active-view');
        if (viewGalleryArchive) viewGalleryArchive.classList.remove('active-view');
        
        if (navHome) navHome.classList.remove('active');
        if (navWorks) navWorks.classList.remove('active');

        targetView.classList.add('active-view');
        if (fallbackActiveLink) fallbackActiveLink.classList.add('active');
        
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // --- Core Multi-Language Toggler System ---
    function updateSiteLanguage(languageCode) {
        currentLanguageCode = languageCode;
        const localizedElements = document.querySelectorAll('[data-en][data-jp]');
        
        localizedElements.forEach(element => {
            const translatedStringValue = element.getAttribute(`data-${languageCode}`);
            if (translatedStringValue) {
                // Safeguard any nested span elements inside buttons
                const templateSpan = element.querySelector('span');
                if (templateSpan) {
                    element.innerHTML = translatedStringValue;
                } else {
                    element.textContent = translatedStringValue;
                }
            }
        });
        
        if (languageCode === 'jp') {
            if (btnLangJP) btnLangJP.classList.add('active-lang');
            if (btnLangEN) btnLangEN.classList.remove('active-lang');
            document.documentElement.setAttribute('lang', 'ja');
        } else {
            if (btnLangEN) btnLangEN.classList.add('active-lang');
            if (btnLangJP) btnLangJP.classList.remove('active-lang');
            document.documentElement.setAttribute('lang', 'en');
        }
    }

    if (btnLangEN && btnLangJP) {
        btnLangEN.addEventListener('click', (e) => { e.preventDefault(); updateSiteLanguage('en'); });
        btnLangJP.addEventListener('click', (e) => { e.preventDefault(); updateSiteLanguage('jp'); });
    }

    // --- Sliding Hamburger Social Drawer Setup ---
    if (btnToggleSocials && socialDropdownPanel) {
        btnToggleSocials.addEventListener('click', (e) => {
            e.stopPropagation();
            const isMenuExpanded = socialDropdownPanel.getAttribute('aria-hidden') === 'false';
            
            socialDropdownPanel.setAttribute('aria-hidden', isMenuExpanded ? 'true' : 'false');
            btnToggleSocials.classList.toggle('active-toggle');
        });

        window.addEventListener('click', () => {
            socialDropdownPanel.setAttribute('aria-hidden', 'true');
            btnToggleSocials.classList.remove('active-toggle');
        });
    }

    // --- Header Link Clicks Configuration ---
    if (navHome) {
        navHome.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToView(viewLanding, navHome);
        });
    }

    if (navWorks) {
        navWorks.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.thumb-item').forEach(item => {
                item.classList.remove('filtered-out');
            });
            navigateToView(viewGalleryArchive, navWorks);
        });
    }

    // --- Chevron Hero Scroll Down Click Trigger ---
    if (btnScrollToGrid && landingCategoryGrid) {
        btnScrollToGrid.addEventListener('click', (e) => {
            e.preventDefault();
            landingCategoryGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // --- Front Page Category Card Clicks ---
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.sub-style-btn')) return;

            const categoryType = card.getAttribute('data-category');
            
            if (categoryType === '2d') {
                document.querySelectorAll('.thumb-item').forEach(item => {
                    const itemStyle = item.getAttribute('data-style');
                    if (itemStyle === 'anime') {
                        item.classList.remove('filtered-out');
                    } else {
                        item.classList.add('filtered-out');
                    }
                });
            } else {
                document.querySelectorAll('.thumb-item').forEach(item => {
                    item.classList.remove('filtered-out');
                });
            }
            navigateToView(viewGalleryArchive, navWorks);
        });
    });

    // --- Sub-Style Segment Filtering Buttons Loop ---
    document.querySelectorAll('.sub-style-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const chosenStyle = btn.getAttribute('data-filter-style');

            document.querySelectorAll('.thumb-item').forEach(item => {
                const itemStyle = item.getAttribute('data-style');
                if (itemStyle === chosenStyle) {
                    item.classList.remove('filtered-out');
                } else {
                    item.classList.add('filtered-out');
                }
            });
            navigateToView(viewGalleryArchive, navWorks);
        });
    });

    // --- Lightbox Sequence Event Loops ---
    const allThumbnails = Array.from(document.querySelectorAll('.thumb-item'));

    allThumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', () => {
            currentGallerySet = allThumbnails.filter(item => !item.classList.contains('filtered-out'));
            currentPointerIndex = currentGallerySet.indexOf(thumbnail);
            renderActiveLightboxNode(thumbnail);
            
            // Show mobile navigation arrows
            updateMobileArrows();
        });
    });

    function renderActiveLightboxNode(elementNode) {
        if (!elementNode || !lightboxMainImg || !lbTitle || !lbDesc || !lightboxModal) return;
        
        const fullResolutionSource = elementNode.getAttribute('data-full');
        const metaTitle = elementNode.getAttribute('data-title') || "";
        const metaDesc = elementNode.getAttribute('data-desc') || "";

        lightboxMainImg.src = fullResolutionSource;
        
        const textPrefix = currentLanguageCode === 'jp' ? "作品解説: " : "Artwork Info: ";
        lbTitle.textContent = textPrefix + metaTitle;
        lbDesc.textContent = metaDesc;

        lightboxModal.setAttribute('aria-hidden', 'false');
    }

    function switchSlidePosition(directionMultiplier) {
        if (currentGallerySet.length === 0) return;
        currentPointerIndex = (currentPointerIndex + directionMultiplier + currentGallerySet.length) % currentGallerySet.length;
        renderActiveLightboxNode(currentGallerySet[currentPointerIndex]);
    }

    function updateMobileArrows() {
        const isMobile = window.innerWidth <= 768;
        if (lbPrev && lbNext) {
            if (isMobile) {
                lbPrev.classList.add('mobile-visible');
                lbNext.classList.add('mobile-visible');
            } else {
                lbPrev.classList.remove('mobile-visible');
                lbNext.classList.remove('mobile-visible');
            }
        }
    }

    if (lbNext) lbNext.addEventListener('click', () => switchSlidePosition(1));  
    if (lbPrev) lbPrev.addEventListener('click', () => switchSlidePosition(-1)); 

    if (btnCloseLightbox && lightboxModal && lightboxMainImg) {
        btnCloseLightbox.addEventListener('click', () => {
            lightboxModal.setAttribute('aria-hidden', 'true');
            lightboxMainImg.src = ""; 
        });
    }

    // --- Dynamic Canvas Downloader Trigger ---
    if (btnDownloadAsset) {
        btnDownloadAsset.addEventListener('click', () => {
            if (!lightboxMainImg) return;
            const fileURL = lightboxMainImg.src;
            if (!fileURL) return;

            const shadowAnchor = document.createElement('a');
            shadowAnchor.href = fileURL;
            shadowAnchor.download = `Opal_Artwork_${Date.now()}.jpg`;
            document.body.appendChild(shadowAnchor);
            shadowAnchor.click();
            document.body.removeChild(shadowAnchor);
        });
    }

    // --- Ultra-Compact Independent Inspector Pop-out Portal ---
    if (btnZoomHD) {
        btnZoomHD.addEventListener('click', () => {
            if (!lightboxMainImg || !lightboxMainImg.src) return;
            const url = lightboxMainImg.src;
            const w = window.open('', '_blank');
            if (!w) return;
            w.document.write(`<!DOCTYPE html><html><head><title>Opal乳白色 | Canvas Inspector</title><style>body{margin:0;background:#000;overflow:hidden;display:flex;justify-content:center;align-items:center;height:100vh}img{max-width:100%;max-height:100%;object-fit:contain}<\/style><\/head><body><img src="${url}" alt="Full Resolution Canvas"><\/body><\/html>`);
            w.document.close();
        });
    }

    // --- Desktop Keyboard Handlers ---
    document.addEventListener('keydown', (e) => {
        if (lightboxModal && lightboxModal.getAttribute('aria-hidden') === 'false') {
            if (e.key === 'ArrowRight') switchSlidePosition(1);
            if (e.key === 'ArrowLeft') switchSlidePosition(-1);
            if (e.key === 'Escape' && lightboxMainImg) {
                lightboxModal.setAttribute('aria-hidden', 'true');
                lightboxMainImg.src = "";
            }
        }
    });

    // --- Mobile Touch Swipe Support for Lightbox ---
    let touchStartX = 0;
    let touchEndX = 0;

    function handleSwipe() {
        if (lightboxModal && lightboxModal.getAttribute('aria-hidden') === 'false') {
            if (touchEndX < touchStartX - 50) {
                switchSlidePosition(1); // Swipe left = next
            }
            if (touchEndX > touchStartX + 50) {
                switchSlidePosition(-1); // Swipe right = previous
            }
        }
    }

    lightboxModal?.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    lightboxModal?.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    // --- Responsive arrow visibility on resize ---
    window.addEventListener('resize', () => {
        if (lightboxModal && lightboxModal.getAttribute('aria-hidden') === 'false') {
            updateMobileArrows();
        }
    });
});
