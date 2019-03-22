const package = require("./package.json");

process.stdout.write(
  `${package.name} version ${package.version} installed.\n\n`
);
