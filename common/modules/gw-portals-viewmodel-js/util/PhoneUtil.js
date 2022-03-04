import { PhoneNumberUtil } from 'google-libphonenumber';

export default () => {
    return {
        /**
         * Will pretty-print a phone number according
         * to the provided region
         *
         * If number is not valid or libphonenumber is absent
         * will return an original string
         *
         * @param {String} phoneNumber
         * @param {String} countryCode
         * @returns {String}
         */
        prettyPrint: (phoneNumber, countryCode) => {
            const phoneUtils = PhoneNumberUtil.getInstance();
            const phoneRegion = countryCode;
            try {
                return phoneUtils.format(phoneUtils.parse(phoneNumber, phoneRegion));
            } catch (e) {
                // if there is some problem in libphonenumber e.g. the number is not valid
                // returns the original number
                return phoneNumber;
            }
        },
        /**
         * Will call libphonenumber's isValidNumber function to check if
         * the phone number provided is a valid phone number
         * for the country in question
         *
         * @param {String} phoneNumber
         * @param {String} countryCode
         * @returns {boolean}
         */
        isPossibleNumber: (phoneNumber, countryCode) => {
            const phoneUtils = PhoneNumberUtil.getInstance();
            let returnVal = true;
            let extPos;
            let number;
            if (phoneNumber) {
                extPos = phoneNumber.indexOf(' x');
                number = extPos > 0 ? phoneNumber.substring(0, extPos) : phoneNumber;
                number = number.replace(/[-_]/g, '');
                try {
                    returnVal = phoneUtils.isValidNumber(phoneUtils.parse(number, countryCode));
                } catch (e) {
                    // Suppress log error message from libphonenumber when number is not valid
                    return false;
                }
            }
            return returnVal;
        }
    };
};
