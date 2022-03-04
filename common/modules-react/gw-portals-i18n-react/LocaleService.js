// eslint-disable-next-line import/no-unresolved
import LocaleConfig from 'locale-config';

const LOCALE_REGEX = /^([a-z]{2,3})(?:[-_]([A-Z]{2}))?/;

function localeToIETF(locale) {
    return locale.replace(/_/g, '-');
}

function localeToPCNotation(locale) {
    const [, primaryLang, region] = LOCALE_REGEX.exec(locale);
    if (region) {
        return `${primaryLang}_${region}`;
    }
    if (primaryLang === 'en') {
        return 'en_US';
    }
    return primaryLang;
}

class LocaleServiceImpl {
    /**
     * Returns the available locales.
     * @returns {Array<string>} - The available locales
     */
    getAvailableLocales() {
        return Object.keys(LocaleConfig.locales).map(localeToIETF);
    }

    /**
     * Returns the available languages.
     * @returns {Array<string>} - The available languages
     */
    getAvailableLanguages() {
        return Object.keys(LocaleConfig.locales).map(localeToIETF);
    }

    /**
     * Gets the preferred locale.
     * @returns {string} - The preferred locale
     */
    getPreferredLocale() {
        return localeToIETF(LocaleConfig.preferredLocale);
    }

    getPreferredLanguage() {
        return localeToIETF(LocaleConfig.preferredLocale);
    }

    /**
     * Gets the default country code.
     * @returns {string} - The country code
     */
    getDefaultCountryCode() {
        return LocaleConfig.country.code;
    }

    /**
     * Gets the postal code regex.
     * @returns {string} - The postal code regex
     */
    getPostalCodeRegex() {
        return LocaleConfig.address.PostalCodeRegex;
    }

    /**
     * Returns the default phone country code.
     * @returns {String} - The default phone country code
     */
    getDefaultPhoneCountry() {
        return LocaleConfig.phone.UserDefaultPhoneCountry;
    }

    /**
     * Returns the default currency code.
     * @returns {String} - The default currency code
     */
    getDefaultCurrencyCode() {
        return LocaleConfig.currency.code;
    }

    /**
     * Returns the user's stored locale preference.
     * @returns {string | null}
     */
    getStoredLocale() {
        return localStorage.getItem('selectedLocale');
    }

    /**
     * Returns the user's stored language preference.
     * @returns {string | null}
     */
    getStoredLanguage() {
        return localStorage.getItem('selectedLanguage');
    }

    /**
     * Stores the user's preferred locale.
     * @param {string} locale - The preferred locale
     */
    saveLocale(locale) {
        localStorage.setItem('selectedLocale', locale);
    }

    /**
     * Stores the user's preferred language.
     * @param {string} language - The preferred language
     */
    saveLanguage(language) {
        localStorage.setItem('selectedLanguage', language);
    }

    /**
     * Load application specific messages
     * @param {string} lang
     * @returns {Promise<Object>} - Loaded messages
     * @static
     */
    static loadMessages = async (lang) => {
        const languageToLoad = localeToPCNotation(lang);
        try {
            const { default: selectedLangMessages } = await import(
                /* webpackInclude: /\.json$/ */
                /* webpackChunkName: "app-messages-[request]" */
                /* webpackMode: "eager" */
                `app-translation/${languageToLoad}`
            );
            const defaultLang = LocaleConfig.preferredLocale;

            const { default: defaultLangMessages } = await import(
                /* webpackInclude: /\.json$/ */
                /* webpackChunkName: "app-messages-[request]" */
                /* webpackMode: "eager" */
                `app-translation/${defaultLang}`
            );
            const messages = Object.assign({}, defaultLangMessages, selectedLangMessages);
            return messages;
        } catch (error) {
            console.warn(`Unable to load translations for lang: ${lang}.`);
            return {};
        }
    };
}

export default LocaleServiceImpl;
