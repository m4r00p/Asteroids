app.core.Object.define("app.model.Rocket", {
    extend: app.model.Shape,
    constructor: function (position) {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor

        this.__radius = 5;
    },
    statics: {},
    members: {
        __vertices: [
            vec3.create([0,-10, 0]),
            vec3.create([-8, 10, 0]),
            vec3.create([0, 6, 0]),
            vec3.create([8, 10, 0])],

        __position: null,
        __velocity: null,
        __rotation: null,

        type: 3
    }
});
