
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { useCookies } from 'react-cookie';
import { monetateApi, setNavigation } from '../../redux-thunk/actions';
import * as monetateHelper from '../../common/monetateHelper';

import HastingsInterstitialPageHelper from '../../pages/HastingsInterstitialPageContainer/HastingsInterstitialPageHelper';
import { PRODUCER_CODE } from '../../constant/const';
import { producerCodeList } from '../../common/producerCodeHelper';

const useMonetateTracking = (param) => {
    const dispatch = useDispatch();
    const [cookies, setCookie] = useCookies(['']);
    const [initial, setInitial] = useState(true);
    let producerCode = PRODUCER_CODE;
    let paramValues;

    useEffect(() => {
        if (param && param.search) {
            paramValues = param.search;
            const parsedParams = HastingsInterstitialPageHelper.parseQueryParams(paramValues);
            producerCode = parsedParams && parsedParams.producerCode;
            if (producerCode === 'Default' || _.includes(producerCodeList, producerCode)) {
                producerCode = PRODUCER_CODE;
            }
            dispatch(setNavigation({
                pcwName: producerCode || PRODUCER_CODE
            }));
        }
        if (initial) {
            setInitial(false);
            dispatch(setNavigation({
                pcwName: producerCode || PRODUCER_CODE
            }));
            dispatch(monetateApi(cookies, producerCode));
        }
    }, []);
};

export default useMonetateTracking;
