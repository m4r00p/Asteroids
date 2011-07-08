app.core.Object.define("app.controller.Game", {
    extend: app.core.Object,
    constructor: function (model, view) {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor

        this.__asteroids = [];
    },
    statics: {},
    members: {
        __space: null,

        __end: false,

        __time: null,
        __rocket: null,
        __objects: null,
        __fireDelay: null,

        __keyboard: null,

        __rand: function (min, max) {
            if (min < 0) {
                max -= min;
            }

            return min + Math.random() * max;
        },

        __createAsteroid: function (number) {
            var object, objects = this.__objects,
                boundaries = this.__space.getBoundaries(),
                minX = boundaries[0],
                minY = boundaries[1],
                maxX = boundaries[2],
                maxY = boundaries[3],
                space = this.__space;

            for (var i = 0; i < number; i++) {
                object = new app.model.Asteroid(
                    this.__rand(minX + 20, maxX - 20),
                    this.__rand(minY + 20, maxY - 20),
                    this.__rand(0, 360),
                    this.__rand(5, 20),
                    this.__rand(1, 5),
                    5
                );

                objects.push(object);
                space.addShape(new app.view.Shape(object));
            }

        },

        __createSpace: function () {
            this.__space = new app.view.Space();
        },

        __createRocket: function (mine) {
            var rocketModel      = new app.model.Rocket(200, 200);
            var rocketController = new app.controller.Rocket(rocketModel);
            var space            = this.__space;

            mine = mine || true;

            this.__objects.push(rocketModel);
            this.__rocketController = rocketController;

            space.addShape(new app.view.Shape(rocketModel));
        },

        __registerEvent: function () {
            var keyboard = new app.event.Keyboard();
            keyboard.addListener("press", this.__rocketController.dispatch, this.__rocketController);
            keyboard.addListener("press", this.__dispatch, this);

            this.__keyboard = keyboard;
        },

        run: function () {
            this.__objects = [];

            this.__createSpace();

            this.__createRocket();

            this.__createAsteroid(3);

            this.__registerEvent();

            this.addListener("collision", this.__onCollision, this);

            this.__time = Date.now() / 1000;

            var win = window;

            //Override __requestAnimationFrame if exists *prefix*RequestAnimationFrame
            if (win.webkitRequestAnimationFrame) {
                console.log("Use webkitRequestAnimationFrame");
                this.__requestAnimationFrame = this.__webkitRequestAnimationFrame;
            } else if (win.mozRequestAnimationFrame) {
                console.log("Use mozRequestAnimationFrame");
                this.__requestAnimationFrame = this.__mozRequestAnimationFrame;
            } else {
                console.log("Use setTimeout");
            }


            this.__requestAnimationFrame();
        },

        __webkitRequestAnimationFrame: function () {
            window.webkitRequestAnimationFrame(this.__onRequestAnimationFrame.bind(this));
        },

        __mozRequestAnimationFrame: function () {
            window.mozRequestAnimationFrame(this.__onRequestAnimationFrame.bind(this));
        },

        __requestAnimationFrame: function () {
            setTimeout(this.__onRequestAnimationFrame.bind(this), 16);
        },

        __onRequestAnimationFrame: function () {

            //handle keyboard input
            this.__keyboard.loop();

            //TODO Iterate over all objects and for each perform move and collision test
            //for () {
            // move one
            // collision test
            //    * broad phase early out
            //    * narrow phase
            //        * bounding box test
            //        * polygon test
            //}

            // move escaping objects back to the stage
            this.__fixBoundaries();

            // view part
            this.__space.render();

            if (!this.__end) {
                this.__requestAnimationFrame();
            }
        },

        __onCollision: function (data) {
            var objectA = data[0],
            objectB = data[1],
            space   = this.__space,
            objects = this.__objects,
            result  = [];

            if (objectA.type === 3 || objectB.type === 3) {
                // end of the game collision with rocket
                this.__end = true;
            }
            else if ((objectA.type === 2 && objectB.type === 1) ||
                (objectA.type === 1 && objectB.type === 2)) {
                // bullet hit asteroid

                var number = 6;
                if (objectA.type === 1) {
                    number -= objectA.getSize();
                }
                else {
                    number -= objectB.getSize();
                }

                space.increaseScore(number);

                var indexA = objects.indexOf(objectA);
                space.removeShape(objectA);
                objects.splice(indexA, 1);

                var indexB = objects.indexOf(objectB);
                space.removeShape(objectB);
                objects.splice(indexB, 1);

                result = result.concat(objectA.destroy());
                result = result.concat(objectB.destroy());

            } else if (objectA.type === 1 && objectB.type === 1) {
               // asteroid hit asteroid change direction
               objectA.setDirection(2*Math.PI/180 - objectA.getDirection());
               objectB.setDirection(2*Math.PI/180 - objectB.getDirection());


            } else if (objectA.type === 2 && objectB.type === 2) {
                // bullet hit bulled just destroy both
                var indexA = objects.indexOf(objectA);
                space.removeShape(objectA);
                objects.splice(indexA, 1);

                var indexB = objects.indexOf(objectB);
                space.removeShape(objectB);
                objects.splice(indexB, 1);
            }

            if (result && result.length) {
                for (var k = 0, len = result.length, object; k < len; k++) {
                    object = result[k];

                    objects.push(object);
                    space.addShape(new app.view.Shape(object));
                }
            }
        },

        __fixBoundaries: function () {
            var objects = this.__objects,
                boundaries = this.__space.getBoundaries(),
                minX = boundaries[0],
                minY = boundaries[1],
                maxX = boundaries[2],
                maxY = boundaries[3];

            for (var i = 0, object, x, y, len = objects.length; i < len; i++) {
                object = objects[i];

                x = object.getX();
                y = object.getY();

                if (x <= minX) {
                    object.setX(maxX - 1);
                }
                else if (x >= maxX) {
                    object.setX(minX + 1);
                }
                else if (y <= minY) {
                    object.setY(maxY - 1);
                }
                else if (y >= maxY) {
                    object.setY(minY + 1);
                }
            }
        },

        __dispatch: function (event) {
            var bullet,
                objects = this.__objects,
                space   = this.__space,
                now = Date.now();

            if (event && event[1] === app.event.Object.FIRE && this.__fireDelay + 500 < now) {
                this.__fireDelay = now;

                bullet = objects[0].createBullet();

                objects.push(bullet);
                space.addShape(new app.view.Shape(bullet));
            }
        }
    }
});
