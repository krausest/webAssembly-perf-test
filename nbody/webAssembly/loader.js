function loadModule(filename) {
  return fetch(filename)
    .then(response => response.arrayBuffer())
    .then(buffer => WebAssembly.compile(buffer))
    .then(module => {
      const imports = {
        env: {
          memoryBase: 0,
          tableBase: 0,
          memory: new WebAssembly.Memory({
            initial: 256
          }),
          table: new WebAssembly.Table({
            initial: 0,
            element: 'anyfunc'
          })
        }
      };

      return new WebAssembly.Instance(module, imports);
    });
}