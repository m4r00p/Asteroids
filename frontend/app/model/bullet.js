app.core.Object.define("app.model.Bullet", {
    extend: app.model.Shape,
    constructor: function (x, y) {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor

        this.__radius = 2;
    },
    statics: {},
    members: {
        __initVertices: [{x: -1, y: -1}, {x: -1, y: 1}, {x: 1, y: 1}, {x: 1, y: -1}],
        __vertices: null,

        __x: null,
        __y: null,

        __size: null,

        type: 2
    }
});
