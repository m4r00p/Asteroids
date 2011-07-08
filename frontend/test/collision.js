
var AABBcr = {
    c: vec3.create([1, 1, 0]),
    r: [1, 1, 0]
};

var AABBmw = {
    min: vec3.create([1, 1, 0]),
    d: [1, 1, 0]
};

var AABBmm = {
    min: vec3.create([1, 1, 0]),
    max: vec3.create([2, 2, 0])
};

/*
fail([msg])
assertTrue([msg], actual)
assertFalse([msg], actual)
assertEquals([msg], expected, actual)
assertSame([msg], expected, actual)
assertNotSame([msg], expected, actual)
assertNull([msg], actual)
assertNotNull([msg], actual)
*/

TestCase("Collision", {

    test__mostSeparatedPointsOnAABB: function() {
        var points = [
            vec3.create([0,0,0]),
            vec3.create([0,2,0]),
            vec3.create([2,2,0]),
            vec3.create([2,0,0])
        ];

        assertEquals([0, 2], mostSeparatedPointsOnAABB(points));
    },

    test__ritterSphere: function () {
        var points = [
            vec3.create([0,0,0]),
            vec3.create([0,2,0]),
            vec3.create([2,2,0]),
            vec3.create([2,0,0])
        ];

        var expected = {c: vec3.create([1, 1, 0]), r: Math.sqrt(2)};

        assertEquals(expected, ritterSphere(points));
    },

    test__testSphereSphere: function () {
        var A = {
            c: vec3.create([2, 2, 0]),
            r: 2
        };

        var B = {
            c: vec3.create([4, 4, 0]),
            r: 2
        };

        var C = {
            c: vec3.create([6, 2, 0]),
            r: 1
        };

        var D = {
            c: vec3.create([6, 10, 0]),
            r: 1
        };

        assertTrue(testSphereSphere(A, B));
        assertTrue(testSphereSphere(B, C));
        assertFalse(testSphereSphere(A, C));
        assertFalse(testSphereSphere(A, D));
        assertFalse(testSphereSphere(B, D));
        assertFalse(testSphereSphere(C, D));
    },

    test__testAABBAABBmm : function () {
        var A = {
            min: vec3.create([0, 0, 0]),
            max: vec3.create([2, 3, 0])
        };

        var B = {
            min: vec3.create([1, 2, 0]),
            max: vec3.create([3, 5, 0])
        };

        var C = {
            min: vec3.create([0, 0, 0]),
            max: vec3.create([3, 5, 0])
        };

        var D = {
            min: vec3.create([2, 4, 0]),
            max: vec3.create([3, 5, 0])
        };
        var E = {
            min: vec3.create([4, 5, 0]),
            max: vec3.create([5, 6, 0])
        };

        assertTrue(testAABBAABBmm(A, B));
        assertTrue(testAABBAABBmm(A, C));
        assertFalse(testAABBAABBmm(A, D));
        assertTrue(testAABBAABBmm(B, C));
        assertTrue(testAABBAABBmm(B, D));
        assertTrue(testAABBAABBmm(C, D));
        assertFalse(testAABBAABBmm(A, E));
        assertFalse(testAABBAABBmm(B, E));
        assertFalse(testAABBAABBmm(C, E));
        assertFalse(testAABBAABBmm(D, E));
    },

    test__testAABBAABBmw : function () {
        var A = {
            min: vec3.create([0, 0, 0]),
            d: [2, 3, 0]
        };

        var B = {
            min: vec3.create([1, 2, 0]),
            d: [2, 3, 0]
        };

        var C = {
            min: vec3.create([0, 0, 0]),
            d: [3, 5, 0]
        };

        var D = {
            min: vec3.create([2, 4, 0]),
            d: [1, 1, 0]
        };
        var E = {
            min: vec3.create([4, 5, 0]),
            d: [1, 1, 0]
        };

        assertTrue(testAABBAABBmw(A, B));
        assertTrue(testAABBAABBmw(A, C));
        assertFalse(testAABBAABBmw(A, D));
        assertTrue(testAABBAABBmw(B, C));
        assertTrue(testAABBAABBmw(B, D));
        assertTrue(testAABBAABBmw(C, D));
        assertFalse(testAABBAABBmw(A, E));
        assertFalse(testAABBAABBmw(B, E));
        assertFalse(testAABBAABBmw(C, E));
        assertFalse(testAABBAABBmw(D, E));
    },

    test__testAABBAABBcr : function () {
        var A = {
            c: vec3.create([1, 1.5, 0]),
            r: [1, 1.5, 0]
        };

        var B = {
            c: vec3.create([2, 3.5, 0]),
            r: [1, 1.5, 0]
        };

        var C = {
            c: vec3.create([1.5, 2.5, 0]),
            r: [1.5, 2.5, 0]
        };

        var D = {
            c: vec3.create([2.5, 4.5, 0]),
            r: [0.5, 0.5, 0]
        };
        var E = {
            c: vec3.create([4.5, 5.5, 0]),
            r: [0.5, 0.5, 0]
        };

        assertTrue(testAABBAABBcr(A, B));
        assertTrue(testAABBAABBcr(A, C));
        assertFalse(testAABBAABBcr(A, D));
        assertTrue(testAABBAABBcr(B, C));
        assertTrue(testAABBAABBcr(B, D));
        assertTrue(testAABBAABBcr(C, D));
        assertFalse(testAABBAABBcr(A, E));
        assertFalse(testAABBAABBcr(B, E));
        assertFalse(testAABBAABBcr(C, E));
        assertFalse(testAABBAABBcr(D, E));
    },

    test__crossingsMultiplyTest: function () {
        var polygon = [
            vec3.create([0, 0, 0]),
            vec3.create([0, 5, 0]),
            vec3.create([3, 5, 0]),
            vec3.create([3, 0, 0])
        ];

        var triangle = [
            vec3.create([0, 0, 0]),
            vec3.create([0, 5, 0]),
            vec3.create([3, 0, 0])
        ];

        assertTrue(crossingsMultiplyTest(polygon, vec3.create([2, 3, 0])));
        assertTrue(crossingsMultiplyTest(polygon, vec3.create([2.5, 4.5, 0])));
        assertTrue(crossingsMultiplyTest(polygon, vec3.create([2.99, 4.99, 0])));
        assertTrue(crossingsMultiplyTest(polygon, vec3.create([2.99, 5, 0])));
        assertFalse(crossingsMultiplyTest(polygon, vec3.create([10, 5, 0])));

        assertTrue(crossingsMultiplyTest(triangle, vec3.create([1, 1, 0])));
        assertFalse(crossingsMultiplyTest(triangle, vec3.create([2, 3, 0])));
    },

    test__pointInTriangle: function () {
        var triangle = [
            vec3.create([0, 0, 0]),
            vec3.create([0, 5, 0]),
            vec3.create([3, 0, 0])
        ];

        assertTrue(crossingsMultiplyTest(triangle, vec3.create([1, 1, 0])));
        assertFalse(crossingsMultiplyTest(triangle, vec3.create([2, 3, 0])));
    },

    test__testPlaneSphere: function () {

        var A = {
            c: vec3.create([2, 2, 0]),
            r: 2
        };
        var B = {
            c: vec3.create([2, 2, 0]),
            r: 1
        };
        var C = {
            c: vec3.create([399, 2, 0]),
            r: 1
        };

        var PlaneX = {
            n: vec3.create([1, 0, 0]), //plane normal
            d: 0 // dot(n, p) for given point p on the plane
        };

        var PlaneX400 = {
            n: vec3.create([1, 0, 0]), //plane normal
            d: 400 // dot(n, p) for given point p on the plane
        };

        assertTrue(testSpherePlane(A, PlaneX));
        assertFalse(testSpherePlane(B, PlaneX));
        assertTrue(testSpherePlane(C, PlaneX400));
    },

    test__testPlaneAABB: function () {

        var A = {
            min: vec3.create([-1, -1, 0]),
            max: vec3.create([2, 3, 0])
        };

        var B = {
            min: vec3.create([1, 1, 0]),
            max: vec3.create([2, 3, 0])
        };
        var C = {
            min: vec3.create([1, 1, 0]),
            max: vec3.create([400, 3, 0])
        };

        var PlaneX = {
            n: vec3.create([1, 0, 0]), //plane normal
            d: 0 // dot(n, p) for given point p on the plane
        };
        var PlaneX400 = {
            n: vec3.create([1, 0, 0]), //plane normal
            d: 400 // dot(n, p) for given point p on the plane
        };

        assertTrue(testAABBPlane(A, PlaneX));
        assertFalse(testAABBPlane(B, PlaneX));
        assertTrue(testAABBPlane(C, PlaneX400));
    },

    test__empty: function () {}
});
