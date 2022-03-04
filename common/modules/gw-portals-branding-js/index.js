/**
 * Invokes the code to assign branding to the app
 */
import brandingData from './BrandingData';

// adds branding class to an HTML element
function setBranding() {
    document.documentElement.classList.add(`gw-branding-${brandingData.BRANDING}`);
}
export {
    brandingData,
    setBranding
};
