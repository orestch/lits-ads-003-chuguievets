function readFile(fs, inputFilename, encoding) {
    var data = fs.readFileSync(inputFilename, encoding).split('\n'), pairs = [];

    for (var i = 0, length = data.length; i < length; i++) {
	if (data[i].length > 0) {
	    //data[i] = data[i].trim();
	    //pairs.push(data[i].split(' '));
	    //data[i] = data[i].split(' ');
	}
    }
    return data;
}

function writeFile(fs, outputFilename, data, encoding) {
    fs.writeFileSync(outputFilename, data, encoding);
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
            if (typeof fromNode.afters == "undefined") {
        	fromNode.afters = [];
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

function getResult(pairs) {
    var orderedDocs = '';

    orderedDocs = topsort(pairs);

    return orderedDocs;
}

(function init() {
    var inputFilename = 'govern.in', 
    	outputFilename = 'govern.out', 
    	encoding = 'utf8', 
    	fs = require('fs'), 
    	orderedDocs = '',
    	correctOrder = '';

    pairs = readFile(fs, inputFilename, encoding);
    orderedDocs = getResult(pairs);
    
    for (var i = orderedDocs.length - 1; i > 0; i--) {
	correctOrder += (orderedDocs[i] + '\n');
    }
    
    writeFile(fs, outputFilename,correctOrder, encoding);
})();
