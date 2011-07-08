app.core.Object.define("app.model.Bullet", {
    extend: app.model.Shape,
    constructor: function (position) {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor

        this.__radius = 2;
        this.__position = position;
    },
    statics: {},
    members: {
        __vertices: [
            vec3.create([-1, -1, 0]),
            vec3.create([-1, 1, 0]),
            vec3.create([1, 1, 0]),
            vec3.create([1, -1, 0])],

        __position: null,
        __velocity: null,
        __rotation: null,

        type: 2
    }
});
