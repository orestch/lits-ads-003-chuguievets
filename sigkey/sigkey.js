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

function swap(arr, firstIndex, secondIndex) {
    var temp = arr[firstIndex];
    arr[firstIndex] = arr[secondIndex];
    arr[secondIndex] = temp;
}

function range(start, stop, step) {
    if (typeof stop == 'undefined') {
	// one param defined
	stop = start;
	start = 0;
    }

    if (typeof step == 'undefined') {
	step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
	return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
	result.push(i);
    }

    return result;
};

function partition(arr, left, right) {
    var pivot = arr[Math.floor((right + left) / 2)];
    var leftWritePos = left;
    var rightWritePos = right;

    while (leftWritePos <= rightWritePos) {
	while (arr[leftWritePos] < pivot) {
	    leftWritePos++;
	}
	while (arr[rightWritePos] > pivot) {
	    rightWritePos--;
	}

	if (leftWritePos <= rightWritePos) {
	    swap(arr, leftWritePos, rightWritePos);
	    leftWritePos++;
	    rightWritePos--;
	}
    }
    return leftWritePos;
}

function quickSort(arr, left, right) {
    var index, left, right;
    if (arr.length > 1) {
	left = typeof left != "number" ? 0 : left;
	right = typeof right != "number" ? arr.length - 1 : right;

	index = partition(arr, left, right);

	if (left < index - 1) {
	    quickSort(arr, left, index - 1);
	}

	if (index < right) {
	    quickSort(arr, index, right);
	}
    }
    return arr;
}

function getCost(left, right, str1len, str2len, strlen) {
    var max;
    
    if (left == right || str1len == str2len) {
	return false;
    }
    
    max = Math.max(left, right);
    
    return (max - str1len) + (max - str2len) == strlen;
}

function testMatch(str) {
	var pattern = 'abcdefghijklmnopqrstuvwxyz', 
	regExp="^", 
	length = str.length;
	
	for (var i = 0; i < length; i++) {
		regExp += '(?=.*' + pattern[i] + ')';
	}
	
	regExp += '.{0,' + length + '}$'
	regExp = new RegExp(regExp);
		
	return regExp.test(str);
}

function calculateDistanceToA(charCode) {
    var distance = 1;
    distance = charCode - 96;
    return distance;
}

function getHash(str, getDist) {
    var hash = 0, dist = 1, minDist = Number.POSITIVE_INFINITY, maxDist = 0, charCodesMap = [], charCode;
    for (var i = 0, length = str.length; i < length; i++) {
	charCode = str.charCodeAt(i);
	
	dist = calculateDistanceToA(charCode);
	
	if (dist < minDist) {
	    minDist = dist;
	}
	
	if (dist > maxDist) {
	    maxDist = dist;
	}
	
	hash  = ((hash << 5) - hash) + charCode;
	hash |= 0; // Convert to 32bit integer
	
	charCodesMap.push(charCode);
    }
   
    return [hash, maxDist];
}

function createBuckets(hashtable1, hashtable2) {
    var bucket1 = [], bucket2 = [];
    for ( var key in hashtable1) {
	bucket1.push(key);
    }
    for ( var key in hashtable2) {
	bucket2.push(key);
    }
    return [bucket1, bucket2];
}


function createHashtables(keys) {
    var hashtables = [],
    	hashtableKeysContainsA = {},
    	hash = [],
	hashtableOtherKeys = {};
    
    for (var i = 0, length = keys.length; i < length; i++) {
	if (keys[i].indexOf('a') > -1) {
	    hash = getHash(keys[i]); 
	    hashtableKeysContainsA[i] = [keys[i], hash[1]];
	} else {
	    hash = getHash(keys[i]);
	    hashtableOtherKeys[i] = [keys[i], hash[1]];
	}
    }
    
    hashtables.push(hashtableKeysContainsA, hashtableOtherKeys);    
    return hashtables;
}

function getPairsNum(hashtable1, hashtable2, bucket1, bucket2) {
    var pairsNum = 0;
    for (var i = 0, lengthb1 = bucket1.length; i < lengthb1; i++) {
	for (var j = 0, length = bucket2.length; j < length; j++) {
	    strlen = (hashtable1[bucket1[i]][0] + hashtable2[bucket2[j]][0]).length;
	    
		if (testMatch(hashtable1[bucket1[i]][0] + hashtable2[bucket2[j]][0])) {
		    pairsNum++;
		}
		
	    
	}
    }
    
    return pairsNum;
}

function solve(keys) {
    var pairsNum = 0,
    	hashtables = [],
    	buckets =[],
    	bucketHashesContainsA = [],
    	bucketHashesOther = [],
    	hashtableKeysContainsA = {},
    	hashtableOtherKeys = {};
    
    hashtables = createHashtables(keys);
    hashtableKeysContainsA = hashtables[0];
    hashtableOtherKeys = hashtables[1];
    buckets = createBuckets(hashtableKeysContainsA, hashtableOtherKeys);
    bucketHashesContainsA = quickSort(buckets[0].map(Number));
    bucketHashesOther = quickSort(buckets[1].map(Number));
    
    pairsNum = getPairsNum(hashtableKeysContainsA, hashtableOtherKeys, bucketHashesContainsA, bucketHashesOther);
    
    return pairsNum;
}

(function init() {
    var inputFilename = 'sigkey.in', outputFilename = 'sigkey.out', encoding = 'utf8', keys = [], pairsNum = 0, fs = require('fs');
    
    keys = readFile(fs, inputFilename, encoding);
    
    
  
    pairsNum = solve(keys);
    
    writeFile(fs, outputFilename, pairsNum, encoding);
 

})();
