var literal = require('literal-stream')
var standardCodeclimateTransform = require('./index')
var concat = require('concat-stream')
var assert = require('assert')

var out =
`  /Users/jden/dev/foo/tests/state.test.js:133:4: Block must not be padded by blank lines.
  /Users/jden/dev/foo/tests/state.test.js:135:50: Missing space before function parentheses. (no-unused-vars)
  /Users/jden/dev/index.js:3:5: "sff" is defined but never used (no-unused-vars)
  /Users/jden/dev/index.js:4:5: "fa" is defined but never used (no-unused-vars)
  /Users/jden/dev/foo/tests/state.test.js:146:12: Expected '===' and instead saw '=='.`

literal(out)
  .pipe(standardCodeclimateTransform())
  .pipe(concat(function (out) {
    var objs = out.toString().split('\n').filter(x => Boolean(x)).map(x => JSON.parse(x))

    assert.equal(objs.length, 5)

    objs.forEach(obj => {
      assert.ok(obj.type)
      assert.ok(obj.check_name)
      assert.ok(obj.description)
      assert.ok(obj.categories)
    })
  }))
