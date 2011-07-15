app.core.Object.define("app.model.Bullet", {
    extend: app.model.Shape,
    constructor: function (position, velocity, rotation) {
        this.__vertices =  [
            vec3.create([-1, -1, 0]),
            vec3.create([-1, 1, 0]),
            vec3.create([1, 1, 0]),
            vec3.create([1, -1, 0])];

        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor
    },
    statics: {},
    members: {
        __vertices: null,
        __position: null,
        __velocity: null,
        __rotation: null,

        type: 2
    }
});
