app.core.Object.define("app.view.Shape", {
    extend: app.core.Object,
    constructor: function (model) {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor

        this.__model = model;
    },
    statics: {},
    members: {
        __model: null,

        render: function (ctx) {
            var current, next, vertices = this.__model.getVertices();

            ctx.beginPath();
            ctx.strokeStyle = 'white';


            for (var i = 0, len = vertices.length; i < len; i++) {
                current = vertices[i];
                next    = (i === len - 1) ? vertices[0] : vertices[i + 1];

                
                ctx.moveTo(
                    current[0],
                    current[1]
                );
                ctx.lineTo(
                    next[0],
                    next[1]
                );
            }

            ctx.stroke();
        }
    }
});
