document.addEventListener('DOMContentLoaded', () => {
    
    // Select View Target Framework Containers
    const viewLanding = document.getElementById('viewLanding');
    const viewGalleryArchive = document.getElementById('viewGalleryArchive');
    const lightboxModal = document.getElementById('lightboxModal');
    
    // Header Links
    const navHome = document.getElementById('navHome');
    const navWorks = document.getElementById('navWorks');
    
    // Hero Click Scroll Links
    const btnScrollToGrid = document.getElementById('btnScrollToGrid');
    const landingCategoryGrid = document.getElementById('landingCategoryGrid');
    
    // Lightbox Frame Selectors
    const lightboxMainImg = document.getElementById('lightboxMainImg');
    const lbTitle = document.getElementById('lbTitle');
    const lbDesc = document.getElementById('lbDesc');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    const btnCloseLightbox = document.getElementById('btnCloseLightbox');
    const btnZoomHD = document.getElementById('btnZoomHD');
    const btnDownloadAsset = document.getElementById('btnDownloadAsset');

    let currentGallerySet = [];
    let currentPointerIndex = 0;

    // --- Core Route Router Handler ---
    function navigateToView(targetView, fallbackActiveLink) {
        viewLanding.classList.remove('active-view');
        viewGalleryArchive.classList.remove('active-view');
        
        navHome.classList.remove('active');
        navWorks.classList.remove('active');

        targetView.classList.add('active-view');
        if(fallbackActiveLink) fallbackActiveLink.classList.add('active');
        
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // FIX 2: Connect General Cards (Main 2D card now safely defaults to Stylized/Anime portfolio)
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.sub-style-btn')) return;

            const categoryType = card.getAttribute('data-category');
            
            if (categoryType === '2d') {
                console.log("Main 2D clicked: Defaulting archive flow to Anime layout styles");
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

    // Sub-Menu Split Filter Buttons Logic Implementation
    document.querySelectorAll('.sub-style-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const chosenStyle = btn.getAttribute('data-filter-style');
            console.log(`Filtering Archive Wall Target Matrix Context: ${chosenStyle}`);

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

    navHome.addEventListener('click', (e) => { e.preventDefault(); navigateToView(viewLanding, navHome); });
    navWorks.addEventListener('click', (e) => { e.preventDefault(); navigateToView(viewGalleryArchive, navWorks); });

    // Chevron Anchor Scroll Event Listener Hook
    if (btnScrollToGrid && landingCategoryGrid) {
        btnScrollToGrid.addEventListener('click', () => {
            landingCategoryGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // --- Lightbox Sequence Processing Loop ---
    const allThumbnails = Array.from(document.querySelectorAll('.thumb-item'));

    allThumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            currentGallerySet = allThumbnails.filter(item => !item.classList.contains('filtered-out'));
            currentPointerIndex = currentGallerySet.indexOf(thumbnail);
            renderActiveLightboxNode(thumbnail);
        });
    });

    function renderActiveLightboxNode(elementNode) {
        if (!elementNode) return;
        
        const fullResolutionSource = elementNode.getAttribute('data-full');
        const metaTitle = elementNode.getAttribute('data-title');
        const metaDesc = elementNode.getAttribute('data-desc');

        lightboxMainImg.src = fullResolutionSource;
        lbTitle.textContent = "作品简介: " + metaTitle;
        lbDesc.textContent = metaDesc;

        lightboxModal.setAttribute('aria-hidden', 'false');
    }

    function switchSlidePosition(directionMultiplier) {
        if (currentGallerySet.length === 0) return;
        currentPointerIndex = (currentPointerIndex + directionMultiplier + currentGallerySet.length) % currentGallerySet.length;
        renderActiveLightboxNode(currentGallerySet[currentPointerIndex]);
    }

    lbNext.addEventListener('click', () => switchSlidePosition(1));  
    lbPrev.addEventListener('click', () => switchSlidePosition(-1)); 

    btnCloseLightbox.addEventListener('click', () => {
        lightboxModal.setAttribute('aria-hidden', 'true');
        lightboxMainImg.src = ""; 
    });

    // --- Direct Physical Asset Downloader Bridge ---
    btnDownloadAsset.addEventListener('click', () => {
        const fileURL = lightboxMainImg.src;
        if (!fileURL) return;

        const shadowAnchor = document.createElement('a');
        shadowAnchor.href = fileURL;
        shadowAnchor.download = `Opal_Artwork_${Date.now()}.jpg`;
        document.body.appendChild(shadowAnchor);
        shadowAnchor.click();
        document.body.removeChild(shadowAnchor);
    });

    // --- HD Zoom Engine Standalone Inspector Window Portal ---
    btnZoomHD.addEventListener('click', () => {
        const targetMasterSourceURL = lightboxMainImg.src;
        if (!targetMasterSourceURL) return;

        const zoomViewportInstance = window.open('', '_blank');
        zoomViewportInstance.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>Opal乳白色 | Deep Image Canvas Inspector</title>
                <style>
                    body {
                        margin: 0; padding: 0; background: #000;
                        overflow: hidden; display: flex;
                        justify-content: center; align-items: center;
                        width: 100vw; height: 100vh;
                        user-select: none; -webkit-user-select: none;
                    }
                    .viewport-wrapper {
                        width: 100%; height: 100%; display: flex;
                        justify-content: center; align-items: center;
                        cursor: grab;
                    }
                    .viewport-wrapper:active { cursor: grabbing; }
                    img {
                        max-width: 95%; max-height: 95%;
                        object-fit: contain; transition: transform 0.12s ease-out;
                        transform-origin: center center;
                        will-change: transform;
                    }
                    .dock-panel {
                        position: fixed; bottom: 30px; left: 50%;
                        transform: translateX(-50%); background: rgba(10,10,10,0.9);
                        border: 1px solid rgba(255,255,255,0.08); border-radius: 40px;
                        padding: 8px 30px; display: flex; gap: 25px; z-index: 1000;
                    }
                    button {
                        background: none; border: none; color: #aaa;
                        font-size: 24px; cursor: pointer; padding: 5px 12px;
                        transition: color 0.2s;
                    }
                    button:hover { color: #fff; }
                </style>
            </head>
            <body>
                <div class="viewport-wrapper" id="canvasStage">
                    <img id="zoomTarget" src="${targetMasterSourceURL}" alt="HD Zoom Target">
                </div>
                <div class="dock-panel">
                    <button id="ctrlIn">+</button>
                    <button id="ctrlOut">-</button>
                    <button id="ctrlReset">⟲</button>
                </div>
                <script>
                    const img = document.getElementById('zoomTarget');
                    const stage = document.getElementById('canvasStage');
                    let currentScale = 1;
                    let dragFlag = false;
                    let pointerX, pointerY, driftX = 0, driftY = 0;

                    function applyCanvasTransforms() {
                        img.style.transform = 'translate(' + driftX + 'px, ' + driftY + 'px) scale(' + currentScale + ')';
                    }

                    document.getElementById('ctrlIn').addEventListener('click', () => { currentScale += 0.35; applyCanvasTransforms(); });
                    document.getElementById('ctrlOut').addEventListener('click', () => { if(currentScale > 0.4) currentScale -= 0.35; applyCanvasTransforms(); });
                    document.getElementById('ctrlReset').addEventListener('click', () => { currentScale = 1; driftX = 0; driftY = 0; applyCanvasTransforms(); });

                                        window.addEventListener('wheel', (e) => {
                        e.preventDefault();
                        if (e.deltaY < 0) currentScale += 0.12;
                        else if (currentScale > 0.35) currentScale -= 0.12;
                        applyCanvasTransforms();
                    }, { passive: false });

                    stage.addEventListener('mousedown', (e) => {
                        dragFlag = true;
                        pointerX = e.clientX - driftX;
                        pointerY = e.clientY - driftY;
                    });
                    window.addEventListener('mousemove', (e) => {
                        if (!dragFlag) return;
                        driftX = e.clientX - pointerX;
                        driftY = e.clientY - pointerY;
                        applyCanvasTransforms();
                    });
                    window.addEventListener('mouseup', () => { dragFlag = false; });
                <\/script>
            </body>
            </html>
        `);
        zoomViewportInstance.document.close();
    });

    // Keyboard Layout Interceptors
    document.addEventListener('keydown', (e) => {
        if (lightboxModal.getAttribute('aria-hidden') === 'false') {
            if (e.key === 'ArrowRight') switchSlidePosition(1);
            if (e.key === 'ArrowLeft') switchSlidePosition(-1);
            if (e.key === 'Escape') {
                lightboxModal.setAttribute('aria-hidden', 'true');
                lightboxMainImg.src = "";
            }
        }
    });
});

