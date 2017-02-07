"use strict";
/* The Computer Language Benchmarks Game
   http://benchmarksgame.alioth.debian.org/
   contributed by Isaac Gouy
   Optimized by Roy Williams
   Adapted by Stefan Krause
   */

/**
 * @type {number}
 */
const PI = 3.141592653589793;

/**
 * @type {number}
 */
const SOLAR_MASS = 4 * PI * PI;

/**
 * @type {number}
 */
const DAYS_PER_YEAR = 365.24;

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
class Body {
  constructor(x,y,z,vx,vy,vz,mass) {
    var buffer = new Float64Array(7);
    this.buffer = buffer;
    buffer[0] = x;
    buffer[1] = y;
    buffer[2] = z;
    buffer[3] = vx;
    buffer[4] = vy;
    buffer[5] = vz;
    buffer[6] = mass;
  }
  get x() { return this.buffer[0]; }
  get y() { return this.buffer[1]; }
  get z() { return this.buffer[2]; }
  get vx() { return this.buffer[3]; }
  get vy() { return this.buffer[4]; }
  get vz() { return this.buffer[5]; }
  get mass() { return this.buffer[6]; }
  set x(val) { this.buffer[0] = val;}
  set y(val) { this.buffer[1] = val;}
  set z(val) { this.buffer[2] = val;}
  set vx(val) { this.buffer[3] = val;}
  set vy(val) { this.buffer[4] = val;}
  set vz(val) { this.buffer[5] = val;}
  offsetMomentum(px,py,pz) {
   this.vx = -px / SOLAR_MASS;
   this.vy = -py / SOLAR_MASS;
   this.vz = -pz / SOLAR_MASS;
  }
}

/**
 * @return {Body}
 */
function Jupiter(){
   return new Body(
      4.84143144246472090e+00,
      -1.16032004402742839e+00,
      -1.03622044471123109e-01,
      1.66007664274403694e-03 * DAYS_PER_YEAR,
      7.69901118419740425e-03 * DAYS_PER_YEAR,
      -6.90460016972063023e-05 * DAYS_PER_YEAR,
      9.54791938424326609e-04 * SOLAR_MASS      
   );
}

/**
 * @return {Body}
 */
function Saturn(){
   return new Body(
      8.34336671824457987e+00,
      4.12479856412430479e+00,
      -4.03523417114321381e-01,
      -2.76742510726862411e-03 * DAYS_PER_YEAR,
      4.99852801234917238e-03 * DAYS_PER_YEAR,
      2.30417297573763929e-05 * DAYS_PER_YEAR,
      2.85885980666130812e-04 * SOLAR_MASS
   );
}

/**
 * @return {Body}
 */
function Uranus(){
   return new Body(
      1.28943695621391310e+01,
      -1.51111514016986312e+01,
      -2.23307578892655734e-01,
      2.96460137564761618e-03 * DAYS_PER_YEAR,
      2.37847173959480950e-03 * DAYS_PER_YEAR,
      -2.96589568540237556e-05 * DAYS_PER_YEAR,
      4.36624404335156298e-05 * SOLAR_MASS 
   );
}

/**
 * @return {Body}
 */
function Neptune(){
   return new Body(
      1.53796971148509165e+01,
      -2.59193146099879641e+01,
      1.79258772950371181e-01,
      2.68067772490389322e-03 * DAYS_PER_YEAR,
      1.62824170038242295e-03 * DAYS_PER_YEAR,
      -9.51592254519715870e-05 * DAYS_PER_YEAR,
      5.15138902046611451e-05 * SOLAR_MASS
   );
}

/**
 * @return {Body}
 */
function Sun(){
   return new Body(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, SOLAR_MASS);
}

/**
 * @param {Array.<Body>} bodies
 * @constructor
 */
class NBodySystem {
  constructor(bodies) {
    this.bodies = bodies;
    var px = 0.0;
    var py = 0.0;
    var pz = 0.0;
    var size = this.bodies.length;
    for (var i=0; i<size; i++){
        var b = this.bodies[i];
        var m = b.mass;
        px += b.vx * m;
        py += b.vy * m;
        pz += b.vz * m;
    }
    this.bodies[0].offsetMomentum(px,py,pz);
  }
  // advance(dt){
  //   var bodies, i,j, dx,dy,dz, distance, mag;
  //   for (i=0; i<this.bodies.length; i++) {
  //       for (j=i+1; j<this.bodies.length; j++) {
  //          dx = this.bodies[i].x - this.bodies[j].x;
  //          dy = this.bodies[i].y - this.bodies[j].y;
  //          dz = this.bodies[i].z - this.bodies[j].z;

  //          distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
  //          mag = dt / (distance * distance * distance);

