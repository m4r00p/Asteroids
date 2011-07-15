app.core.Object.define("app.model.Rocket", {
    extend: app.model.Shape,
    constructor: function (position, velocity, rotation) {
        this.__vertices =  [
            vec3.create([0,-10, 0]),
            vec3.create([-8, 10, 0]),
            vec3.create([0, 6, 0]),
            vec3.create([8, 10, 0])];

        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor
    },
    statics: {},
    members: {
        __vertices: null,
        __position: null,
        __velocity: null,
        __rotation: null,

        type: 3
    }
});
