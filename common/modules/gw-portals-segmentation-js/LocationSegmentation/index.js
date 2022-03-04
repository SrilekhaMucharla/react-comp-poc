import GeoCodeService from './GeoCodeService';

function getLocation() {
    return new Promise((resolve, reject) => {
        // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
        navigator.geolocation.getCurrentPosition((position) => {
            resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        }, (err) => {
            reject(new Error('An error occurred during Google Maps loading', err));
        });
    });
}

function getExperimentValue(compareBy) {
    if (['country', 'countryCode', 'state', 'city'].indexOf(compareBy) === -1) {
        Promise.reject(new Error(`Unexpected 'compareBy' attribute value: "${compareBy}". It must be: "country|countryCode|state|city"`));
    }

    return getLocation()
        .then(({ lat, lng }) => GeoCodeService.getGeoCodedAddr(lat, lng, false))
        .then((locationData) => locationData[compareBy]);
}

export default {
    getExperimentValue
};
