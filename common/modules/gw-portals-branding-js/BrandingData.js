/**
 * Provides branding data from URL
 * using either 'branding' query string
 * or sub domain
 */
import queryString from 'query-string';

export default {
    BRANDING: (
        // e.g. XXX?branding=custom gives "custom"
        queryString.parse(window.location.search).branding
            // e.g. custom-domain.guidewire.com gives "custom-domain"
            || window.location.hostname.split('.')[0]
    )
};
