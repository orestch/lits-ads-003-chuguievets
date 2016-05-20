function readFile(fs, inputFilename, encoding) {
    var cards = fs.readFileSync(inputFilename, encoding), index;
    index = cards.indexOf('\n');
    cards = cards.slice(0, index).split(' ').map(Number);
    return cards;
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

function binarySearch(sortedData, compare, left, right) {
    var left = typeof left !== 'undefined' ? left : 0, right = typeof right !== 'undefined' ? right
	    : sortedData.length, middle;
    while (left < right) {
	middle = (left + right + 1) / 2;
	if (compare(Math.round(middle)) > 0) {
	    right = middle - 1;
	} else {
	    left = middle;
	}
    }

    return right;
}

function getUniqueNonJokers(sortedPack) {
    var result = [], currentCard = 0;

    for (var i = 0, length = sortedPack.length; i < length; i++) {
	if (sortedPack[i] != currentCard) {
	    result.push(sortedPack[i]);
	    currentCard = sortedPack[i];
	}
    }

    return result;
}

function countJokers(sortedPack) {
    for (var i = 0, length = sortedPack.length; i < length; i++) {
	if (sortedPack[i] != 0) {
	    return i;
	}
    }
    return sortedPack.length;
}

function getMaxSequence(uniques, allowedJokers) {
    var maxSequence = 0, 
    	last = uniques.length - 1, 
    	search = range(0, last + 1);
    
    function compare(right_bound) {
	return getJokerCost(uniques, i, right_bound) > allowedJokers;
    }

    for (var i = 0, length = search.length; i < length; i++) {

	maxLimit = binarySearch(search, compare, search[i], last);

	maxSequenceFromI = maxLimit - i + 1;
	maxSequence = Math.max(maxSequence, maxSequenceFromI);
    }

    return maxSequence;
}

function getJokerCost(uniques, left, right) {
    return uniques[right] - uniques[left] + 1 - (right - left + 1);
}

function calculateMaxSequence(cards) {
    var cards = quickSort(cards), 
    	jokersAmount = countJokers(cards), 
    	uniques = getUniqueNonJokers(cards), 
    	result;    
    
    result = getMaxSequence(uniques, jokersAmount) + jokersAmount;
    return result;
}

(function init() {
    var fs = require('fs');
    	inputFilename = 'lngpok.in', 
    	outputFilename = 'lngpok.out', 
    	encoding = 'utf8', 
    	fileData = [], 
    	maxSequence = 0;
    
    cards = readFile(fs, inputFilename, encoding);
  
    maxSequence = calculateMaxSequence(cards);

    writeFile(fs, outputFilename, Math.round(maxSequence), encoding);

})();