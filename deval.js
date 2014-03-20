var min = function (arr) {
    return Math.min.apply(Math, arr);
};

var REGEXES = {
    functionOpening: /^function\s*\((.*)\)[^{]{/
};


module.exports = function (fn/*, interpolateArgs... */) {
    var str = fn.toString();
    var interpolateArgs = Array.prototype.slice.call(arguments, 1);
    var argNames;

    if (interpolateArgs.length) {
        argNames = getArgumentNames(str);
    }
    str = removeFunctionWrapper(str);
    str = dedent(str);
    if (argNames && argNames.length) {
        str = interpolate(str, argNames, interpolateArgs);
    }
    return str;
};

function getArgumentNames (str) {
    var argStr = str.match(REGEXES.functionOpening);
    return argStr[1].split(',').map(function (s) { return s.trim(); });
}

function removeFunctionWrapper (str) {
    var closingBraceIdx, finalNewlineIdx, lastLine;

    //remove opening function bit
    str = str.replace(REGEXES.functionOpening, '');

    //remove closing function brace
    closingBraceIdx = str.lastIndexOf('}');
    if (closingBraceIdx > 0) {
        str = str.slice(0, closingBraceIdx - 1);
    }

    //If there was no code on opening wrapper line, remove it
    str = str.replace(/^[^\S\n]*\n/, '');

    //If there was no code on final line, remove it
    finalNewlineIdx = str.lastIndexOf('\n');
    lastLine = str.slice(finalNewlineIdx);
    if (lastLine.trim() === '') str = str.slice(0, finalNewlineIdx);

    return str;
}

//Reset indent on the code to minimum possible
function dedent (str) {
    var lines = str.split('\n');
    var indent = min(lines.map(function (line) {
        return line.match(/^\s*/)[0].length;
    }));
    lines = lines.map(function (line) {
        return line.slice(indent);
    });
    return lines.join('\n');
}

function interpolate (str, argNames, args) {
    argNames.forEach(function (name, i) {
        var regex = new RegExp('\\$' + name + '\\$', 'g');
        str = str.replace(regex, args[i]);
    });
    return str;
}
