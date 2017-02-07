"use strict";
/* The Computer Language Benchmarks Game
   http://benchmarksgame.alioth.debian.org/
   contributed by Isaac Gouy
   Optimized by Roy Williams
   Adapted by Stefan Krause
   */

var SIZE = 5;
var bodyBuffer = new Float64Array(8 * 5);

/**
 * @type {number}
 */
var PI = 3.141592653589793;

/**
 * @type {number}
 */
var SOLAR_MASS = 4 * PI * PI;

/**
 * @type {number}
 */
var DAYS_PER_YEAR = 365.24;

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} vx
 * @param {number} vy
 * @param {number} vz
 * @param {number} mass
 * @constructor
 */
function Body(x, y, z, vx, vy, vz, mass, buffer, bodyIndex) {
  this.offset = bodyIndex * 8;

  bodyBuffer[this.offset + 0] = x;
  bodyBuffer[this.offset + 1] = y;
  bodyBuffer[this.offset + 2] = z;
  bodyBuffer[this.offset + 3] = vx;
  bodyBuffer[this.offset + 4] = vy;
  bodyBuffer[this.offset + 5] = vz;
  bodyBuffer[this.offset + 6] = mass;
}

/**
 * @param {number} px
 * @param {number} py
 * @param {number} pz
 */
Body.prototype.offsetMomentum = function (px, py, pz) {
  bodyBuffer[this.offset + 3] = -px / SOLAR_MASS;
  bodyBuffer[this.offset + 4] = -py / SOLAR_MASS;
  bodyBuffer[this.offset + 5] = -pz / SOLAR_MASS;
}

/**
 * @return {Body}
 */
function Jupiter(buffer, bodyIndex) {
  return new Body(
    4.84143144246472090e+00,
    -1.16032004402742839e+00,
    -1.03622044471123109e-01,
    1.66007664274403694e-03 * DAYS_PER_YEAR,
    7.69901118419740425e-03 * DAYS_PER_YEAR,
    -6.90460016972063023e-05 * DAYS_PER_YEAR,
    9.54791938424326609e-04 * SOLAR_MASS,
    buffer, bodyIndex
  );
}

/**
 * @return {Body}
 */
function Saturn(buffer, bodyIndex) {
  return new Body(
    8.34336671824457987e+00,
    4.12479856412430479e+00,
    -4.03523417114321381e-01,
    -2.76742510726862411e-03 * DAYS_PER_YEAR,
    4.99852801234917238e-03 * DAYS_PER_YEAR,
    2.30417297573763929e-05 * DAYS_PER_YEAR,
    2.85885980666130812e-04 * SOLAR_MASS,
    buffer, bodyIndex
  );
}

/**
 * @return {Body}
 */
function Uranus(buffer, bodyIndex) {
  return new Body(
    1.28943695621391310e+01,
    -1.51111514016986312e+01,
    -2.23307578892655734e-01,
    2.96460137564761618e-03 * DAYS_PER_YEAR,
    2.37847173959480950e-03 * DAYS_PER_YEAR,
    -2.96589568540237556e-05 * DAYS_PER_YEAR,
    4.36624404335156298e-05 * SOLAR_MASS,
    buffer, bodyIndex
  );
}

/**
 * @return {Body}
 */
function Neptune(buffer, bodyIndex) {
  return new Body(
    1.53796971148509165e+01,
    -2.59193146099879641e+01,
    1.79258772950371181e-01,
    2.68067772490389322e-03 * DAYS_PER_YEAR,
    1.62824170038242295e-03 * DAYS_PER_YEAR,
    -9.51592254519715870e-05 * DAYS_PER_YEAR,
    5.15138902046611451e-05 * SOLAR_MASS,
    buffer, bodyIndex
  );
}

/**
 * @return {Body}
 */
function Sun(buffer, bodyIndex) {
  return new Body(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, SOLAR_MASS, buffer, bodyIndex);
}

/**
 * @param {Array.<Body>} bodies
 * @constructor
 */
