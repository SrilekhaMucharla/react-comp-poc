import { fetchSavingsPromotional } from './downloadFile/helpers';
import {
    hastingsRoot,
    MC_HARDSELL_JSON
} from '../constant/const';

// hardsell mc savings
const fetchPromotionalSavings = () => {
    const origin = window.location.origin ? window.location.origin : hastingsRoot;
    return fetchSavingsPromotional(`${origin}${MC_HARDSELL_JSON}`);
};

export default fetchPromotionalSavings;
