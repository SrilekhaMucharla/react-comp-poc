import { useEffect } from 'react';

const useScrollToTop = (pathname) => {
    useEffect(() => {
        window.scroll(0, 0);
    }, [pathname]);
};

export default useScrollToTop;
