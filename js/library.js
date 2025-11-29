document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('.copy-link-btn');
    const toast = document.getElementById('toast');

    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const linkToCopy = button.dataset.link;
            const importUrl = `https://script.google.com/macros/s/AKfycbyVrzuFuKPW3iz0w8rnZzmrqAmULVsQx0ntRlUJNdG2ny9RJR5c/exec?import=${linkToCopy}`;
            
            navigator.clipboard.writeText(importUrl).then(() => {
                // Show toast notification
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                // Optionally, provide feedback that copy failed
                alert('Could not copy link. Please try again.');
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('library-search-input');
    const clearButton = document.getElementById('library-search-clear');
    const noResultsMessage = document.getElementById('no-results-message');
    if (!searchInput) return;

    const allFiles = Array.from(document.querySelectorAll('.library-file'));

    const handleSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        let resultsFound = 0;

        // Toggle clear button visibility
        clearButton.style.display = query ? 'block' : 'none';

        allFiles.forEach(fileElement => {
            const fileName = fileElement.querySelector('.file-name h3').textContent.toLowerCase();
            const isVisible = fileName.includes(query);
            if (isVisible) resultsFound++;
            fileElement.style.display = isVisible ? '' : 'none';
        });

        // Handle visibility of categories and folders
        document.querySelectorAll('.library-category, .library-folder').forEach(container => {
            const visibleFiles = container.querySelectorAll('.library-file:not([style*="display: none"])');
            
            // We only want to check files directly inside the current container, not nested ones.
            const directVisibleFiles = Array.from(visibleFiles).filter(file => file.closest('.library-category, .library-folder') === container);

            if (directVisibleFiles.length > 0) {
                container.style.display = '';
                // If there's a search query, expand the container to show results
                if (query) {
                    if (container.tagName === 'DETAILS') {
                        container.open = true;
                    }
                }
            } else {
                // Hide container if it has no direct visible files
                container.style.display = 'none';
            }
        });

        // Special case for categories: show them if any of their sub-folders are visible
        document.querySelectorAll('.library-category').forEach(category => {
            const visibleFolders = category.querySelectorAll('.library-folder:not([style*="display: none"])');
            if (visibleFolders.length > 0) {
                category.style.display = '';
                if (query) category.open = true;
            }
        });

        // Show or hide the "no results" message
        noResultsMessage.style.display = resultsFound === 0 ? 'block' : 'none';
    };

    searchInput.addEventListener('input', handleSearch);

    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        handleSearch();
        searchInput.focus();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const modalBackdrop = document.getElementById('share-modal-backdrop');
    if (!modalBackdrop) return;

    const modal = document.getElementById('share-modal');
    const modalTitle = document.getElementById('share-modal-title');
    const shareLinkInput = document.getElementById('share-link-input');
    const copyShareLinkBtn = document.getElementById('copy-share-link-btn');
    const closeModalBtn = document.getElementById('share-modal-close-btn');
    const toast = document.getElementById('toast');

    const socialLinks = {
        facebook: document.getElementById('share-facebook'),
        x: document.getElementById('share-x'),
        linkedin: document.getElementById('share-linkedin'),
        reddit: document.getElementById('share-reddit'),
    };

    const openModal = (fileElement) => {
        const fileId = fileElement.id;
        const fileName = fileElement.querySelector('.file-name h3').textContent;
        const shareUrl = `https://spreadsheetmemo.com/library.html#${fileId}`;
        const shareText = `Check out this SpreadsheetMemo flashcard set: ${fileName}`;

        // Update modal content
        modalTitle.textContent = `Share "${fileName}"`;
        shareLinkInput.value = shareUrl;

        // Facebook - only supports URL (fetches metadata from Open Graph tags)
        socialLinks.facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        
        // X (Twitter) - supports URL and text
        socialLinks.x.href = `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        
        // LinkedIn - newer sharing endpoint (only URL is reliably supported)
        socialLinks.linkedin.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        
        // Reddit - include more info in the title 
        const redditTitle = `${fileName} - SpreadsheetMemo Flashcard Set`;
        socialLinks.reddit.href = `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(redditTitle)}`;
        modalBackdrop.classList.add('show');
    };

    const closeModal = () => {
        modalBackdrop.classList.remove('show');
    };

    // Attach click handlers to all share buttons
    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const fileElement = e.target.closest('.library-file');
            if (fileElement) {
                openModal(fileElement);
            }
        });
    });

    // Copy share link to clipboard
    copyShareLinkBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(shareLinkInput.value).then(() => {
            toast.textContent = 'Share link copied!';
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                toast.textContent = 'Link copied to clipboard!'; // Reset text
            }, 2000);
        }).catch(err => console.error('Failed to copy share link: ', err));
    });

    // Close modal handlers
    closeModalBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Highlight element from URL hash on page load
    const highlightElementFromHash = () => {
        const hash = window.location.hash;
        if (!hash) return;

        // The ID is the hash without the '#'
        const elementId = hash.substring(1);
        const targetElement = document.getElementById(elementId);

        if (targetElement) {
            // Open all parent <details> elements to make the item visible
            let parent = targetElement.parentElement;
            while (parent) {
                if (parent.tagName === 'DETAILS') {
                    parent.open = true;
                }
                parent = parent.parentElement;
            }

            // Scroll to the element and highlight it
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetElement.classList.add('highlight');
        }
    };

    highlightElementFromHash();
});