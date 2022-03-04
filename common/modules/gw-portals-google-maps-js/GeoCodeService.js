/*
 * Google Maps Api JS
 * https://developers.google.com/maps/documentation/javascript/geocoding
 */
class GeoCodeService {
    constructor() {
        if (window.google && window.google.maps) {
            // throw new Error('google map api not found');
            this.mapsApi = window.google.maps;
            this.geocoder = new this.mapsApi.Geocoder();
        }
    }

    /*
     * Geocode Address model to cords latitude, longitude
     */
    geocodeAddress(address) {
        const defer = new Promise((resolve, reject) => {
            if (this.mapsApi) {
                let search = address.addressLine1;
                if (address.addressLine2) {
                    search = `${address.addressLine1} ${address.addressLine2}`;
                }
                search = `${search}, ${address.city}, ${address.state}`;

                this.geocoder.geocode(
                    {
                        address: search,
                        componentRestrictions: {
                            country: address.country,
                            postalCode: address.postalCode
                        }
                    },
                    (results, status) => {
                        if (status === this.mapsApi.GeocoderStatus.OK && results.length > 0) {
                            resolve({
                                latitude: results[0].geometry.location.lat(),
                                longitude: results[0].geometry.location.lng()
                            });
                        } else if (status === this.mapsApi.GeocoderStatus.ZERO_RESULTS) {
                            // eslint-disable-next-line no-console
                            console.warn(`Google Geocode API error : ${status}`);
                        } else {
                            // eslint-disable-next-line no-console
                            console.warn(`Google Geocode API error : ${status}`);
                            reject();
                        }
                    }
                );
            }
        });
        return defer;
    }

    /*
     * Geocode latitude, longitude to address
     */
    geocodeLatlng({ lat, lng }) {
        const defer = new Promise((resolve, reject) => {
            if (this.mapsApi) {
                this.geocoder.geocode({
                    location: { lat, lng }
                },
                (results, status) => {
                    if (status === this.mapsApi.GeocoderStatus.OK && results.length > 0) {
                        resolve({
                            address: results[0].formatted_address
                        });
                    } else {
                        // eslint-disable-next-line no-console
                        console.warn(`Google Geocode API error : ${status}`);
                        reject();
                    }
                });
            }
        });
        return defer;
    }

    /*
     * Geocode GooglePlace object to cords latitude, longitude
     */
    geocodePlace(placeId) {
        const defer = new Promise((resolve, reject) => {
            if (!this.mapsApi) {
                throw new Error('google map api not found');
            }

            this.geocoder.geocode({ placeId: placeId }, (results, status) => {
                if (status === this.mapsApi.GeocoderStatus.OK && results.length > 0) {
                    resolve({
                        latitude: results[0].geometry.location.lat(),
                        longitude: results[0].geometry.location.lng()
                    });
                } else {
                    // eslint-disable-next-line no-console
                    console.warn(`Google Geocode API error : ${status}`);
                    reject();
                }
            });
        });
        return defer;
    }

    /*
     * Legacy Google Geocode Rest Api
     */
    // eslint-disable-next-line class-methods-use-this
    getGeoCodedAddr(lat, lon, sensor = true) {
        const geoCodeURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&sensor=${sensor}`;
        return fetch(geoCodeURL).then(
            (response) => {
                const address = {
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: '',
                    countryCode: ''
                };
                if (response.data.status === 'OK') {
                    const addressComponents = response.data.results[0].address_components;
                    let streetNumber;
                    let streetName;
                    // eslint-disable-next-line no-plusplus
                    for (let i = 0; i < addressComponents.length; i++) {
                        const addr = addressComponents[i];

                        const types = addr.types.join();
                        switch (types) {
                            case 'country':
                                address.country = addr.short_name;
                                break;
                            case 'street_number':
                                streetNumber = addr.long_name;
                                break;
                            case 'route':
                                streetName = addr.long_name;
                                break;
                            case 'postal_code':
                                address.postalCode = addr.short_name;
                                break;
                            case 'country,political':
                                address.country = addr.long_name;
                                address.countryCode = addr.short_name;
                                break;
                            case 'administrative_area_level_1,political':
                                address.state = addr.short_name;
                                break;
                            case 'locality,political':
                                address.city = addr.long_name;
                                break;
                            default:
                        }
                    }

                    if (streetNumber && streetName) {
                        address.addressLine1 = `${streetNumber} ${streetName}`;
                    } else if (streetName) {
                        address.addressLine1 = streetName;
                    } else if (streetNumber) {
                        address.addressLine1 = streetName;
                    }
                }
                return address;
            },
            () => {} // handle error, status, headers
        );
    }
}

export default GeoCodeService;
