function sortNumber(a, b) {
    return a - b;
}

function sortString(a, b) {
    let s1 = a;
    let s2 = b;
    s1 = (s1 === undefined) ? '' : a.toString().toLocaleLowerCase();
    s2 = (s2 === undefined) ? '' : b.toString().toLocaleLowerCase();
    return s1.localeCompare(s2);
}

function sortDate(a, b) {
    const date1 = new Date(a);
    const date2 = new Date(b);

    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
}

function sortCurrency(a, b) {
    if (a.amount > b.amount) return 1;
    if (a.amount < b.amount) return -1;
    return 0;
}

export default {
    sortNumber,
    sortDate,
    sortString,
    sortCurrency
};
