
test: node_modules
	node_modules/.bin/mochify --phantomjs node_modules/.bin/phantomjs --reporter spec test/index.js

bundle.js: index.js node_modules
	node_modules/.bin/browserify $< > $@

node_modules: package.json
	npm install
	touch $@

clean:
	rm -f bundle.js

.PHONY: test clean distclean
