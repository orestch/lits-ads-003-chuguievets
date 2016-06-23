/* Read input file and return the Graph object */
function readFile(fs, inputFilename, encoding) {
    var data = fs.readFileSync(inputFilename, encoding).toUpperCase().split('\n'),
    	pyramidHeight = parseInt(data[0]),    	
    	matrixPyramid = [];    	        
    
    for (var i = 1, length = data.length - 1; i < length; i++) {
    	matrixPyramid.push(data[i].split(' ').map(Number).concat(new Array(pyramidHeight - i + 1).join('0').split('').map(parseFloat)));    	
	}   
       
    return [pyramidHeight, matrixPyramid];
}

/* Write result to file */
function writeFile(fs, outputFilename, data, encoding) {
    fs.writeFileSync(outputFilename, data, encoding);
}

/* Calcucate the maximum experience to get */
function calcucateMaxExperience(pyramidHeight, matrixPyramid) {	
	for (var i = pyramidHeight - 2; i >= 0; i--) {
		for (var j = 0; j < matrixPyramid[i].length; j++) {
			matrixPyramid[i][j] = matrixPyramid[i][j] + Math.max(matrixPyramid[i + 1][j], matrixPyramid[i + 1][j + 1]);
		}
	}
	return matrixPyramid[0][0];
}

/* Problem solving */
function getResult(pyramidHeight, matrixPyramid) {
	var result = false;
	result = calcucateMaxExperience(pyramidHeight, matrixPyramid, 0, 0);
	return result;
}

/* Init */
(function init() {
    var inputFilename = 'career.in', 
    	outputFilename = 'career.out', 
    	encoding = 'utf8', 
    	fs = require('fs'),
    	pyramid = readFile(fs, inputFilename, encoding),    	
    	maxExperience = 0;
    maxExperience = getResult(pyramid[0], pyramid[1]);
    writeFile(fs, outputFilename, maxExperience, encoding);
})();
