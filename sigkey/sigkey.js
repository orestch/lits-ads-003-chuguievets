function readFile(fs, inputFilename, encoding) {
    var data = fs.readFileSync(inputFilename, encoding).split('\n'), keys = [];

    for (var i = 1, length = data.length; i < length; i++) {
	if (data[i] != null && data[i].trim() != '') {
	    keys.push(data[i]);
	}
    }
    
    return keys;
}

function writeFile(fs, outputFilename, data, encoding) {
    fs.writeFileSync(outputFilename, data, encoding);
}

function getResult(keys) {
    var pairsCount = 0, keysHashTable = {};
    
    keysHashTable = generateKeysHashTable(keys);
    
    for ( var key in keysHashTable) {
	if (keysHashTable[keysHashTable[key]]) {
	    pairsCount++;
	}
    }
    
    return pairsCount;
}

function generateKeysHashTable(keys) {
    var keysHashTable = {}, bitmask;
    for (var i = 0, length = keys.length; i < length; i++) {
	bitmask = createBitmasks(keys[i]);
	keysHashTable[bitmask[0]] = bitmask[1];
    }       
    return keysHashTable;
}

function createBitmasks(key) {
    var positiveMask = 0,
    	negativeMask = 0,
    	leftBitPosition = 0,
    	bitIndex = 0;
    
    for (var i = 0, length = key.length; i < length; i++) {
	bitIndex = key.charCodeAt(i) - 97;
	positiveMask |= (1 << bitIndex);
	if (bitIndex > leftBitPosition) {
	    leftBitPosition = bitIndex;
	}
    }
    
    negativeMask = (~positiveMask ^ ((1 << leftBitPosition) - 1) | positiveMask);
    
    return [positiveMask.toString(2), (~negativeMask >>> 0).toString(2)];
}

(function init() {
    var inputFilename = 'sigkey.in', 
	outputFilename = 'sigkey.out', 
	encoding = 'utf8', 
	fs = require('fs');
    
    keys = readFile(fs, inputFilename, encoding);
    pairsCount = getResult(keys);
    writeFile(fs, outputFilename, pairsCount, encoding);
})();