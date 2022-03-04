import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import isLeapYear from 'dayjs/plugin/isLeapYear';

dayjs.extend(dayOfYear);
dayjs.extend(isLeapYear);

export const getYearsDifferenceFromToday = (date) => {
    const startDate = dayjs(date);
    const diff = dayjs().diff(startDate, 'year', true);
    return Math.round(diff);
};

export const getDateObject = (date) => {
    const dateString = `${1 + date.month}/${date.day}/${date.year}`;
    return new Date(dateString);
};

export const _isLeapYear = (year) => ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);

export const dayOfTheYear = (year, month, day) => dayjs(new Date(year, month, day)).dayOfYear();

export const getDateFromParts = ({ year, month, day }) => new Date(year, month, day);

export const getLatestQuoteByInceptionDate = (quoteObject) => {
    if (quoteObject.length) {
        const mostRecentDate = new Date(Math.max.apply(null, quoteObject.map((e) => {
            return new Date(e.quoteUpdateTime);
        })));
        const mostRecentObject = quoteObject.filter((e) => {
            const d = new Date(e.quoteUpdateTime);
            return d.getTime() === mostRecentDate.getTime();
        })[0];
        return mostRecentObject;
    }
    return null;
};

export const dateToFormattedString = (date) => {
    const { day, month, year } = date;
    return `${day}-${month}-${year}`;
};
