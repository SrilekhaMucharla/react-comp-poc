import React, { useState, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { HDFullscreenLoader, HDSpinner, HDOverlay } from 'hastings-components';

export default function useFullscreenLoader(delayMs = 1000) {
    const [isLoading, setIsLoading] = useState(false);
    const timerRef = useRef();
    const portalRoot = useMemo(() => document.getElementById('portal-root'), []);

    const startLoading = () => {
        clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            setIsLoading(true);
        }, delayMs);
    };

    const stopLoading = () => {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;

        setIsLoading(false);
    };

    return [
        isLoading
            ? ReactDOM.createPortal(
                <HDFullscreenLoader
                    text="We're working on it..."
                    overlay={<HDOverlay opacity={0.9} bgColor="#011831" animationDuration={0.5} />}
                    spinner={<HDSpinner type="color" diameter={300} />} />,
                portalRoot
            ) : null,
        () => startLoading(),
        () => stopLoading()];
}
