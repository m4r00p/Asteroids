app.core.Object.define("app.controller.Rocket", {
    extend: app.core.Object,
    constructor: function (model, view) {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor

        this.__model = model;
        this.__view  = view;
    },
    statics: {},
    members: {
        __model: null,
        __view: null,

        dispatch: function (event) {
            if (event) {
                switch (event[1]) {
                    case app.event.Object.LEFT:
                        this.__model.changeOrientation(5);
                        break;
                    case app.event.Object.RIGHT:
                        this.__model.changeOrientation(-5);
                        break;
                    case app.event.Object.UP:
                        this.__model.increaseVelocity();
                        break;
                }
            }
        }
    }
});
