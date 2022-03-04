import _ from 'lodash';

const initializeResponsiveObserver = (observerCallback, observerOptions, targetRef, initializationGuard) => {
    let observer;

    const initObserver = () => {
        if (!targetRef.current) return null;
        const newObserver = new IntersectionObserver(
            observerCallback,
            typeof observerOptions === 'function' ? observerOptions() : observerOptions
        );
        newObserver.observe(targetRef.current);
        return newObserver;
    };
    const handleResize = () => {
        if (observer) observer.disconnect();
        if (!initializationGuard || initializationGuard()) {
            observer = initObserver();
        }
    };
    const handleResizeDebounce = _.debounce(handleResize, 200);

    handleResize();
    window.addEventListener('resize', handleResizeDebounce);

    return () => {
        if (observer) observer.disconnect();
        window.removeEventListener('resize', handleResizeDebounce);
    };
};

export default initializeResponsiveObserver;
