import React from 'react';
import mountWithSubmissionVM from '../../__helpers__/test/mountWithSubmissionVM';
import HDDriverDOBPage from '../HDDriverDOBPage';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({})
}));

describe('<HDDriverDOBPage />', () => {
    createPortalRoot();

    const getWrapper = () => mountWithSubmissionVM(
        <HDDriverDOBPage />,
        [],
        [],
        {},
        {
            app: {
                pages: {
                    drivers: {
                        0: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false, licenceDataChanged: false },
                    }
                }
            },
        }
    );
    it('should render the component and match snapshot', async () => {
        const wrapper = await getWrapper();
        expect(wrapper).toMatchSnapshot();
    });
});
