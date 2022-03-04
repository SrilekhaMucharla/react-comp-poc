import moment from 'moment';

/**
 * Module that returns the current date. Can be replaced with
 * another implementation, for example if you needed to time travel and return
 * a different current date
 */

function currentDate() {
    return new Date();
}

function getYear(date) {
    return date ? date.getUTCFullYear() : null;
}

function getMonth(date) {
    return date ? date.getUTCMonth() : null;
}

function getDate(date) {
    return date ? date.getUTCDate() : null;
}

function trimToMidnight(date) {
    const returnedDate = new Date(date);
    returnedDate.setHours(0, 0, 0, 0);
    return returnedDate;
}

function getHour(date) {
    return date.getHours();
}

function addHours(date, hrsToAdd) {
    date.setHours(date.getHours() + hrsToAdd);
    return date;
}

function getCurrentTimeTrimmedToHour() {
    const time = this.currentDate();
    time.setMinutes(0, 0, 0);
    return time;
}

function compareIgnoreTime(date1, date2) {
    const date1NoTime = new Date(date1).setHours(0, 0, 0, 0);
    const date2NoTime = new Date(date2).setHours(0, 0, 0, 0);

    if (date1NoTime > date2NoTime) {
        return 1;
    }
    if (date1NoTime < date2NoTime) {
        return -1;
    }
    return 0;
}

function dateYearsAgo(date, years) {
    return moment(date)
        .subtract(years, 'years')
        .toDate();
}

function currentDateAtMidnight() {
    return trimToMidnight(currentDate());
}

export default {
    currentDate,

    /**
     * Returns the current day at the beginning (00:00:00h) of the day.
     *
     * @returns {Date}
     */
    currentDateAtMidnight,

    getYear,

    getMonth,

    getDate,

    /**
     * Returns new date object with time portion set to zero
     * Original date parameter is not modified
     * @param date Initial date. Tis object is not modified
     * @returns {Date}
     */
    trimToMidnight,

    getHour,

    /**
     * Increments date by x number of hours
     *
     * @param date Initial date. This object is not modified
     * @param hrsToAdd (Integer} number of hours to add
     * @returns {Date} new date object incremented by 4 hours
     */
    addHours,

    /**
     * Returns the current time with minutes, seconds and milliseconds set to zero
     * @returns {*}
     */
    getCurrentTimeTrimmedToHour,

    /**
     * Compares the dates of two Date objects minus dates.
     * @param date1 First date to check.
     * @param date2 Second date to check.
     * @returns {Number} -1 if date1 is before date2, 0 if they are equal,
     *      1 if date2 is after date1.
     */
    compareIgnoreTime,

    /**
     * Returns a date set to the day x years prior, w
     */
    dateYearsAgo
};
