var test = require('tape');
var deval = require('./deval');

test('it serializes multiline code', function (t) {
    var serialized = deval(function () {
        console.log('hi');
        console.log('there');
    });

    var expected = [
        "console.log('hi');",
        "console.log('there');"
    ].join('\n');

    t.equal(serialized, expected);
    t.end();
});

test('it serializes inline code', function (t) {
    var serialized = deval(function () { console.log('hi'); console.log('there'); });

    var expected = [
        "console.log('hi'); console.log('there');"
    ].join('\n');

    t.equal(serialized, expected);
    t.end();
});

test('it even interpolates things', function (t) {
    var serialized = deval(function (foo, bar) {
        console.log('$foo$');
        console.log($bar$);
    }, "hi", 5);

    var expected = [
        "console.log('hi');",
        "console.log(5);"
    ].join('\n');

    t.equal(serialized, expected);
    t.end();
});
