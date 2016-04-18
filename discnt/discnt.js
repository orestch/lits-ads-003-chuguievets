// Variables
var fs = require('fs'), prices, discount, totalMinPrice = 0, length;

// Functions
function getDiff(a, b) {
    return a - b;
}

function getSum(a, b) {
    return a + b;
}

function logErrors(err) {
    if (err) {
	return console.log(err);
    }
}

// Read file
fs.readFile('discnt.in', 'utf8', function(err, data) {
    logErrors(err);
    
    // Create array with prices and get discount from file
    prices = data.substring(0, data.indexOf('\n'));
    prices = prices.split(" ").map(Number);  
    discount = data.substring(data.indexOf('\n') + 1);    
        
    // Sort array with prices in ascending order
    prices.sort(getDiff);   

    // Resort array so that the biggest prices are on the third position. Apply discount for every third price.
    for (var length = prices.length, i = length - 1, j = 2, temp; j < length - length % 3; j+=3, i--) {
	temp = prices[i];	
	prices[i] = prices[j];	
	prices[j] = temp;	
	prices[j] = prices[j] - prices[j] * discount / 100;	
    }
    
    // Get minimum amount of purchase 
    totalMinPrice = prices.reduce(getSum);

    // Write to file   
    fs.writeFile('discnt.out', totalMinPrice.toFixed(2), 'utf8', function(err) {
	logErrors(err);
    })
});