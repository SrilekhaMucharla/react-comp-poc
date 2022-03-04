export default (
    reviewsBagdeId,
    size
) => {
    document.getElementById('badge-horizontal').innerHTML = null;
    document.getElementById('badge-vertical').innerHTML = null;
    const { reviewsBadgeRibbon, reviewsBadgeModern } = window;

    if (reviewsBadgeRibbon) {
        reviewsBadgeRibbon('badge-horizontal', {
            store: 'gc-hastingsdirect',
            size
        });
    }
    if (reviewsBadgeModern) {
        reviewsBadgeModern('badge-vertical', {
            store: 'gc-hastingsdirect',
            primaryClr: '#000000',
            starsClr: '#ff7849'
        });
    }
};
