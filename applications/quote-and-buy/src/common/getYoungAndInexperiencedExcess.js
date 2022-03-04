import _ from 'lodash';

const youngInexperiencedDriverExcess = (driversList) => {
    let excessValue = 0;
    _.each(driversList, (driver) => {
        if (driver.isPolicyHolder) {
            excessValue = driver.youngInexperiencedDriverExcess ? driver.youngInexperiencedDriverExcess.amount : 0;
        }
    });
    return excessValue;
};

export default youngInexperiencedDriverExcess;
