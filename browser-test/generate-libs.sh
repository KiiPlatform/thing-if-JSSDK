if [ -d "lib" ]; then  rm -fr lib; fi
mkdir lib
cd ..
npm install browserify
browserify node_modules/popsicle  -s popsicle > browser-test/lib/popsicle.js
npm run build-lib; browserify . -s ThingIF > browser-test/lib/thing-if.js
cd browser-test
curl https://raw.githubusercontent.com/taylorhakes/promise-polyfill/master/promise.js > lib/promise.js
