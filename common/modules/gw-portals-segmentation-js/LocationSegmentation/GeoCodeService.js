import { MapUtil, ExtractAddressUtil } from 'gw-portals-util-js';

/*
 * Google Maps Api JS
 * https://developers.google.com/maps/documentation/javascript/geocoding
 * Legacy Google Geocode Rest Api
 */
function getGeoCodedAddr(lat, lon, sensor = true) {
    const geoCodeURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&sensor=${sensor}&key=${MapUtil.getApiKey()}`;
    return fetch(geoCodeURL, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((res) => res.json())
        .then((response) => {
            const addressComponents = response.results[0].address_components;
            return ExtractAddressUtil.getAddress(addressComponents);
        });
}

export default {
    getGeoCodedAddr
};
