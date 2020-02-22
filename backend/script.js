/**
 * Use this file to call scripts:
 *
 *     node script script-name
 *
 * Make the scripts export-default a function which will be called
 * by this script. The function is expected to return a Promise.
 * Any error will be catched and the system will be shutdown automatically.
 *
 * If nothing is exported or the default export isn't a function, the script
 * will have to shutdown the app itself.
 */
require('./dist/boot');

async function script() {
  const req = require('./dist/scripts/' + process.argv[2]);

  if (req.default && typeof req.default == 'function') {
    try {
      await req.default();
    } catch(e) {
      console.log(e);
    }
  }
  process.exit();
}

script();
