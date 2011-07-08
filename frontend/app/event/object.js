app.core.Object.define("app.event.Object", {
    extend: app.core.Object,
    constructor: function () {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor
    },
    statics: {
        LEFT  : 1,
        RIGHT : 2,
        UP    : 3,
        DOWN  : 4,

        FIRE : 5
    },
    members: {}
});

