/* eslint-disable eqeqeq */
const useNareApplicable = (periodStartDate, pcCurrentDate) => {
    let nareApplicableFrom = (process.env.REACT_APP_NARE_APPLICABLE_FROM) && new Date((process.env.REACT_APP_NARE_APPLICABLE_FROM).replace(/,/g, '/'));
    let nareApplicableStartDate = (process.env.REACT_APP_NARE_APPLICABLE_START_DATE) && new Date((process.env.REACT_APP_NARE_APPLICABLE_START_DATE).replace(/,/g, '/'));
    nareApplicableFrom = (nareApplicableFrom && nareApplicableFrom != 'Invalid Date') ? nareApplicableFrom : new Date('2022/2/15');
    nareApplicableStartDate = (nareApplicableStartDate && nareApplicableStartDate != 'Invalid Date') ? nareApplicableStartDate : new Date('2022/3/17');
    return ((new Date((new Date(pcCurrentDate)).setHours(0, 0, 0, 0)) >= nareApplicableFrom)
        && (new Date(periodStartDate.year, periodStartDate.month, periodStartDate.day) >= nareApplicableStartDate));
};
export default useNareApplicable;
