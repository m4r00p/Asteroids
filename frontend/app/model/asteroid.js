app.core.Object.define("app.model.Asteroid", {
    extend: app.model.Shape,
    constructor: function (x, y) {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor

        this.__x = x;
        this.__y = y;
    },
    statics: {},
    members: {
        __initVertices: [{x: -30, y: -20}, {x: -35, y: 0}, {x: -30, y: 20}, {x: -20, y: 20},  {x: -10, y: 30},
            {x: 20, y: 20}, {x: 25, y: 5}, {x: 20, y: -20}, {x: 10, y: -15}, {x: 0, y: -30}],
        __vertices: null,

        __x: null,
        __y: null,

        type: 1

    }
});
