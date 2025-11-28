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