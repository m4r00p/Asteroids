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
                        this.rotateLeft();
                        break;
                    case app.event.Object.RIGHT:
                        this.rotateRight();
                        break;
                    case app.event.Object.UP:
                        this.move();
                        break;
                }
            }
        },

        rotateLeft: function () {
            this.__model.rotate(-15);
            this.__model.changeDirection(-15);
        },

        rotateRight: function () {
            this.__model.rotate(15);
            this.__model.changeDirection(15);
        },

        move: function () {
            this.__model.increaseSpeed();
        }
    }
});
