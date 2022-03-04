import { downloadFile, dateCheckBeforeORAfter } from './helpers';
import {
    singleCarHPBefore2020, singleCarHDBefore2020,
    singleCarHEBefore2020, singleCarYDBefore2020,
    singleCarAdditionalProductBefore2020, singleCarHPAfter2020,
    singleCarHDAfter2020, singleCarHEAfter2020,
    singleCarYDAfter2020, singleCarAdditionalProductAfter2020,
    HASTINGS_ESSENTIAL,
    HASTINGS_DIRECT,
    HASTINGS_PREMIER,
    YOU_DRIVE,
    ADDITIONAL_PRODUCT,
    hastingsRoot
} from '../../constant/const';
// handle hard coded file download
const handlePolicyBookletDownloadFile = (brand, date) => {
    const origin = window.location.origin ? window.location.origin : hastingsRoot;
    if (dateCheckBeforeORAfter(date, brand)) {
        switch (brand) {
            case HASTINGS_DIRECT:
                downloadFile(`${origin}${singleCarHDBefore2020}`);
                break;
            case HASTINGS_ESSENTIAL:
                downloadFile(`${origin}${singleCarHEBefore2020}`);
                break;
            case HASTINGS_PREMIER:
                downloadFile(`${origin}${singleCarHPBefore2020}`);
                break;
            case YOU_DRIVE:
                downloadFile(`${origin}${singleCarYDBefore2020}`);
                break;
            case ADDITIONAL_PRODUCT:
                downloadFile(`${origin}${singleCarAdditionalProductBefore2020}`);
                break;
            default:
                break;
        }
    } else {
        switch (brand) {
            case HASTINGS_DIRECT:
                downloadFile(`${origin}${singleCarHDAfter2020}`);
                break;
            case HASTINGS_ESSENTIAL:
                downloadFile(`${origin}${singleCarHEAfter2020}`);
                break;
            case HASTINGS_PREMIER:
                downloadFile(`${origin}${singleCarHPAfter2020}`);
                break;
            case YOU_DRIVE:
                downloadFile(`${origin}${singleCarYDAfter2020}`);
                break;
            case ADDITIONAL_PRODUCT:
                downloadFile(`${origin}${singleCarAdditionalProductAfter2020}`);
                break;
            default:
                break;
        }
    }
};

export default handlePolicyBookletDownloadFile;
