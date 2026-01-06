document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    const triggerImages = document.querySelectorAll('.feature-screenshot img');
    let currentIndex = 0;

    triggerImages.forEach(img => {
        img.addEventListener('click', function() {
            const imagesArray = Array.from(triggerImages);
            currentIndex = imagesArray.indexOf(this);
            showImage(currentIndex);
        });
    });

    function showImage(index) {
        const img = triggerImages[index];
        const isMobile = window.innerWidth <= 768;
        modalImg.src = isMobile 
            ? img.src 
            : (img.dataset.largeSrc || img.src);
        
        if (modal.style.display !== 'flex') {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    closeBtn.addEventListener('click', closeModal);

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : triggerImages.length - 1;
        showImage(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex < triggerImages.length - 1) ? currentIndex + 1 : 0;
        showImage(currentIndex);
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (modal.style.display !== 'flex') return;

        if (e.key === "Escape") {
            closeModal();
        } else if (e.key === "ArrowLeft") {
            prevBtn.click();
        } else if (e.key === "ArrowRight") {
            nextBtn.click();
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Handle "Start Learning" button loading state
    const actionLinks = document.querySelectorAll('a[href*="script.google.com"]');

    actionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Ignore if opening in a new tab (Ctrl/Cmd/Shift/Middle click)
            if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;

            const btn = e.currentTarget;
            const icon = btn.querySelector('i');

            btn.classList.add('btn-loading');

            if (icon) {
                btn.dataset.originalIcon = icon.className;
                icon.className = 'fa-solid fa-circle-notch fa-spin';
            }
        });
    });

    // Reset buttons when navigating back (e.g. via browser Back button)
    window.addEventListener('pageshow', () => {
        document.querySelectorAll('.btn-loading').forEach(btn => {
            btn.classList.remove('btn-loading');
            const icon = btn.querySelector('i');
            if (icon && btn.dataset.originalIcon) {
                icon.className = btn.dataset.originalIcon;
            }
        });
    });
});