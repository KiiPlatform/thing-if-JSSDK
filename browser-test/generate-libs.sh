if [ -d "lib" ]; then  rm -fr lib; fi
mkdir lib
cd ..
npm install browserify
browserify node_modules/popsicle  -s popsicle > browser-test/lib/popsicle.js
browserify node_modules/make-error-cause -s make-error-cause > browser-test/lib/make-error-cause.js
browserify node_modules/es6-promise/ -s es6-promise > browser-test/lib/es6-promise.js
cd browser-test