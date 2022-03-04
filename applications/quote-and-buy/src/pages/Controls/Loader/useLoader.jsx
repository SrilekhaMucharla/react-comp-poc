import React from 'react';
import ReactDOM from 'react-dom';
import { HDLoader } from 'hastings-components';

export default function useLoader(props) {
    const [isLoading, setIsLoading] = React.useState(false);

    return [
        isLoading ? ReactDOM.createPortal(
            <HDLoader {...props} />,
            document.getElementById('portal-root')
        ) : null,
        () => setIsLoading(true),
        () => setIsLoading(false)];
}
