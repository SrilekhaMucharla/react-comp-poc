import PropTypes from 'prop-types';

// please add more fields if needed
// reference these propTypes from within your pages
// this will serve as source of truth for api objects

const dateParts = {
    year: PropTypes.number,
    month: PropTypes.number,
    day: PropTypes.number
};

export const driverProps = {
    fixedId: PropTypes.number,
    publicID: PropTypes.string,
    person: PropTypes.shape({}),
    displayName: PropTypes.string,
    dateOfBirth: dateParts,
    isPolicyHolder: PropTypes.bool,
    isPolicyOwner: PropTypes.bool,
};

const vehicle = {
    fixedId: PropTypes.number,
    publicID: PropTypes.string,
    registrationsNumber: PropTypes.string,
    make: PropTypes.string,
    model: PropTypes.string,
    displayName: PropTypes.string
};

const brandCodes = ['HE', 'HD', 'HP', 'YD'];

const brandNames = ['Hastings Essential', 'Hastings Direct', 'Hastings Premium', 'YouDrive'];

const quote = {
    quoteID: PropTypes.string,
    sessionUUID: PropTypes.string,
    baseData: PropTypes.shape({
        accountHolder: PropTypes.shape({}),
        brandCode: PropTypes.oneOf(brandCodes),
        policyAddress: PropTypes.shape({}),
        periodStartDate: PropTypes.shape(dateParts),
        periodEndDate: PropTypes.shape(dateParts),
    }),
    lobData: PropTypes.shape({
        privateCar: PropTypes.shape({
            coverables: PropTypes.shape({
                drivers: PropTypes.arrayOf(PropTypes.shape(driverProps)),
                vehicles: PropTypes.arrayOf(PropTypes.shape(vehicle)),
                vehicleDrivers: PropTypes.arrayOf(
                    PropTypes.shape({
                        driverID: driverProps.fixedId,
                        vehicleID: vehicle.fixedId
                    })
                )
            }),
            offerings: PropTypes.arrayOf(
                PropTypes.shape({
                    branchName: PropTypes.oneOf(brandNames),
                    branchCode: PropTypes.oneOf(brandCodes),
                    coverages: PropTypes.shape({
                        vehicleCoverages: PropTypes.arrayOf(PropTypes.shape({
                            publicID: PropTypes.string,
                            fixedID: PropTypes.number,
                            vehicleName: PropTypes.string,
                            coverages: PropTypes.arrayOf(PropTypes.shape({
                                name: PropTypes.string,
                                updated: PropTypes.bool,
                                terms: PropTypes.arrayOf(PropTypes.shape({
                                    publicID: PropTypes.string,
                                    type: PropTypes.string,
                                    drivectValue: PropTypes.number,
                                    chosenTerm: PropTypes.string,
                                    chosenTermValue: PropTypes.string
                                }))
                            }))
                        })),
                        ancillaryCoverages: PropTypes.arrayOf()
                    })
                })
            )
        }),
    }),
};

const paymentSchedule = {
    loading: PropTypes.bool,
    mcPaymentScheduleError: PropTypes.shape({}),
    mcPaymentScheduleObject: PropTypes.arrayOf(PropTypes.shape({
        submissionID: PropTypes.string,
        paymentSchedule: PropTypes.arrayOf(PropTypes.shape({
            paymentAmount: PropTypes.shape({
                currency: PropTypes.oneOf(['gbp', 'usd']),
                amount: PropTypes.number
            }),
            paymentDate: PropTypes.shape({
                month: PropTypes.number,
                year: PropTypes.number,
                day: PropTypes.number
            })
        }))
    })),
};

export const excessPropTypes = {
    excessName: PropTypes.string.isRequired,
    voluntaryAmount: PropTypes.number.isRequired,
    compulsoryAmount: PropTypes.number.isRequired,
};

export const mcSubmissionPropTypes = {
    value: PropTypes.shape({
        mpwrapperNumber: PropTypes.string,
        mpwrapperJobNumber: PropTypes.string,
        sessionUUID: PropTypes.string,
        quotes: PropTypes.arrayOf(PropTypes.shape(quote))
    })
};

export const paymentSchedulePropTypes = paymentSchedule;
export const submissionPropTypes = quote;

export const pageMetadataPropTypes = {
    page_name: PropTypes.string.isRequired,
    page_type: PropTypes.string.isRequired,
    sales_journey_type: PropTypes.string.isRequired
};

export const formikPropTypes = {
    errors: PropTypes.shape({}).isRequired,
    values: PropTypes.shape({}).isRequired,
    setFieldValue: PropTypes.func.isRequired,
    touched: PropTypes.shape({}).isRequired,
    handleBlur: PropTypes.func.isRequired
};
