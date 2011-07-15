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
                    vec3.create([
                        this.__rand(minX + 20, maxX - 20),
                        this.__rand(minY + 20, maxY - 20),
                        0]),
                    vec3.create([
                        this.__rand(0, 0.1),
                        this.__rand(0, 0.1),
                        0]),
                    this.__rand(0, 360)
                );

                objects.push(object);
                space.addShape(new app.view.Shape(object));
            }

        },

        __createBullets: function (number) {
            var object, objects = this.__objects,
                boundaries = this.__space.getBoundaries(),
                minX = boundaries[0],
                minY = boundaries[1],
                maxX = boundaries[2],
                maxY = boundaries[3],
                space = this.__space;

            for (var i = 0; i < number; i++) {
                object = new app.model.Bullet(
                    vec3.create([
                        this.__rand(minX + 20, maxX - 20),
                        this.__rand(minY + 20, maxY - 20),
                        0]),
                    vec3.create([
                        this.__rand(0, 0.25),
                        this.__rand(0, 0.25),
                        0]),
                    this.__rand(0, 360)
                );

                objects.push(object);
                space.addShape(new app.view.Shape(object));
            }

        },

        __createSpace: function () {
            this.__space = new app.view.Space();
        },

        __createRocket: function (mine) {
            var  boundaries = this.__space.getBoundaries(),
                minX = boundaries[0],
                minY = boundaries[1],
                maxX = boundaries[2],
                maxY = boundaries[3];

            var rocketModel      = new app.model.Rocket(vec3.create([
                this.__rand(minX + 20,maxX - 20),
                this.__rand(minY + 20, maxY - 20),
                0]),
                vec3.create(),
                0
            );

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

            this.__createAsteroid(4);
//            this.__createBullets(1000);

            this.__registerEvent();

            this.addListener("collision", this.__onCollision, this);

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

            var objects = this.__objects,
                time = this.__time || +new Date();

            //handle keyboard input
            this.__keyboard.loop();

            var bounds = {
                x:0,
                y:0,
                width: 500,
                height: 500
            };
            var quadTree = new QuadTree(bounds, true, 4, 4);

            for (var object, radius, i = 0, len = objects.length; i < len; i++) {
                object = objects[i];
                radius = object.__boundingBox.r;
                quadTree.insert({
                    x: object.getX(),
                    y: object.getY(),
                    height: radius * 2,
                    width: radius * 2,
                    obj: object
                });
            }

            var count = 0;

            for (var objectA, items, i = 0, leni = objects.length; i < leni; i++) {
                objectA = objects[i];

                objectA.integrate((+new Date()) - time);

                items = quadTree.retrieve({
                    x: object.getX(),
                    y: object.getY(),
                    height: radius * 2,
                    width: radius * 2
                });


                count += items.length;

                test: for (var item, objectB, j = 0, lenj = items.length; j < lenj; j++) {
                    objectB = items[j].obj;

                    if (objectA != objectB && testSphereSphere(
                        objectA.__boundingBox,
                        objectB.__boundingBox)) {

                        for(var vertex, k = 0, lenk = objectA.__vertices.length; k < lenk; k++) {
                            vertex = objectA.__vertices[k];
                            if (crossingsMultiplyTest(objectB.__vertices,
                                vec3.add(vertex, vec3.subtract(objectA.__position, objectB.__position, vec3.create()), vec3.create()))) {
                                this.fireDataEvent("collision", [objectA, objectB]);
                                continue test;
                            }
                        }

                        for(var vertex, k = 0, lenk = objectB.__vertices.length; k < lenk; k++) {
                            vertex = objectB.__vertices[k];
                            if (crossingsMultiplyTest(objectA.__vertices,
                                vec3.add(vertex, vec3.subtract(objectB.__position, objectA.__position, vec3.create()), vec3.create()))) {
                                this.fireDataEvent("collision", [objectA, objectB]);
                                continue test;
                            }
                        }

                    }
                }

            }

            this.__time = +new Date();


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
            this.__space.render(count, leni);

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

//                console.log([objectA, objectB]);
                // end of the game collision with rocket
//                this.__end = true;
            }
            else if ((objectA.type === 2 && objectB.type === 1) ||
                (objectA.type === 1 && objectB.type === 2)) {
                // bullet hit asteroid

                space.increaseScore(1);

//                var indexA = objects.indexOf(objectA);
//                space.removeShape(objectA);
//                objects.splice(indexA, 1);
//
//                var indexB = objects.indexOf(objectB);
//                space.removeShape(objectB);
//                objects.splice(indexB, 1);

//                result = result.concat(objectA.destroy());
//                result = result.concat(objectB.destroy());

            } else if (objectA.type === 1 && objectB.type === 1) {
               // asteroid hit asteroid change direction
//               objectA.setDirection(2*Math.PI/180 - objectA.getDirection());
//               objectB.setDirection(2*Math.PI/180 - objectB.getDirection());


            } else if (objectA.type === 2 && objectB.type === 2) {
                // bullet hit bulled just destroy both
//                var indexA = objects.indexOf(objectA);
//                space.removeShape(objectA);
//                objects.splice(indexA, 1);

//                var indexB = objects.indexOf(objectB);
//                space.removeShape(objectB);
//                objects.splice(indexB, 1);
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

            if (event && event[1] === app.event.Object.FIRE && this.__fireDelay + 250 < now) {
                this.__fireDelay = now;

                bullet = objects[0].createBullet();

                objects.push(bullet);
                space.addShape(new app.view.Shape(bullet));
            }
        }
    }
});
