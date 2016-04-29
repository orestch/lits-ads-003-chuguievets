// Variables
var fs = require('fs'), prices, discount, filename = 'discnt.in';

// Functions
function logErrors(err) {
    if (err) {
	return console.log(err);
    }
}

function sort(arr) {
    var max_index = 0;
    for (var i = 2, length = arr.length; i < length; i += 3) {
	for (var j = 0, length = arr.length; j < length; j++) {
	    if ((j + 1) % 3 == 0 && j <= i && j !== i) {
		continue;
	    }

	    if (arr[j] > arr[max_index]) {
		max_index = j;
	    }
	}		
	arr[i] = [ arr[max_index], arr[max_index] = arr[i] ][0];	
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
    sort(prices);

    // Get minimum amount of purchase 
     totalMinPrice = prices.reduce(function(a, b) { return a + b; }, 0);

    // Write to file   
    fs.writeFile('discnt.out', totalMinPrice.toFixed(2), 'utf8', function(err) {
	logErrors(err);
    })
});