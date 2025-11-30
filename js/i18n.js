document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('languageSelector');
    const supportedLangs = ['en', 'pl', 'de'];
    const defaultLang = 'en';

    const setLanguage = async (lang) => {
        const validLang = supportedLangs.includes(lang) ? lang : defaultLang;

        // Update the URL without reloading the page
        const url = new URL(window.location);
        url.searchParams.set('lang', validLang);
        window.history.pushState({}, '', url);

        // Load the translation file
        const response = await fetch(`locales/${validLang}.json`);
        const translations = await response.json();

        // Apply translations
        document.querySelectorAll('[data-i18n-key]').forEach(element => {
            const key = element.getAttribute('data-i18n-key');
            if (translations[key]) {
                // Use innerHTML to support tags like <strong> or <br> in translations
                element.innerHTML = translations[key];
            }
        });

        // Update the language selector dropdown
        if (languageSelector) {
            languageSelector.value = validLang;
        }

        // Set the lang attribute on the <html> tag for SEO and accessibility
        document.documentElement.lang = validLang;
    };

    const getInitialLanguage = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const langFromUrl = urlParams.get('lang');

        if (langFromUrl && supportedLangs.includes(langFromUrl)) {
            return langFromUrl;
        }

        // Get language from browser settings
        const browserLang = navigator.language.split('-')[0];
        if (supportedLangs.includes(browserLang)) {
            return browserLang;
        }

        return defaultLang;
    };

    const init = async () => {
        const initialLang = getInitialLanguage();
        await setLanguage(initialLang);
        languageSelector.addEventListener('change', (e) => setLanguage(e.target.value));
    };

    init();
});