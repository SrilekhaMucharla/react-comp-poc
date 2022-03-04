import _ from 'lodash';

const useAnotherDriver = (location) => {
    const driverIndex = _.get(location, 'state.driverIndex', 0);
    const isMultiCarFlag = _.get(location, 'state.multiFlag', false);
    const isPolicyHolder = _.get(location, 'state.isPolicyHolder', true);
    const isAnotherDriver = !isPolicyHolder;
    const isAnotherDriverMulti = isMultiCarFlag;
    const driverFixedId = _.get(location, 'state.fixedId', '');
    return [driverIndex, isAnotherDriver, isAnotherDriverMulti, driverFixedId, isMultiCarFlag, isPolicyHolder];
};

export default useAnotherDriver;
