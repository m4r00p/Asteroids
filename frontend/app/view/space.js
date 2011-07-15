app.core.Object.define("app.view.Space", {
    extend: app.core.Object,
    constructor: function () {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor

        this.__append();
        this.__shapes = [];
    },
    statics: {},
    members: {
        __ctx: null,
        __canvas: null,
        __shapes: null,
        __height: null,
        __width: null,

        __time: 0,
        __counter: 0,
        __fps: 9999,

        __score: 0,

        increaseScore: function (number) {
           this.__score += number;
        },

        __onResize: function () {
            var win = this.getWindow();

            this.__canvas.width  = this.__width  = win.innerWidth;
            this.__canvas.height = this.__height = win.innerHeight;
        },

        __drawFps: function (count, n) {
            var ctx = this.__ctx;

            if (Date.now() > this.__time + 1000) {

                this.__fps     = this.__counter;
                this.__time    = Date.now();
                this.__counter = 0;

            } else {
                this.__counter += 1;
            }

            ctx.fillStyle = "white";
            ctx.font      = "bold 16px Arial";
            ctx.fillText("Fps: " + this.__fps, 6, 16);
            ctx.fill();
            ctx.fillText("Objs: " + this.__shapes.length, 6, 36);
            ctx.fill();
            ctx.fillText("Score: " + this.__score, 6, 56);
            ctx.fill();
            ctx.fillText("Tests: " + count + "/" + (n*(n-1)), 6, 76);
            ctx.fill();
        },

        __append: function () {
            var win = this.getWindow(),
            doc     = this.getDocument(),
            space   = doc.createElement('canvas'),
            ctx     = space.getContext("2d");

            doc.body.style.cssText += "overflow: hidden;";

            this.__ctx    = ctx;
            this.__canvas = space;

            space.width  = this.__width  = 500;//= win.innerWidth;
            space.height = this.__height = 500;//= win.innerHeight;

            //win.addEventListener("resize", this.__onResize.bind(this), false);

            doc.body.insertBefore(space, doc.body.firstChild);
        },

        getBoundaries: function () {
           return [0, 0, this.__width, this.__height];
        },

        addShape: function (shape) {
            this.__shapes.push(shape);
        },

        removeShape: function (model) {
           var shapes = this.__shapes;

            for (var i = 0, len = shapes.length, shape, index; i < len; i++) {
                shape = shapes[i];

                if (shape && shape.__model == model) {
                    index =  shapes.indexOf(shape);

                    shapes.splice(index, 1);
                }
            }
        },

        render: function (count, n) {
            var shape,
                shapes = this.__shapes,
                ctx    = this.__ctx;

            ctx.clearRect(0, 0, this.__width, this.__height);
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, this.__width, this.__height);

            this.__drawFps(count, n);

            for (var i = 0, len = shapes.length; i < len; i++) {
                shape = shapes[i];
                shape.render(ctx);
            }

        }
    }
});
