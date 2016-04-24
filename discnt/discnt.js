// Variables
var fs = require('fs'), prices, discount, filename = 'discnt.in';

//Functions
function getSum(a, b) {
    return a + b;
}

function compare(a, b) {
    return a > b;
}

function logErrors(err) {
    if (err) {
	return console.log(err);
    }
}

function sort(arr) {
    var max_index = 0, counter = [];
    for (var i = 2, length = arr.length; i < length; i += 3) {
	counter.push(i);
	for (var j = 0, length = arr.length; j < length; j++) {
	    if (!!~counter.indexOf(j) && j !== i) {
		continue;
	    }

	    if (compare(arr[j], arr[max_index])) {
		max_index = j;
	    }
	}	
	
	arr[i] = [ arr[max_index], arr[max_index] = arr[i] ][0];	
	arr[i] -= arr[i] * (discount / 100);

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
    sort(prices);

    // Get minimum amount of purchase 
    totalMinPrice = prices.reduce(getSum);

    // Write to file   
    fs.writeFile('discnt.out', totalMinPrice.toFixed(2), 'utf8', function(err) {
	logErrors(err);
    })
});