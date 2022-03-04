import _ from 'lodash';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

export default class HastingsValidationPopulatorService {
    static populateLicenseResponse(licenseResponse, submissionVM, driverPath) {
        const licenceNumberFieldname = 'licenseNumber';
        const licenceNumberPath = `${driverPath}.${licenceNumberFieldname}`;
        const licenceHeldForFieldname = 'licenceHeldFor';
        const licenceHeldForPath = `${driverPath}.${licenceHeldForFieldname}`;
        const licenceObtainedField = 'licenceObtainedDate';
        const licenceObtainedPath = `${driverPath}.${licenceObtainedField}`;

        const claimsAndConvictionsPath = `${driverPath}.claimsAndConvictions`;
        const convictionsCollectionPath = `${claimsAndConvictionsPath}.convictionsCollection`;
        const anyConvictionsName = 'anyConvictions';
        const anyConvictionsPath = `${claimsAndConvictionsPath}.${anyConvictionsName}`;

        // Driving License Number
        if (licenseResponse.result.drivingLicence.drivingLicenceNumber) {
            _.set(submissionVM, `${licenceNumberPath}.value`, licenseResponse.result.drivingLicence.drivingLicenceNumber);

            const licenceYearsHeld = licenseResponse.result.drivingLicence.drivingLicenceYears;
            const yearLicensedAvailableValues = _.get(submissionVM, licenceHeldForPath).aspects.availableValues;

            let val;
            if (licenceYearsHeld < 20) {
                // eslint-disable-next-line eqeqeq
                val = yearLicensedAvailableValues.find((avalVal) => avalVal.code == licenceYearsHeld);

                if (licenceYearsHeld <= 2) {
                    const licenseDate = new Date(licenseResponse.result.drivingLicence.drivingLicenceDate);
                    _.set(submissionVM, `${licenceObtainedPath}`, {});
                    _.set(submissionVM, `${licenceObtainedPath}.year`, licenseDate.getFullYear());
                    _.set(submissionVM, `${licenceObtainedPath}.day`, licenseDate.getDate());
                    _.set(submissionVM, `${licenceObtainedPath}.month`, licenseDate.getMonth());
                }
            } else {
                // eslint-disable-next-line eqeqeq
                val = yearLicensedAvailableValues.find((avalVal) => avalVal.code == 20);
            }
            _.set(submissionVM, `${licenceHeldForPath}.value`, val);
        }

        // Convictions
        if (licenseResponse.result.drivingEndorsementsCollection
            && _.isArray(licenseResponse.result.drivingEndorsementsCollection)
            && licenseResponse.result.drivingEndorsementsCollection.length > 0) {
            _.set(submissionVM, `${anyConvictionsPath}.value`, 'true');

            const convictions = _.map(licenseResponse.result.drivingEndorsementsCollection, (conviction) => {
                dayjs.extend(duration);
                const disqualPeriod = dayjs.duration(_.trim(conviction.disqualPeriod));

                const durationYears = disqualPeriod.years() ? disqualPeriod.years() : 0;
                const durationMonths = disqualPeriod.months() ? disqualPeriod.months() : 0;
                const drivingBanMonths = Math.round(Number(durationYears) * 12 + Number(durationMonths));

                return {
                    convictionCode: conviction.code,
                    convictionDate: conviction.convictionDate,
                    drivingBanMonths: drivingBanMonths,
                    penaltyPoints: `${conviction.noOfPoints}`
                };
            });

            _.set(submissionVM, `${anyConvictionsPath}.value`, 'true');
            _.set(submissionVM, convictionsCollectionPath, convictions);
        } else {
            _.set(submissionVM, `${anyConvictionsPath}.value`, 'false');
        }
    }

    static clearLicenseData(submissionVM, driverPath) {
        const licenceHeldForFieldname = 'licenceHeldFor';
        const licenceHeldForPath = `${driverPath}.${licenceHeldForFieldname}`;
        const licenceObtainedField = 'licenceObtainedDate';
        const licenceObtainedPath = `${driverPath}.${licenceObtainedField}`;

        const claimsAndConvictionsPath = `${driverPath}.claimsAndConvictions`;
        const convictionsCollectionPath = `${claimsAndConvictionsPath}.convictionsCollection`;
        const anyConvictionsName = 'anyConvictions';
        const anyConvictionsPath = `${claimsAndConvictionsPath}.${anyConvictionsName}`;

        // Driving License
        _.set(submissionVM, `${licenceObtainedPath}`, null);
        _.set(submissionVM, licenceHeldForPath, null);

        // Convictions
        _.set(submissionVM, `${anyConvictionsPath}.value`, null);
        _.set(submissionVM, convictionsCollectionPath, null);
    }
}