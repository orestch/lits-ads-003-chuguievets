function swap(arr, firstIndex, secondIndex) {
    var temp = arr[firstIndex];
    arr[firstIndex] = arr[secondIndex];
    arr[secondIndex] = temp;
}

function range(start, stop, step) {
    if (typeof stop == 'undefined') {
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
	right = typeof right != "number" ? items.length - 1 : right;

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

function readFile(fs, inputFilename, encoding) {
    var data = fs.readFileSync(inputFilename, encoding).split('\n'), hamsters = [];

    for (var i = 2, length = data.length; i < length; i++) {
	if (data[i] != null && data[i].trim() != '') {
	    hamsters.push(data[i].split(" "));
	}
    }
    return [ data[0], data[1], hamsters ];
}

function writeFile(fs, outputFilename, data, encoding) {
    fs.writeFileSync(outputFilename, data, encoding);
}

function getFoodPerKHamsters(hamsters, k) {
    var foodPerKHamsters = hamsters.map(function(hamster) {
	return parseInt(hamster[0]) + parseInt(hamster[1]) * (k - 1);
    });

    foodPerKHamsters = quickSort(foodPerKHamsters, 0, hamsters.length - 1);
    foodPerKHamsters = foodPerKHamsters.slice(0, k);
    foodPerKHamsters = foodPerKHamsters.reduce(function(a, b) {
	return a + b;
    }, 0);
    return foodPerKHamsters;
}

function calculateMaxHamsters(food, hamsters, hamstersAmount) {
    var possibleHamsterCounts = range(0, hamstersAmount), maxHamsters = 0;

    function compare(hamstersAmount) {
	return getFoodPerKHamsters(hamsters, hamstersAmount) > food;
    }

    maxHamsters = binarySearch(possibleHamsterCounts, compare);
    return maxHamsters;
}

(function init() {
    var fs = require('fs'), inputFilename = 'hamstr.in', outputFilename = 'hamstr.out',
    encoding = 'utf8', fileData = [], food = 0, hamsters = 0, maxHamsters = 0;
    fileData = readFile(fs, inputFilename, encoding);
    food = parseInt(fileData[0]);
    hamstersAmount = parseInt(fileData[1]);
    hamsters = fileData[2];    
    maxHamsters = Math.round(calculateMaxHamsters(food, hamsters, hamstersAmount));
    writeFile(fs, outputFilename, maxHamsters, encoding);        
})();