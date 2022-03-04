import AddressLookupService from '../services/AddressLookupService';

const lookupAddress = async (addressString) => {
    const response = await AddressLookupService.lookupAddressUsingString(addressString);
    try {
        if (response.matches && response.matches.length > 0) {
            const sortedMatches = response.matches.sort(
                (addressA, addressB) => addressA.matchAccuracy < addressB.matchAccuracy
            );
            return sortedMatches.map((elem) => elem.address);
        }
        return [];
    } catch (err) {
        throw new Error(err);
    }
};

export default { lookupAddress: lookupAddress };
