function readFile(fs, inputFilename, encoding) {
	var fileData = fs.readFileSync(inputFilename, encoding).split(' ').map(Number);
	return fileData;
}

function writeFile(fs, outputFilename, data, encoding) {
	fs.writeFileSync(outputFilename, data, encoding);
}

function binarySearch(compare, left, right) {
	var left = typeof left !== 'undefined' ? left : 0, 
		right = typeof right !== 'undefined' ? right : 0, 
		middle;

	while (left < right) {
		middle = Math.round((left + right) / 2);
		if (compare(middle)) {
			right = middle - 1;
		} else {
			left = middle;
		}
	}
	return right;
}

function calculateMinDashboardSize(count, dimensions) {
	var sheetsCount = count, 
		longerSide = sheetsCount * Math.max(dimensions[0], dimensions[1]), 
		minDashboardSize = 0;

	function compare(longerSide) {
		return canPlaceSheets(count, dimensions, longerSide);
	}

	minDashboardSize = binarySearch(compare, 0, longerSide) + 1;
	
	return minDashboardSize;
}

function canPlaceSheets(count, dimensions, dashboardSize) {
	var sheetsCount = count, 
		sheetWidth = dimensions[0], 
		sheetHeight = dimensions[1], 
		dashboardWidth = dashboardSize, 
		dashboardHeight = dashboardSize, 
		rows = Math.floor(dashboardHeight / sheetHeight), 
		cols = Math.floor(dashboardWidth / sheetWidth), 
		possibleSheets = rows * cols;

	if (sheetsCount <= possibleSheets) {
		return true;
	}

	return false;
}

function solve(count, dimensions) {
	var minDashboardSize = 0;
	minDashboardSize = calculateMinDashboardSize(count, dimensions);
	return minDashboardSize;
}

(function init(inputFilename, answerFilename, fs) {
	var inputFilename = typeof inputFilename != 'undefined' ? inputFilename	: 'bugtrk.in', 
		outputFilename = 'bugtrk.out', 
		fs = require('fs'),
		encoding = 'utf8', 
		minDashboardSize, 
		fileData;

	fileData = readFile(fs, inputFilename, encoding);
	sheetsCount = fileData[0];
	sheetDimensions = fileData.slice(1, fileData.length);
	minDashboardSize = solve(sheetsCount, sheetDimensions);
	writeFile(fs, outputFilename, minDashboardSize, encoding);
})();
