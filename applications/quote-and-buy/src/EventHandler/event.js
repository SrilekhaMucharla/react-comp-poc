const EventEmmiter = {
    events: {},
    dispatch: function (event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach((callback) => callback(data));
    },
    subscribe: function (event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    },
    unsubscribe: function (event, callback) {
        if (!this.events[event]) this.events[event] = [];
        // eslint-disable-next-line no-bitwise
        this.events[event].splice(this.events[event].indexOf(callback) >>> 0, 1);
    }
};
export default EventEmmiter;
