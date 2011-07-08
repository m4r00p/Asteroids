var sphere = {
    c: vec3.create([1, 1, 0]),
    r: 1
};

var AABBcr = {
  c: vec3.create([1, 1, 0]),
  r: [1, 2]
};

var AABBmw = {
    min: vec3.create([1, 1, 0]),
    d: [1, 1]
};

var AABBmm = {
    min: vec3.create([1, 1, 0]),
    max: vec3.create([2, 2, 0])
};

/**
 * Returns indices of min and max point.
 *
 * @param points {vec3 []} Contains vec3 objects
 * @return {Array} [min, max] indices of min/max points
 */
function mostSeparatedPointsOnAABB(points) {
    var min, max,
        minx = 0,
        miny = 0,
        maxx = 0,
        maxy = 0;

    for (var i = 1, len = points.length; i < len; i++) {
        //x
        if (points[i][0] < points[minx][0]) minx = i;
        if (points[i][0] > points[minx][0]) maxx = i;
        //y
        if (points[i][1] < points[minx][1]) miny = i;
        if (points[i][1] > points[minx][1]) maxy = i;
    }

    var subtractX = vec3.subtract(points[maxx], points[minx], vec3.create());
    var subtractY = vec3.subtract(points[maxy], points[miny], vec3.create());

    var distance2x = vec3.dot(subtractX, subtractX);
    var distance2y = vec3.dot(subtractY, subtractY);

    min = minx;
    max = maxx;

    if (distance2y > distance2x) {
        min = miny;
        max = maxy;

    }

    return [min, max];
}


/**
 * Returns sphere build on AABB object created on point set.
 *
 * @param points {vec3 []}  Contains vec3 objects
 * @return {Object} Sphere object
 */
function sphereFromDistantPoints(points) {
    var center, radius;

    var mostSeparatedPoints = mostSeparatedPointsOnAABB(points);

    var min = mostSeparatedPoints[0];
    var max = mostSeparatedPoints[1];

    center = vec3.scale(
        vec3.add(points[min], points[max], vec3.create()),
        0.5);

    var subtract = vec3.subtract(points[max], center, vec3.create());
    radius = vec3.dot(subtract, subtract);
    radius = Math.sqrt(radius);

    return {
        c: center,
        r: radius
    };
}

/**
 * Modifies given sphere to contain given point.
 *
 * @param sphere {Object} Sphere like on the top of this file
 * @param point {vec3} Point
 */
function sphereOfSphereAndPoint(sphere, point) {
   var d = vec3.subtract(point, sphere.c, vec3.create());
   var distance2 = vec3.dot(d, d);

   if (distance2 > sphere.r * sphere.r) {
      var distance = Math.sqrt(distance2);
      var radius = (sphere.r + distance) * 0.5;
      var k = (radius - sphere.r) / distance;

      sphere.r = radius;
      vec3.add(sphere.c, vec3.scale(d, k));
   }
}

/**
 * Returns bounding sphere for given point set.
 *
 * @param points {vec3 []}
 */
function ritterSphere(points) {
    var sphere = sphereFromDistantPoints(points);

    for (var i = 0, len = points.length; i < len; i++) {
      sphereOfSphereAndPoint(sphere, points[i]);
    }

    return sphere;
}

function testSphereSphere(a, b) {
    var d = vec3.create();

    vec3.subtract(a.c, b.c, d);

    var distance2 = vec3.dot(d, d);
    var radiusSum = a.r + b.r;

    return distance2 <= radiusSum * radiusSum;
}


function testAABBAABBmm (a, b) {
    if (a.max[0] < b.min[0] || a.min[0] > b.max[0]) return false;
    if (a.max[1] < b.min[1] || a.min[1] > b.max[1]) return false;
    if (a.max[2] < b.min[2] || a.min[2] > b.max[2]) return false;

    return true;
}

function testAABBAABBmw (a, b) {
    var t;

    if ((t = a.min[0] - b.min[0]) > b.d[0] || -t > a.d[0]) return false;
    if ((t = a.min[1] - b.min[1]) > b.d[1] || -t > a.d[1]) return false;
    if ((t = a.min[2] - b.min[2]) > b.d[2] || -t > a.d[2]) return false;

    return true;
}

