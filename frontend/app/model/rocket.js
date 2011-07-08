app.core.Object.define("app.model.Rocket", {
    extend: app.model.Shape,
    constructor: function (x, y) {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor

        this.__radius = 5;
    },
    statics: {},
    members: {
        __initVertices: [{x: 0, y: -10}, {x: -8, y: 10}, {x: 0, y: 6}, {x: 8, y: 10}],
        __vertices: null,

        __x: null,
        __y: null,

        __size: null,

        type: 3
    }
});
