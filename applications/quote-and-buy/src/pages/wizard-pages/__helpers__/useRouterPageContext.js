import _ from 'lodash';

const useRouterPageContext = (location) => {
    const routerPageContext = _.get(location, 'state.routerPageContext', {});
    return routerPageContext;
};

export default useRouterPageContext;
