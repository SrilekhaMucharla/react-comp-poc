function getExtractedAddress(addressComponents) {
    const address = {};
    let streetNumber;
    let streetName;

    for (let i = 0; i < addressComponents.length; i += 1) {
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
    return address;
}

export default {
    getAddress: getExtractedAddress
};
