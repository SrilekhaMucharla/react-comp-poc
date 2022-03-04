import Axios from 'axios';
import fileDownload from 'js-file-download';
import {
    hastingsRoot,
    YOU_DRIVE,
    MC_HARDSELL_JSON
} from '../../constant/const';
import {
    isSafariAndiOS
} from '../utils';


// check inception date is greater/less than 2020, 11, 9
export const dateCheckBeforeORAfter = (inceptionDate, brand) => {
    const d1 = new Date(2022, 1, 15);
    const d2 = new Date(inceptionDate.year, inceptionDate.month, inceptionDate.day);
    const youDriveDate = new Date(2022, 2, 17);
    if (brand === YOU_DRIVE) {
        return youDriveDate > d2;
    }
    return d1 > d2;
};

export const getFilename = (url) => {
    const lastSlash = url.lastIndexOf('/');
    return url.substring(lastSlash + 1);
};

// file download from handlePolicyBookletDownloadFile
export const downloadFile = (url) => {
    if (isSafariAndiOS()) {
        window.open(url, '_blank');
    } else {
        const fileName = getFilename(url);
        Axios.get(url, {
            responseType: 'blob',
        }).then((res) => {
            fileDownload(res.data, fileName);
        });
    }
};

export const fetchSavingsPromotional = () => {
    const origin = window.location.origin ? window.location.origin : hastingsRoot;
    const url = `${origin}${MC_HARDSELL_JSON}`;
    const header = {
        'Content-Type': 'application/json',
        'Clear-Site-Data': '*',
        'max-http-header-size': 80000
    };
    return Axios.get(url, { headers: header });
};