  //         this.bodies[i].vx -= dx * this.bodies[j].mass * mag;
  //         this.bodies[i].vy -= dy * this.bodies[j].mass * mag;
  //         this.bodies[i].vz -= dz * this.bodies[j].mass * mag;

  //         this.bodies[j].vx += dx * this.bodies[i].mass * mag;
  //         this.bodies[j].vy += dy * this.bodies[i].mass * mag;
  //         this.bodies[j].vz += dz * this.bodies[i].mass * mag;
  //       }
  //       this.bodies[i].x += dt * this.bodies[i].vx;
  //       this.bodies[i].y += dt * this.bodies[i].vy;
  //       this.bodies[i].z += dt * this.bodies[i].vz;
  //   }
  // }  
  advance(dt){
    var bodies = this.bodies, 
      i=0, 
      j=0, 
      bodyi = bodies[0], 
      imass = 0.0, 
      jmass = 0.0, 
      dx = 0.0,
      dy = 0.0,
      dz = 0.0, 
      distance = 0.0, 
      mag = 0.0, 
      bodyj = bodies[0];
    
    for (;i<bodies.length; i++) {
         bodyi = bodies[i];
         imass = bodyi.mass
        for (j=i+1; j<bodies.length; j++) {
           bodyj = bodies[j];
           jmass = bodyj.mass;
           dx = bodyi.x - bodyj.x;
           dy = bodyi.y - bodyj.y;
           dz = bodyi.z - bodyj.z;

           distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
           mag = dt / (distance * distance * distance);

          bodyi.vx -= dx * jmass * mag;
          bodyi.vy -= dy * jmass * mag;
          bodyi.vz -= dz * jmass * mag;

          bodyj.vx += dx * imass * mag;
          bodyj.vy += dy * imass * mag;
          bodyj.vz += dz * imass * mag;
        }
        bodyi.x += dt * bodyi.vx;
        bodyi.y += dt * bodyi.vy;
        bodyi.z += dt * bodyi.vz;
    }
  }  
  // advance_asm(dt){
  //   var bodies = this.bodies, 
  //     i=0|0, 
  //     j=0|0, 
  //     bodyi = bodies[0], 
  //     imass = +0.0, 
  //     jmass = +0.0, 
  //     dx = +0.0,
  //     dy = +0.0,
  //     dz = +0.0, 
  //     distance = +0.0, 
  //     mag = +0.0, 
  //     bodyj = bodies[0];
    
  //   for (;i<bodies.length|0; i=(i+1)|0) {
  //        bodyi = bodies[i|0];
  //        imass = bodyi.mass
  //       for (j=(i+1)|0; j<bodies.length|0; j=(j+1)|0) {
  //          bodyj = bodies[j|0];
  //          jmass = +bodyj.mass;
  //          dx = +(bodyi.x - bodyj.x);
  //          dy = +(bodyi.y - bodyj.y);
  //          dz = +(bodyi.z - bodyj.z);

  //          distance = +Math.sqrt(dx*dx + dy*dy + dz*dz);
  //          mag = +dt / (distance * distance * distance);

  //         bodyi.vx = +(bodyi.vx - dx * jmass * mag);
  //         bodyi.vy = +(bodyi.vy - dy * jmass * mag);
  //         bodyi.vz = +(bodyi.vz - dz * jmass * mag);

  //         bodyj.vx = +(bodyj.vx + dx * imass * mag);
  //         bodyj.vy = +(bodyj.vy + dy * imass * mag);
  //         bodyj.vz = +(bodyj.vz + dz * imass * mag);
  //       }
  //       bodyi.x = +(bodyi.x + dt * bodyi.vx);
  //       bodyi.y = +(bodyi.y + dt * bodyi.vy);
  //       bodyi.z = +(bodyi.z + dt * bodyi.vz);
  //   }
  // }  
  energy(){
    var dx, dy, dz, distance;
    var e = 0.0;
    var size = this.bodies.length;

    for (var i=0; i<size; i++) {
        var bodyi = this.bodies[i];

        e += 0.5 * bodyi.mass *
          ( bodyi.vx * bodyi.vx
          + bodyi.vy * bodyi.vy
          + bodyi.vz * bodyi.vz );

        for (var j=i+1; j<size; j++) {
          var bodyj = this.bodies[j];
          dx = bodyi.x - bodyj.x;
          dy = bodyi.y - bodyj.y;
          dz = bodyi.z - bodyj.z;

          distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
          e -= (bodyi.mass *
                bodyj.mass) / distance;
        }
    }
    return e;
  }
}
function runTest(n) {
  var bodies = new NBodySystem( [
     Sun(),Jupiter(),
     Saturn(),Uranus(),Neptune()
  ]);
  let s = bodies.energy().toFixed(9);
  for (var i=0; i<n; i++){ bodies.advance(0.01); }
  let e = bodies.energy().toFixed(9);
  return {start:s, end: e};
}