function testAABBAABBcr (a, b) {
    var abs = Math.abs;

    if (abs(a.c[0] - b.c[0]) > (a.r[0] + b.r[0])) return false;
    if (abs(a.c[1] - b.c[1]) > (a.r[1] + b.r[1])) return false;
    if (abs(a.c[2] - b.c[2]) > (a.r[2] + b.r[2])) return false;

    return true;
}


function crossingsMultiplyTest(pgon, point) {
    var	j, yflag0, yflag1, inside_flag; // int
    var	ty, tx, vtx0, vtx1; //double

    var numverts = pgon.length || 0;
    var index = 0;

    tx = point[0]; //x
    ty = point[1]; //y

    vtx0 = pgon[numverts-1];
    /* get test bit for above/below X axis */
    yflag0 = (vtx0[1/* y */]  >= ty);
    vtx1 = pgon[index] ;

    inside_flag = false ;
    for (j = numverts+1 ; --j;) {

        yflag1 = ( vtx1[1/* y */] >= ty ) ;
        /* Check if endpoints straddle (are on opposite sides) of X axis
         * (i.e. the Y's differ); if so, +X ray could intersect this edge.
         * The old test also checked whether the endpoints are both to the
         * right or to the left of the test point.  However, given the faster
         * intersection point computation used below, this test was found to
         * be a break-even proposition for most polygons and a loser for
         * triangles (where 50% or more of the edges which survive this test
         * will cross quadrants and so have to have the X intersection computed
         * anyway).  I credit Joseph Samosky with inspiring me to try dropping
         * the "both left or both right" part of my code.
         */
        if (yflag0 != yflag1) {
            /* Check intersection of pgon segment with +X ray.
             * Note if >= point's X; if so, the ray hits it.
             * The division operation is avoided for the ">=" test by checking
             * the sign of the first vertex wrto the test point; idea inspired
             * by Joseph Samosky's and Mark Haigh-Hutchinson's different
             * polygon inclusion tests.
             */
            if ( ((vtx1[1/* y */]-ty) * (vtx0[0/* x */]-vtx1[0/* x */]) >=
                (vtx1[0/* x */]-tx) * (vtx0[1/* y */]-vtx1[1/* y */])) == yflag1 ) {
                inside_flag = !inside_flag ;
            }
        }

        /* Move to the next pair of vertices, retaining info as possible. */
        yflag0 = yflag1 ;
        vtx0 = vtx1 ;
        vtx1 = pgon[++index];
    }

    return inside_flag;
}


