import { useStore } from 'react-redux';

const useMultiCarJourney = () => {
    const store = useStore().getState();
    const flag = store.wizardState.app.multiCarFlag;
    return flag;
};

export default useMultiCarJourney;
