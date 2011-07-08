app.core.Object.define("app.event.Keyboard", {
    extend: app.event.Object,
    constructor: function () {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor

        this.__queue = [];

        this.__init();
    },
    statics: {},
    members: {
        __interval: null,
        __queue: null,
        __last: null,

        __init: function () {
            var window = this.getWindow();
            window.addEventListener("keydown", this.__onKeyDown.bind(this), false);

        },

        __onKeyDown: function (event) {
            this.__push(this.__map(event));

            event.stopPropagation();
        },

        loop: function () {
            var queue  = this.__queue;
            var time   = +new Date();
            var last   = queue[queue.length - 1];

            if (last && last[2] && (time - last[2] < 25)) {
                if (last != this.__last) {
                    this._last = last;
                    this.fireDataEvent("press", last);
                }
            }
            else {
                this.__queue = [];
            }

        },

        __push: function (item) {
            var queue  = this.__queue;

            queue.push(item);

            if (queue.length > 10) {
                queue.shift();
            }
        },

        __map: function (keyboardEvent) {
            var eventCode;

            switch (keyboardEvent.keyCode) {
                case 37:
                    eventCode = app.event.Object.LEFT;
                    break;
                case 38:
                    eventCode = app.event.Object.UP;
                    break;
                case 39:
                    eventCode = app.event.Object.RIGHT;
                    break;
                case 40:
                    eventCode = app.event.Object.DOWN;
                    break;
                case 87:
                case 83:
                case 81:
                case 65:
                    eventCode = app.event.Object.FIRE;
                    break;

            }

            return [keyboardEvent.type, eventCode, +new Date()];
        }
    }
});