function NBodySystem(bodies) {
  /**
   * @type {Array.<Body>}
   */
  this.bodies = bodies;
  var px = 0.0;
  var py = 0.0;
  var pz = 0.0;
  var size = this.bodies.length;
  for (var i = 0; i < size; i++) {
    var b = this.bodies[i];
    var m = bodyBuffer[b.offset + 6];
    px += bodyBuffer[b.offset + 3] * m;
    py += bodyBuffer[b.offset + 4] * m;
    pz += bodyBuffer[b.offset + 5] * m;
  }
  this.bodies[0].offsetMomentum(px, py, pz);
}

var createAdvance = function () {
  var res = [];
  res.push("var dx, dy, dz, distance, mag;");
  res.push("var imass, jmass;");
  res.push("var m1, m2;");
  var c = SIZE * 8;

  for (var ofs_i = 0; ofs_i < c; ofs_i += 8) {
    res.push("   imass = bodyBuffer[" + ofs_i + " +6]");

    for (var ofs_j = ofs_i + 8; ofs_j < c; ofs_j += 8) {
      res.push("      jmass = bodyBuffer[" + ofs_j + " +6];");
      res.push("      dx = bodyBuffer[" + ofs_i + " +0] - bodyBuffer[" + ofs_j + " +0];");
      res.push("      dy = bodyBuffer[" + ofs_i + " +1] - bodyBuffer[" + ofs_j + " +1];");
      res.push("      dz = bodyBuffer[" + ofs_i + " +2] - bodyBuffer[" + ofs_j + " +2];");
      res.push("      distance = Math.sqrt(dx*dx + dy*dy + dz*dz);");
      res.push("      mag = dt / (distance * distance * distance);");
      res.push("	 m1 = jmass * mag;");
      res.push("     bodyBuffer[" + ofs_i + " +3] -= dx * m1;");
      res.push("     bodyBuffer[" + ofs_i + " +4] -= dy * m1;");
      res.push("     bodyBuffer[" + ofs_i + " +5] -= dz * m1;");
      res.push("	 m2 = imass * mag;");
      res.push("    bodyBuffer[" + ofs_j + " +3] += dx * m2;");
      res.push("    bodyBuffer[" + ofs_j + " +4] += dy * m2;");
      res.push("    bodyBuffer[" + ofs_j + " +5] += dz * m2;");
    }

    res.push(" bodyBuffer[" + ofs_i + " +0] += dt * bodyBuffer[" + ofs_i + " +3];");
    res.push(" bodyBuffer[" + ofs_i + " +1] += dt * bodyBuffer[" + ofs_i + " +4];");
    res.push(" bodyBuffer[" + ofs_i + " +2] += dt * bodyBuffer[" + ofs_i + " +5];");
  }
  var fnbody = res.join("\n");
  NBodySystem.prototype.advance = Function("dt", fnbody);
}();


/**
 * @return {number}
 */
NBodySystem.prototype.energy = function () {
  var dx, dy, dz, distance;
  var e = 0.0;
  var size = this.bodies.length;

  var c = SIZE * 8;
  for (var ofs_i = 0; ofs_i < c; ofs_i += 8) {

    e += 0.5 * bodyBuffer[ofs_i + 6] *
      (bodyBuffer[ofs_i + 3] * bodyBuffer[ofs_i + 3]
        + bodyBuffer[ofs_i + 4] * bodyBuffer[ofs_i + 4]
        + bodyBuffer[ofs_i + 5] * bodyBuffer[ofs_i + 5]);

    for (var ofs_j = ofs_i + 8; ofs_j < c; ofs_j += 8) {
      dx = bodyBuffer[ofs_i + 0] - bodyBuffer[ofs_j + 0];
      dy = bodyBuffer[ofs_i + 1] - bodyBuffer[ofs_j + 1];
      dz = bodyBuffer[ofs_i + 2] - bodyBuffer[ofs_j + 2];

      distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      e -= (bodyBuffer[ofs_i + 6] *
        bodyBuffer[ofs_j + 6]) / distance;
    }
  }
  return e;
}

function runTest(n) {
  var bodies = new NBodySystem(Array(
    Sun(bodyBuffer, 0), Jupiter(bodyBuffer, 1),
    Saturn(bodyBuffer, 2), Uranus(bodyBuffer, 3), Neptune(bodyBuffer, 4)
  ));
  let s = bodies.energy().toFixed(9);
  for (var i = 0; i < n; i++) { bodies.advance(0.01); }
  let e = bodies.energy().toFixed(9);
  return { start: s, end: e };
}
