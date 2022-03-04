const mapPaymentToText = (payment, i) => {
    return `£${payment.amount} ${i !== 0 ? `on ${payment.dueDate}` : payment.dueDate}`;
};

const getDeferText = (payments) => {
    const lastIndex = payments.length - 1;

    return [
        payments.slice(0, lastIndex).map(mapPaymentToText).join(', '),
        mapPaymentToText(payments[lastIndex])
    ].join(' and ');
};

export default getDeferText;
