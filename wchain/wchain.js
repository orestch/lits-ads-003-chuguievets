/* Read input file and return the Graph object */
function readFile(fs, inputFilename, encoding) {
    var data = fs.readFileSync(inputFilename, encoding).split('\n'),
    	wordsCount = parseInt(data[0]),    	
    	words = [];    	        
    
    words = data.slice(1, data.length - 1);    
       
    return [wordsCount, words];
}

function writeFile(fs, outputFilename, data, encoding) {
    fs.writeFileSync(outputFilename, data, encoding);
}

/* Calculate Levenstein Distance */
function getEditDistance(a, b){
	  if(a.length == 0) return b.length; 
	  if(b.length == 0) return a.length; 

	  var matrix = [];

	  // increment along the first column of each row
	  var i;
	  for(i = 0; i <= b.length; i++){
	    matrix[i] = [i];
	  }

	  // increment each column in the first row
	  var j;
	  for(j = 0; j <= a.length; j++){
	    matrix[0][j] = j;
	  }

	  // Fill in the rest of the matrix
	  for(i = 1; i <= b.length; i++){
	    for(j = 1; j <= a.length; j++){
	      if(b.charAt(i-1) == a.charAt(j-1)){
	        matrix[i][j] = matrix[i-1][j-1];
	      } else {
	        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
	                                Math.min(matrix[i][j-1] + 1, // insertion
	                                         matrix[i-1][j] + 1)); // deletion
	      }
	    }
	  }

	  return matrix[b.length][a.length];
};

/* Calcucate the maximum experience to reach */
function calcucateMaxChain(wordsCount, words) {	
	var hashtable = [],
		maxChain = 0
		words.sort();
	

	for (var i = 0; i < wordsCount - 1; i++) {

		for (var j = i + 1; j < wordsCount; j++) {

			if (words[i].length > words[j].length) {
				continue;
			}
			if (getEditDistance(words[i], words[j]) == 1) {				
					hashtable.push(words[i] + ' ' + words[j]);	
			}			
		}
	}	
	return hashtable;
}

var EdgeNode = (function () {
    function EdgeNode(id) {
        this.id = id;
        this.afters = [];
    }
    return EdgeNode;
})();

function sortDesc(a, b) {
    if (a < b)
        return 1;
    if (a > b)
        return -1;
    return 0;
}

function topsort(edges, options) {
    var nodes = {};

    options = options || { continueOnCircularDependency: false };

    var sorted = [];

    // hash: id of already visited node => true
    var visited = {};    
    
    // 1. build data structures
    edges.forEach(function (edge) {

	edge = edge.split(' ');
        var fromEdge = edge[0];
        var fromStr = fromEdge.toString();
        var fromNode;

        if (!(fromNode = nodes[fromStr])) {
            fromNode = nodes[fromStr] = new EdgeNode(fromEdge);
        }

        edge.forEach(function (toEdge) {
            // since from and to are in same array, we'll always see from again, so make sure we skip it..
            if (toEdge == fromEdge) {
                return;
            }                    

            var toEdgeStr = toEdge.toString();
            
            if (!nodes[toEdgeStr]) {
                nodes[toEdgeStr] = new EdgeNode(toEdge);
            }                 

            fromNode.afters.push(toEdge);   
        });
        
    });

    // 2. topological sort
    var keys = Object.keys(nodes);
    keys.sort(sortDesc);
    keys.forEach(function visit(idstr, ancestorsIn) {
        var node = nodes[idstr];
        var id = node.id;

        // if already exists, do nothing
        if (visited[idstr]) {
            return;
        }

        var ancestors = Array.isArray(ancestorsIn) ? ancestorsIn : [];

        ancestors.push(id);
        visited[idstr] = true;

        node.afters.sort(sortDesc);
        node.afters.forEach(function (afterID) {
            // if already in ancestors, a closed chain exists.
            if (ancestors.indexOf(afterID) >= 0) {
                if (options.continueOnCircularDependency) {
                    return;
                }
                throw new Error('Circular chain found: ' + id + ' must be before ' + afterID + ' due to a direct order specification, but ' + afterID + ' must be before ' + id + ' based on other specifications.');
            }

            // recursive call
            visit(afterID.toString(), ancestors.map(function (v) {
                return v;
            }));
        });        

        sorted.unshift(id);
    });
    return sorted;
}

function uniq(a) {
    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}

/* Problem solving */
function getResult(wordsCount, words) {
	var result = false;
	result = calcucateMaxChain(wordsCount, words);

	//console.log(result)
	orderedDocs = topsort(result);
	orderedDocs = orderedDocs.map(function(elem) {
		return elem.length;
	})
	orderedDocs = uniq(orderedDocs)
	orderedDocs = orderedDocs.length
	console.log(orderedDocs)
    return orderedDocs;
}

/* Init */
(function init() {
    var inputFilename = 'wchain.in', 
    	outputFilename = 'wchain.out', 
    	encoding = 'utf8', 
    	fs = require('fs'),
    	data = readFile(fs, inputFilename, encoding),  
    	wordsCount = data[0],
    	words = data[1],
    	maxChain = 0;
    maxChain = getResult(wordsCount, words);
    writeFile(fs, outputFilename, maxChain, encoding);
})();
