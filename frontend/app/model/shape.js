app.core.Object.define("app.model.Shape", {
    extend: app.core.Object,
    constructor: function (position, velocity, rotation) {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor

        this.__position = position || vec3.create();
        this.__velocity = velocity || vec3.create();
        this.__rotation = rotation || 0;

        this.__forceAccumulator = vec3.create();
        this.__angle = this.__rotation || -90;

        this.__direction = vec3.create([
            Math.cos(this.__angle * Math.PI/180),
            Math.sin(this.__angle * Math.PI/180),
            0
        ]);

        this.__init();
    },
    statics: {},
    members: {
        __vertices: null,

        __boundingBox: null,

        __position: null,
        __velocity: null,
        __rotation: null,
        __direction: null,

        __inverseMass: 1,

        __init: function () {
            this.__createBoundingBox();
        },

        __forceAccumulator: null,

        __createBoundingBox: function () {
           this.__boundingBox = ritterSphere(this.__vertices);
        },

        rotate: function (angle) {
            var vertices = this.__vertices,
                cos      = Math.cos(angle * Math.PI/180),
                sin      = Math.sin(angle * Math.PI/180);

            this.__angle += angle;
            this.__angle = this.__angle % 360;

            for (var x, y, i = 0, len = vertices.length, vertex; i < len; i++) {
                vertex = vertices[i];

                x = vertex[0];
                y = vertex[1];

                vertex[0] = (cos * x) - (sin * y);
                vertex[1] = (sin * x) + (cos * y);
            }
        },

        changeDirection: function (angle) {
            this.rotate(angle);
        },

        increaseVelocity: function () {
            var velocity  = this.__velocity,
                direction = vec3.create([
            Math.cos(this.__angle * Math.PI/180),
            Math.sin(this.__angle * Math.PI/180),
            0
        ]);

            vec3.scale(direction, 16.6/1000);
            vec3.add(velocity, direction);

        },

        integrate: function (duration) {
           vec3.add(this.__position,
               vec3.scale(this.__velocity, duration, vec3.create()));

            //reposition bounding box
            this.__boundingBox.c[0] = this.__position[0];
            this.__boundingBox.c[1] = this.__position[1];

        },

        setVelocity: function (value) {
            this.__velocity = value;
        },

        getVelocity: function (value) {
            return this.__velocity;
        },

        setX: function (value) {
            this.__position[0] = value;
        },

        setY: function (value) {
            this.__position[1]= value;
        },

        getX: function () {
            return this.__position[0];
        },

        getY: function () {
            return this.__position[1];
        },

        getVertices: function () {
            return this.__vertices;
        },

        createBullet: function () {
            var vertex = this.__vertices[0],
            direction = vec3.create([
                Math.cos(this.__angle * Math.PI/180),
                Math.sin(this.__angle * Math.PI/180),
                0
            ]),
            velocity = vec3.scale(direction, 0.25);

            vec3.add(velocity, this.__velocity);

            return new app.model.Bullet(
                vec3.create([
                    vertex[0] + this.getX(),
                    vertex[1] + this.getY(), 0]),
                velocity,
                0);
        },

        destroy: function () {
            //TODO destroy asteroid
//            var junks = [],
//            size      = this.__size - 1,
//            speed = this.__speed,
//            rotate = this.__rotate,
//            angle = this.__angle,
//            x = this.__x,
//            y = this.__y;

//            if (this.type === 1 && size > 0) {
                // asteroid and not smallest
//                junks.push(new app.model.Asteroid(x, y, angle + Math.random() * 90, speed * 1.75, rotate, size));
//                junks.push(new app.model.Asteroid(x, y, angle + 90 + Math.random() * 90, speed * 1.75, -rotate, size));
//                junks.push(new app.model.Asteroid(x, y, angle + 180 + Math.random() * 180, speed * 1.75, rotate, size));
//            }

//            return junks;
        }
    }
});
