// Variables
var fs = require('fs'), prices, discount, filename = 'discnt.in';

// Functions
function logErrors(err) {
    if (err) {
	return console.log(err);
    }
}

function swap(arr, firstIndex, secondIndex) {
    var temp = arr[firstIndex];
    arr[firstIndex] = arr[secondIndex];
    arr[secondIndex] = temp;
}

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

function applyDiscount(arr, discount) {
    for (var length = arr.length, i = length - Math.floor(length / 3); i < length; i++) {
	arr[i] *= (1 - discount / 100);
    }
    return arr;
}

//Read file
fs.readFile(filename, 'utf8', function(err, data) {
    logErrors(err);

    // Create array with prices and get discount from file
    prices = data.substring(0, data.indexOf('\n'));
    prices = prices.split(" ").map(Number);
    discount = data.substring(data.indexOf('\n') + 1);

    // Sort array with prices in ascending order
    quickSort(prices, 0, prices.length - 1);

    // Apply Discount
    applyDiscount(prices, discount);

    // Get minimum amount of purchase 
    totalMinPrice = prices.reduce(function(a, b) {
	return a + b;
    }, 0);

    // Write to file   
    fs.writeFile('discnt.out', totalMinPrice.toFixed(2), 'utf8', function(err) {
	logErrors(err);
    })
});