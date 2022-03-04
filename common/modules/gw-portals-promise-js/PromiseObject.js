export const PROMISE_STATES = {
    pending: 'pending',
    resolved: 'resolved',
    rejected: 'rejected'
};

export default function initiatePromiseObject() {
    const returningPromise = {
        state: PROMISE_STATES.pending
    };

    returningPromise.promise = new Promise((resolveFn, rejectFn) => {
        returningPromise.resolve = resolveFn;
        returningPromise.reject = rejectFn;
    }).then((retValue) => {
        returningPromise.state = PROMISE_STATES.resolved;
        return retValue;
    }).catch((err) => {
        returningPromise.state = PROMISE_STATES.rejected;
        throw err;
    });

    return returningPromise;
}
