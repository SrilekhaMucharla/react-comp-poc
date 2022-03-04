import _ from 'lodash';

const ukDrivingLicense = (lastName, birthYear, birthMonth, birthDay, gender) => {
    if (typeof lastName !== 'string'
        || typeof birthYear !== 'number'
        || typeof birthMonth !== 'number'
        || typeof birthDay !== 'number'
        || typeof gender !== 'string') {
        throw new Error(`Wrong data licence parameters: ${lastName}, ${birthYear}, ${birthMonth}, ${birthDay}, ${gender}.`);
    }

    const padLastName = _.padEnd(lastName, 5, '9');
    const trimLastName = padLastName.substring(0, 5)
        .toUpperCase();
    const trimBirthYear = birthYear.toString()
        .substring(2, 3);
    const trimLastBirthYear = birthYear.toString()
        .substring(3, 4);

    const padBirthMonth = _.padStart(birthMonth, 2, '0');

    let padBirthMonthFirst = Number(padBirthMonth.substring(0, 1));
    if (gender === 'F') {
        padBirthMonthFirst += 5;
    }
    const padBirthMonthSec = padBirthMonth.substring(1, 2);

    const padBirthDay = _.padStart(birthDay, 2, '0');

    // eslint-disable-next-line no-shadow,max-len
    const ukDrivingLicense = trimLastName + trimBirthYear + padBirthMonthFirst + padBirthMonthSec + padBirthDay + trimLastBirthYear;

    if (ukDrivingLicense.length !== 11) {
        throw new Error(`Driving licence generation error: ${ukDrivingLicense}`);
    }

    return ukDrivingLicense;
};

export default ukDrivingLicense;
