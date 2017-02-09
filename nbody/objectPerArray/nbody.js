/* The Computer Language Benchmarks Game
   http://benchmarksgame.alioth.debian.org/
   contributed by Isaac Gouy, 
   modified by Andrew Strain */

var PI = 3.141592653589793;
var MASS_FACTOR = 4 * PI * PI;  //not really PI related
var TIME_FACTOR = 365.24;       //not really days either

var body={
     'top'  : 0 
    ,'x'    : [-0,-0,-0,-0,-0] 
    ,'y'    : [-0,-0,-0,-0,-0]
    ,'z'    : [-0,-0,-0,-0,-0]
    ,'vx'   : [-0,-0,-0,-0,-0]
    ,'vy'   : [-0,-0,-0,-0,-0]
    ,'vz'   : [-0,-0,-0,-0,-0]
    ,'mass' : [-0,-0,-0,-0,-0]
}

function addBody(x,y,z,vx,vy,vz,mass){
 
   body.x[body.top]=x;
   body.y[body.top]=y;
   body.z[body.top]=z;

   body.vx[body.top]=vx;
   body.vy[body.top]=vy;
   body.vz[body.top]=vz;
   
   body.mass[body.top++]=mass;
   
}

function sunMomentumMagic(px,py,pz){
   body.vx[0] = -px / MASS_FACTOR;
   body.vy[0] = -py / MASS_FACTOR;
   body.vz[0] = -pz / MASS_FACTOR;
}

function Jupiter(){
   return new addBody(
      4.84143144246472090e+00,
      -1.16032004402742839e+00,
      -1.03622044471123109e-01,
      1.66007664274403694e-03 * TIME_FACTOR,
      7.69901118419740425e-03 * TIME_FACTOR,
      -6.90460016972063023e-05 * TIME_FACTOR,
      9.54791938424326609e-04 * MASS_FACTOR
   );
}

function Saturn(){
   return new addBody(
      8.34336671824457987e+00,
      4.12479856412430479e+00,
      -4.03523417114321381e-01,
      -2.76742510726862411e-03 * TIME_FACTOR,
      4.99852801234917238e-03 * TIME_FACTOR,
      2.30417297573763929e-05 * TIME_FACTOR,
      2.85885980666130812e-04 * MASS_FACTOR
   );
}

function Uranus(){
   return new addBody(
      1.28943695621391310e+01,
      -1.51111514016986312e+01,
      -2.23307578892655734e-01,
      2.96460137564761618e-03 * TIME_FACTOR,
      2.37847173959480950e-03 * TIME_FACTOR,
      -2.96589568540237556e-05 * TIME_FACTOR,
      4.36624404335156298e-05 * MASS_FACTOR
   );
}

function Neptune(){
   return new addBody(
      1.53796971148509165e+01,
      -2.59193146099879641e+01,
      1.79258772950371181e-01,
      2.68067772490389322e-03 * TIME_FACTOR,
      1.62824170038242295e-03 * TIME_FACTOR,
      -9.51592254519715870e-05 * TIME_FACTOR,
      5.15138902046611451e-05 * MASS_FACTOR
   );
}

function Sun(){
   return new addBody(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, MASS_FACTOR);
}


function NBodySystem(){
   var px = 0.0;
   var py = 0.0;
   var pz = 0.0;
   var size = body.top;
   for (var i=0; i<size; i++){
      var m = body.mass[i];
      px += body.vx[i] * m;
      py += body.vy[i] * m;
      pz += body.vz[i] * m;
   }
   sunMomentumMagic(px,py,pz);
}

function advanceBodies(dt){
   var dx, dy, dz, distance, mag;
   var size = body.top;

   for (var i=0; i<size; i++) {
      for (var j=i+1; j<size; j++) {
         dx = body.x[i] - body.x[j];
         dy = body.y[i] - body.y[j];
         dz = body.z[i] - body.z[j];

         distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
         mag = dt / (distance * distance * distance);

         body.vx[i] -= dx * body.mass[j] * mag;
         body.vy[i] -= dy * body.mass[j] * mag;
         body.vz[i] -= dz * body.mass[j] * mag;

         body.vx[j] += dx * body.mass[i] * mag;
         body.vy[j] += dy * body.mass[i] * mag;
         body.vz[j] += dz * body.mass[i] * mag;
      }
   }

   for (var i=0; i<size; i++) {
      body.x[i] += dt * body.vx[i];
      body.y[i] += dt * body.vy[i];
      body.z[i] += dt * body.vz[i];
   }
}

function energyOfBodies(){
   var dx, dy, dz, distance;
   var e = 0.0;
   var size = body.top;

   for (var i=0; i<size; i++) {

      e += 0.5 * body.mass[i] *
         ( body.vx[i] * body.vx[i]
         + body.vy[i] * body.vy[i]
         + body.vz[i] * body.vz[i] );

      for (var j=i+1; j<size; j++) {
         dx = body.x[i] - body.x[j];
         dy = body.y[i] - body.y[j];
         dz = body.z[i] - body.z[j];

         distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
         e -= (body.mass[i] * body.mass[j]) / distance;
      }
   }
   return e;
}

Sun(),Jupiter(),Saturn(),Uranus(),Neptune() //load celestials

function runTest(n) { 
  var bodies = new NBodySystem();
  
  var s = energyOfBodies().toFixed(9);
  for (var i = 0; i < n; i++) { advanceBodies(0.01); }
  var e = energyOfBodies().toFixed(9);
  return { start: s, end: e };
}