function testOBBOBB(a, b) {
    var ra, rb;
    var R = mat3.create(),
        AbsR = mat3.create();

    var EPSILON = 0.001;

    // Compute rotation matrix expressing b in a's coordinate frame
    for (var i = 0; i < 3; i++)
        for (var j = 0; j < 3; j++)
            R[i + 3 * j] = vec3.dot(a.u[i], b.u[j], vec3.create());

    // Compute translation vector t
    var t = vec3.subtract(b.c, a.c, vec3.create());
    // Bring translation into a's coordinate frame
    t = vec3.create(
        vec3.dot(t, a.u[0]),
        vec3.dot(t, a.u[1]),
        vec3.dot(t, a.u[2]));

    // Compute common subexpressions. Add in an epsilon term to
    // counteract arithmetic errors when two edges are parallel and
    // their cross product is (near) null (see text for details)
    for (var i = 0; i < 3; i++)
        for (var j = 0; j < 3; j++)
            AbsR[i + 3 *j] = Math.abs(R[i + 3 * j]) + EPSILON;

    // Test axes L = A0, L = A1, L = A2
    for (var i = 0; i < 3; i++) {
        ra = a.e[i];
        rb = b.e[0] * AbsR[i + 3 * 0] + b.e[1] * AbsR[i + 3 * 1] + b.e[2] * AbsR[i + 3 * 2];
        if (Math.abs(t[i]) > ra + rb) return 0;
    }

    // Test axes L = B0, L = B1, L = B2
    for (var i = 0; i < 3; i++) {
        ra = a.e[0] * AbsR[0 + 3 * i] + a.e[1] * AbsR[1 + 3 * i] + a.e[2] * AbsR[2 + 3 * i];
        rb = b.e[i];
        if (Math.abs(t[0] * R[0][i] + t[1] * R[1 + 3 * i] + t[2] * R[2 + 3 * i]) > ra + rb) return 0;
    }

    // Test axis L = A0 x B0
    ra = a.e[1] * AbsR[2 + 3 * 0] + a.e[2] * AbsR[1 + 3 * 0];
    rb = b.e[1] * AbsR[0 + 3 * 2] + b.e[2] * AbsR[0 + 3 * 1];
    if (Math.abs(t[2] * R[1 + 3 * 0] - t[1] * R[2 + 3 * 0]) > ra + rb) return 0;

    // Test axis L = A0 x B1
    ra = a.e[1] * AbsR[2 + 3 * 1] + a.e[2] * AbsR[1 + 3 * 1];
    rb = b.e[0] * AbsR[0 + 3 * 2] + b.e[2] * AbsR[0 + 3 * 0];
    if (Math.abs(t[2] * R[1 + 3 * 1] - t[1] * R[2 + 3 * 1]) > ra + rb) return 0;

    // Test axis L = A0 x B2
    ra = a.e[1] * AbsR[2 + 3 * 2] + a.e[2] * AbsR[1 + 3 * 2];
    rb = b.e[0] * AbsR[0 + 3 * 1] + b.e[1] * AbsR[0 + 3 * 0];
    if (Math.abs(t[2] * R[1 + 3 * 2] - t[1] * R[2 + 3 * 2]) > ra + rb) return 0;

    // Test axis L = A1 x B0
    ra = a.e[0] * AbsR[2 + 3 * 0] + a.e[2] * AbsR[0 + 3 * 0];
    rb = b.e[1] * AbsR[1 + 3 * 2] + b.e[2] * AbsR[1 + 3 * 1];
    if (Math.abs(t[0] * R[2 + 3 * 0] - t[2] * R[0 + 3 * 0]) > ra + rb) return 0;

    // Test axis L = A1 x B1
    ra = a.e[0] * AbsR[2 + 3 * 1] + a.e[2] * AbsR[0 + 3 * 1];
    rb = b.e[0] * AbsR[1 + 3 * 2] + b.e[2] * AbsR[1 + 3 * 0];
    if (Math.abs(t[0] * R[2 + 3 * 1] - t[2] * R[0 + 3 * 1]) > ra + rb) return 0;

    // Test axis L = A1 x B2
    ra = a.e[0] * AbsR[2 + 3 * 2] + a.e[2] * AbsR[0 + 3 * 2];
    rb = b.e[0] * AbsR[1 + 3 * 1] + b.e[1] * AbsR[1 + 3 * 0];
    if (Math.abs(t[0] * R[2 + 3 * 2] - t[2] * R[0 + 3 * 2]) > ra + rb) return 0;

    // Test axis L = A2 x B0
    ra = a.e[0] * AbsR[1 + 3 * 0] + a.e[1] * AbsR[0 + 3 * 0];
    rb = b.e[1] * AbsR[2 + 3 * 2] + b.e[2] * AbsR[2 + 3 * 1];
    if (Math.abs(t[1] * R[0 + 3 * 0] - t[0] * R[1 + 3 * 0]) > ra + rb) return 0;

    // Test axis L = A2 x B1
    ra = a.e[0] * AbsR[1 + 3 * 1] + a.e[1] * AbsR[0 + 3 * 1];
    rb = b.e[0] * AbsR[2 + 3 * 2] + b.e[2] * AbsR[2 + 3 * 0];
    if (Math.abs(t[1] * R[0 + 3 * 1] - t[0] * R[1 + 3 * 1]) > ra + rb) return 0;

    // Test axis L = A2 x B2
    ra = a.e[0] * AbsR[1 + 3 * 2] + a.e[1] * AbsR[0 + 3 * 2];
    rb = b.e[0] * AbsR[2 + 3 * 1] + b.e[1] * AbsR[2 + 3 * 0];
    if (Math.abs(t[1] * R[0 + 3 * 2] - t[0] * R[1 + 3 * 2]) > ra + rb) return 0;

    // Since no separating axis found, the OBBs must be intersecting
    return 1;
}

