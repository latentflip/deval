# deval

![npm info](https://nodei.co/npm/deval.png?compact=true)

If eval takes a string representing code, and turns it into actual code, deval takes actual code, and returns a string representation of it.

Browserify/node/commonjs compatible:

```
npm install deval
```

## Why?

Sometimes you're doing fun/evil/interesting things, and you want a block of code as a multiline string. But doing this is super annoying:

```javascript

var codeString = [
  "var foo = 'bar'",
  "function stuff () {",
  "  console.log('The thing is \"10\"');"
  "}"
].join('\n');
```

Quotes everywhere, keeping track of indentation is a pain if you want it properly formatted, no syntax highlighting, bleurgh.

Deval makes it look like this:

```javascript
var deval = require('deval');

var codeString = deval(function () {
    var foo = 'bar';
    function stuff () {
        console.log('The thing is "10"');
    }
});
//codeString -> "var foo = 'bar';\nfunction stuff () {\n    console.log('The thing is \"10\"');\n}"
```

It even figures out what indentation you meant and cleans that up.

## Usage

### Basic

Call `deval` with a function containing the code you want to get back as a string. The function wrapper will be removed.

```javascript
var deval = require('deval');

var codeString = deval(function () {
    var foo = 'bar';
    function stuff () {
        console.log('The thing is "10"');
    }
});

//codeString will be:
//    "var foo = 'bar';
//    function stuff () {
//        console.log('The thing is \"10\"');
//    }"
```

### Advanced

Sometimes you want to interpolate strings/numbers/etc into your generated code. **You can't just use normal scoping rules, because this code won't be executed in the current scope.** So instead you can do a little templating magic.

To interpolate:

* Name some positional arguments in the function you pass to deval: `deval(function (arg1, arg2) { ...`
* Insert them where you want them in your code by wrapping in dollars: `$arg1$`
* Pass the values of those arguments as additional arguments to deval itself. `deval(function (arg, arg2) { ... }, "one", 2)`

#### Example

```javascript
var codeString = deval(function (foo, bar) {
    var thing = $bar$;
    console.log('$foo$');
    console.log(thing);
}, "hi", 5);

//codeString will be:
//    "var thing = 5;
//    console.log('hi');
//    console.log(thing)"
```

note: Don't try to be too clever with this, and if you're passing strings, you'll want to wrap them in quotes inside the code block, as shown about for `"hi" -> '$foo$'`

## License

MIT
