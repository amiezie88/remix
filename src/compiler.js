let fs = require('fs');
var async = require('async');
var path = require('path');

let remixLib = require('remix-lib');
let compilerInput = remixLib.helpers.compiler;
let RemixCompiler = require('remix-solidity').Compiler;

// TODO: replace this with remix's own compiler code
function compileFile(filename, cb) {
  console.log("compile all");

  let compiler;
  const sources = {
    "tests.sol": {content: fs.readFileSync("sol/tests.sol").toString()},
  }

  // TODO: for now assumes filepath dir contains all tests, later all this
  // should be replaced with remix's & browser solidity compiler code
  let filepath = path.dirname(filename);
  fs.readdirSync(filepath).forEach(file => {
    sources[file] = {content: fs.readFileSync(path.join(filepath, file)).toString()}
  });

  async.waterfall([
    function loadCompiler(next) {
      console.log("loadCompiler");
      compiler = new RemixCompiler();
      compiler.onInternalCompilerLoaded();
      //compiler.event.register('compilerLoaded', this, function (version) {
        next();
      //});
    },
    function doCompilation(next) {
      compiler.event.register('compilationFinished', this, function (success, data, source) {
        next(null, data);
      });
      console.log("doCompilation");
      compiler.compile(sources, "examples/");
    }
  ], function(err, result) {
    cb(err, result.contracts);
  });

}

module.exports = {
  compileFile: compileFile
}
