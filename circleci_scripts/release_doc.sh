git clone https://github.com/KiiPlatform/thing-if-JSSDK.git RepoForDoc
cd RepoForDoc
git checkout gh-pages
rm -fr api-doc/
cp -fr ../jsdoc/html api-doc
git commit -a -m "update api doc"
git push origin gh-pages