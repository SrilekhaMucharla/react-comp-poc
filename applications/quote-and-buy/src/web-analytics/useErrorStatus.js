import { useSelector } from 'react-redux';

const useErrorStatus = () => {
    const err = useSelector((state) => state?.errorStatus?.errorStatusCode);
    return err;
};

export default useErrorStatus;
