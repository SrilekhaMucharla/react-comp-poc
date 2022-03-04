import { MapUtil } from 'gw-portals-util-js';


let googleMapsPromise;

function loadGoogleMapsAPI() {
    // simple hack to avaoid multiple reloading of map scripts
    // window.google = {
    //     maps: {}
    // };
    const protocol = document.location.protocol === 'https:' ? 'https' : 'http';
    const googleMapsApiSrc = `${protocol}://maps.googleapis.com/maps/api/js?key=${MapUtil.getApiKey()}&libraries=${MapUtil.getLibraries()}&version=${MapUtil.getMapVersion()}`;
    if (!googleMapsPromise) {
        googleMapsPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.async = true;
            document.head.appendChild(script);
            script.src = googleMapsApiSrc;
            script.onerror = (err) => {
                reject(err);
            };
            script.onload = () => {
                resolve(window.google.maps);
            };
        });
    }
    return googleMapsPromise;
}

export default loadGoogleMapsAPI;
