// assets/js/i18n.js
document.addEventListener('DOMContentLoaded', () => {
    const languageSwitcher = document.getElementById('lang-switcher');
    const buttons = languageSwitcher.querySelectorAll('button');
    let currentLang = localStorage.getItem('language') || navigator.language.split('-')[0] || 'en'; // Default to 'en'

    // Ensure currentLang is either 'en' or 'fr'
    if (currentLang !== 'en' && currentLang !== 'fr') {
        currentLang = 'en';
    }

    const applyTranslations = (lang) => {
        // Ensure the translations object exists
        if (typeof translations === 'undefined' || !translations[lang]) {
            console.error(`Translations for language '${lang}' not found.`);
            return; // Exit if translations are missing
        }

        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                // Handle different element types appropriately
                if (element.tagName === 'TITLE') {
                    document.title = translations[lang][key];
                } else if (element.tagName === 'BUTTON' || element.tagName === 'A' || element.tagName === 'I' || element.tagName === 'SPAN' || element.tagName === 'EM' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'H4' || element.tagName === 'LI' || element.tagName === 'P') {
                   // Directly set innerHTML for elements where tags aren't expected within
                   // Use innerText if you want to avoid interpreting potential HTML in translations
                   element.innerHTML = translations[lang][key];
                } else {
                    // Default to innerText for other elements to be safer
                    element.innerText = translations[lang][key];
                }
                // console.log(`Translated ${key} to ${translations[lang][key]}`); // For debugging
            } else {
                console.warn(`Translation key '${key}' not found for language '${lang}'.`);
            }
        });

        // Update active button style
        buttons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-lang') === lang) {
                button.classList.add('active');
            }
        });

         // Set the lang attribute on the <html> element
         document.documentElement.lang = lang;

        // Store the selected language
        localStorage.setItem('language', lang);
        currentLang = lang; // Update the global currentLang

        // Dispatch a custom event to notify other scripts (like animations) that the language changed
        // Other scripts can listen for this event and update dynamic content
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
    };

    // Function to be called by other scripts to get a translation
    window.getTranslatedText = (key) => {
        if (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang][key]) {
            return translations[currentLang][key];
        }
        console.warn(`Translation key '${key}' requested but not found for language '${currentLang}'.`);
        // Fallback to English or the key itself if English isn't found either
        if (typeof translations !== 'undefined' && translations['en'] && translations['en'][key]) {
             return translations['en'][key];
        }
        return key; // Return the key as a last resort
    };


    // Add event listeners to buttons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            applyTranslations(lang);
        });
    });

    // Apply translations on initial load
    applyTranslations(currentLang);
}); 