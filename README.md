# webAssembly-perf-test
A simple numeric performance comparison between WebAssembly and Javascript

This repository contains code to compare the performance of the nbody benchmark from the
[Computer Language Benchmarks Game](http://benchmarksgame.alioth.debian.org/)

The results from my machine are available on my [blog](http://www.stefankrause.net/wp/?p=405).

Feel free to send pull requests for any correction or improvement.

#How to run

The javascript version can simply run from the browser. You might want to start it via a simple web server 
(e.g. http-server .) and open the nbody.html file in each directory. There's no build step for javascript necessary.

The java version is compiled with `javac nbody` and run with `java nbody 50000000`. It's the [Java #4](http://benchmarksgame.alioth.debian.org/u64q/program.php?test=nbody&lang=java&id=4) version from the Computer Language Benchmarks Game

The C versions in the c directory can be compiled with `gcc -O3  nbody.c -o nbody` and `gcc -O3 -fomit-frame-pointer -march=native -mfpmath=sse -msse3  nbody_fastest.c -o nbody_fastest`
They are the [original version](http://benchmarksgame.alioth.debian.org/u64q/program.php?test=nbody&lang=gcc&id=1) and [version #4](http://benchmarksgame.alioth.debian.org/u64q/program.php?test=nbody&lang=gcc&id=4).
