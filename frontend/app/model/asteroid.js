app.core.Object.define("app.model.Asteroid", {
    extend: app.model.Shape,
    constructor: function (position) {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor

        this.__position = position;
    },
    statics: {},
    members: {
        __vertices: [
            vec3.create([-30, -20, 0]),
            vec3.create([-35, 0, 0]),
            vec3.create([-30, 20, 0]),
            vec3.create([-20, 20, 0]),
            vec3.create([-10, 30, 0]),
            vec3.create([20, 20, 0]),
            vec3.create([25, 5, 0]),
            vec3.create([20, -20, 0]),
            vec3.create([10, -15, 0]),
            vec3.create([0, -30, 0])],

        __position: null,
        __velocity: null,
        __rotation: null,

        __size: null,

        type: 1

    }
});
