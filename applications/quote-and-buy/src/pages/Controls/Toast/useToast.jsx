import React, {
    useState, useCallback, useEffect, useMemo
} from 'react';
import ReactDOM from 'react-dom';
import { HDToast } from 'hastings-components';
import useTrackOnToastAdd from '../../../web-analytics/trackOnToastAdd';

export default function useToast({ position = 'top-right', delay = 3000, onToastAdd = null } = { position: 'top-right', delay: 3000, onToastAdd: null }) {
    const [toastList, setToastList] = useState([]);
    const portalRoot = useMemo(() => document.getElementById('portal-root'), []);
    const trackOnToastAdd = useTrackOnToastAdd();

    useEffect(() => {
        if (toastList.length > 0) {
            const timer = setTimeout(() => {
                setToastList((toasts) => toasts.slice(1));
            }, delay);

            return () => clearTimeout(timer);
        }

        return () => null;
    }, [toastList]);

    const addToast = useCallback((toast) => {
        if (Array.isArray(toast)) {
            setToastList(toast);
            toast.forEach(trackOnToastAdd);
        } else {
            setToastList([...toastList, toast]);
            trackOnToastAdd(toast);
        }

        if (onToastAdd) {
            onToastAdd(toast);
        }
    }, [toastList, trackOnToastAdd]);

    return [
        toastList.length > 0 ? ReactDOM.createPortal(
            <HDToast toastList={toastList} position={position} />,
            portalRoot
        ) : null,
        addToast
    ];
}
