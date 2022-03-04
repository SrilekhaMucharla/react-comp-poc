function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function today(increment = 0) {
    const date = new Date();
    if (increment) {
        date.setDate(date.getDate() + increment);
    }
    date.setHours(0, 0, 0, 0);
    return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate()
    };
}

/**
 * This class is used in conjunction with the Expression Language only. Do not call directly.
 */
export default {
    daysInMonth: daysInMonth,
    daysInLocalDate: (ld) => daysInMonth(ld.year, ld.month),
    toMidnightDate: (localDate) => {
        if (localDate) {
            return new Date(localDate.year, localDate.month, localDate.day);
        }
        return null;
    },
    today
};
