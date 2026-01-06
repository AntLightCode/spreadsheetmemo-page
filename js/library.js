document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('.copy-link-btn');
    const toast = document.getElementById('toast');

    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const linkToCopy = button.dataset.link;
            const importUrl = `https://script.google.com/macros/s/AKfycbyVrzuFuKPW3iz0w8rnZzmrqAmULVsQx0ntRlUJNdG2ny9RJR5c/exec?import=${linkToCopy}`;
            
            navigator.clipboard.writeText(importUrl).then(() => {
                // Show toast notification
                toast.textContent = 'Direct import link copied to clipboard.';
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
            // Get text from file name (h3)
            const fileName = fileElement.querySelector('.file-name h3').textContent;
            // Get text from all tags
            const tags = Array.from(fileElement.querySelectorAll('.file-tag')).map(tag => tag.textContent).join(' ');
            // Combine them for a full search
            const searchableText = `${fileName} ${tags}`.toLowerCase();

            const isVisible = searchableText.includes(query);
            if (isVisible) resultsFound++;
            fileElement.style.display = isVisible ? '' : 'none';
        });

        // Handle visibility of categories and folders
        document.querySelectorAll('.library-category, .library-folder').forEach(container => {
            const visibleFiles = container.querySelectorAll('.library-file:not([style*="display: none"])');
            
            // Check files directly inside the current container, not nested ones.
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

    // Add click event listener to all tags
    document.querySelectorAll('.file-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const tagText = tag.textContent;
            searchInput.value = tagText;
            handleSearch();

            // Scroll to the search box with a top offset for "breathing room".
            const searchBox = document.querySelector('.library-search-box');
            const elementPosition = searchBox.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - 32; // 32px (2rem) offset
          
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        });
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

    const openModal = (element) => {
        const elementId = element.id;
        let name, shareUrl, shareText;

        if (element.classList.contains('library-file')) {
            name = element.querySelector('.file-name h3').textContent;
            shareText = `Check out this SpreadsheetMemo flashcard set: ${name}`;
        } else { // It's a category or folder (<details>)
            name = element.querySelector('summary span').textContent;
            const type = element.classList.contains('library-category') ? 'category' : 'folder';
            shareText = `Check out this flashcard ${type} in the SpreadsheetMemo library: ${name}`;
        }

        shareUrl = `https://spreadsheetmemo.com/library.html#${elementId}`;

        // Update modal content
        modalTitle.textContent = `Share "${name}"`;
        shareLinkInput.value = shareUrl;

        // Facebook - only supports URL (fetches metadata from Open Graph tags)
        socialLinks.facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        
        // X (Twitter) - supports URL and text
        socialLinks.x.href = `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        
        // LinkedIn - newer sharing endpoint (only URL is reliably supported)
        socialLinks.linkedin.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        
        // Reddit - include more info in the title 
        const redditTitle = `${name} - SpreadsheetMemo Flashcard Set`;
        socialLinks.reddit.href = `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(redditTitle)}`;
        modalBackdrop.classList.add('show');
    };

    const closeModal = () => {
        modalBackdrop.classList.remove('show');
    };

    // Attach click handlers to all share buttons
    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the <details> from toggling
            e.preventDefault(); // Prevent any default summary action

            // Find the closest shareable element (file, folder, or category)
            const shareableElement = e.target.closest('.library-file, .library-folder, .library-category');
            
            if (shareableElement) {
                openModal(shareableElement);
            }
        });
    });

    // Copy share link to clipboard
    copyShareLinkBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(shareLinkInput.value).then(() => {
            toast.textContent = 'Share link copied to clipboard.'; // Set specific text for this action
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2000);
        }).catch(err => console.error('Failed to copy share link: ', err));
    });

    // Close modal handlers
    closeModalBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
    });
});

// Use the 'load' event to ensure all content is loaded and browser has finished its initial scroll jump.
// This is more reliable for overriding the default anchor link behavior.
window.addEventListener('load', () => {
    // Disable the browser's automatic scroll restoration immediately.
    // This prevents the browser from jumping to an anchor before the script can handle it.
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Highlight element from URL hash on page load
    const highlightElementFromHash = () => {
        const hash = window.location.hash;
        if (!hash) return;

        // The ID is the hash without the '#'
        const elementId = hash.substring(1);
        const targetElement = document.getElementById(elementId);

        if (!targetElement) return;

        // Perform JS magic only for links to files (.csv)
        if (elementId.endsWith('.csv')) {
            // Open all parent <details> elements to make the item visible
            let parent = targetElement.parentElement;
            while (parent) {
                if (parent.tagName === 'DETAILS') {
                    parent.open = true;
                }
                parent = parent.parentElement;
            }

            // Scroll to the element with a smooth animation and highlight it
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetElement.classList.add('highlight');
        } else {
            // For other hashes (like categories), perform a standard instant scroll.
            targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    };

    highlightElementFromHash();
});

document.addEventListener('DOMContentLoaded', () => {
    // Handle "Import this set" and "Start Learning" buttons loading state
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