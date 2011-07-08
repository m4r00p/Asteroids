app.core.Object.define("app.model.Shape", {
    extend: app.core.Object,
    constructor: function (position, velocity, rotation, size) {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor

        this.__position = position;
        this.__velocity = velocity;

        this.__size  = size || 5;

        this.__rotation = rotation || 0;

        this.__init();
    },
    statics: {},
    members: {
        __vertices: [
            vec3.create([-10, -10, 0]),
            vec3.create([-10, 10, 0]),
            vec3.create([10, 10, 0]),
            vec3.create([10, -10, 0])],

        __boundingBox: null,

        __position: null,
        __velocity: null,
        __rotation: null,

        __size: null,

        __init: function () {
            var x = this.__x,
                y = this.__y,
                size = this.__size,
                initVertices = this.__initVertices,
                vertices = this.__vertices = [];

            for (var i = 0, len = initVertices.length, vertex; i < len; i++) {
                vertex = initVertices[i];
                vertices.push(vec3.create([
                   x + size/5 * vertex[0],
                   y + size/5 * vertex[1],
                   0
               ]));
            }

            this.__radius = 25 * size/5;

            this.__speedX = this.__speed * Math.sin(this.__direction);
            this.__speedY = this.__speed * Math.cos(this.__direction);

            this.__createBoundingBox();
        },

        __createBoundingBox: function () {
           //TODO
        },

        rotate: function (angle) {
            var vertices = this.__vertices,
                cos      = Math.cos(angle * Math.PI/180),
                sin      = Math.sin(angle * Math.PI/180),
                xOrigin  = this.__x,
                yOrigin  = this.__y;

            this.__angle += angle;

            for (var x, y, i = 0, len = vertices.length, vertex; i < len; i++) {
                vertex = vertices[i];

                x = vertex[0];
                y = vertex[1];

                vertex[0] = (cos * (x - xOrigin)) - (sin * (y - yOrigin)) + xOrigin;
                vertex[1] = (sin * (x - xOrigin)) + (cos * (y - yOrigin)) + yOrigin;
            }
        },

        changeDirection: function (angle) {
            this.__direction -= angle * Math.PI/180;
        },

        increaseSpeed: function () {
            var speed = 10,
                speedX, speedY,
                abs = Math.abs;

            speedX = speed * Math.sin(this.__direction);
            speedY = speed * Math.cos(this.__direction);

            if (abs(this.__speedX + speedX) < 100) {
                this.__speedX += speedX;
            }

            if (abs(this.__speedY + speedY) < 100) {
                this.__speedY += speedY;
            }
        },

        move: function (time) {
            var vertices = this.__vertices,
            dx = this.__speedX * time,
            dy = this.__speedY * time;


            this.__x -= dx;
            this.__y -= dy;

            for (var i = 0, len = vertices.length, vertex; i < len; i++) {
                vertex = vertices[i];

                vertex[0] -= dx;
                vertex[1] -= dy;
            }

            if (this.__rotate) {
                this.rotate(this.__rotate);
            }
        },

        setX: function (value) {

            var vertices = this.__vertices,
            dx = value - this.__x;

            this.__x = value;

            for (var i = 0, len = vertices.length, vertex; i < len; i++) {
                vertex = vertices[i];

                vertex[0] += dx;
            }
        },

        setY: function (value) {

            var vertices = this.__vertices,
            dy = value - this.__y;

            this.__y = value;

            for (var i = 0, len = vertices.length, vertex; i < len; i++) {
                vertex = vertices[i];

                vertex[1] += dy;
            }
        },

        getX: function () {
            return this.__x;
        },

        getY: function () {
            return this.__y;
        },

        getSize: function () {
            return this.__size;
        },

        getDirection: function () {
            return this.__direction;
        },

        setDirection: function (value) {
            this.__direction = value;
        },

        getRadius: function () {
            return this.__radius;
        },

        getVertices: function () {
            return this.__vertices;
        },

        createBullet: function () {
            var vertex = this.__vertices[0];

            return new app.model.Bullet(vertex[0], vertex[1], this.__angle, 200);
        },

        destroy: function () {
            var junks = [],
            size      = this.__size - 1,
            speed = this.__speed,
            rotate = this.__rotate,
            angle = this.__angle,
            x = this.__x,
            y = this.__y;

            if (this.type === 1 && size > 0) {
                // asteroid and not smallest
                junks.push(new app.model.Asteroid(x, y, angle + Math.random() * 90, speed * 1.75, rotate, size));
                junks.push(new app.model.Asteroid(x, y, angle + 90 + Math.random() * 90, speed * 1.75, -rotate, size));
                junks.push(new app.model.Asteroid(x, y, angle + 180 + Math.random() * 180, speed * 1.75, rotate, size));
            }

            return junks;
        }
    }
});
