function readFile(fs, inputFilename, encoding) {
    var data = fs.readFileSync(inputFilename, encoding).split('\n'), pairs = [];

    for (var i = 0, length = data.length; i < length; i++) {
	if (data[i].length > 0) {
	    pairs.push(data[i].split(' '));
	}
    }
    return pairs;
}

function writeFile(fs, outputFilename, data, encoding) {
    fs.writeFileSync(outputFilename, data, encoding);
}

function buildGraph(pairs) {
    var graph = {}, doc = '', relatedDoc = '';

    for (var i = 0, length = pairs.length; i < length; i++) {
	if (!(pairs[i][0] in graph)) {
	    graph[pairs[i][0]] = [];
	}
	if (!(pairs[i][1] in graph)) {
	    graph[pairs[i][1]] = [];
	}
	graph[pairs[i][0]].push(pairs[i][1]);
    }
    
    //console.log(graph);

    return graph;
}

function intersection(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        if (b.indexOf(e) !== -1) return true;
    });
}

function printObject(obj) {
    var str = '';
    for ( var prop in obj) {
	str += (prop + ': ' + obj[prop] + '\n');
    }
    
    return str;
}

function tarjan(graph) {
    var topologicalOrder = [], 
    	topologicalOrderSet = [], 
    	unvisitedVertices = Object.keys(graph);
    
    //console.log("unvisited vertices: " + unvisitedVertices);
    //console.log("graph: " + printObject(graph));
    
    function dfsStack(startVertex) {
	var stack, 
	    vertex, 
	    pos = 0, 
	    unvisitedNeighbors;

	stack = [ startVertex ];
	
	//console.log("stack: " + stack);
	//console.log("stack length: " + stack.length);
	while (stack.length > 0) {
	    vertex = stack.pop();
	    //console.log("vertex: " + vertex);
	    pos = unvisitedVertices.indexOf(vertex);
	    
	    if (pos > -1) {
		unvisitedVertices.splice(pos, 1);
	    }
	    //console.log("unvisitedVertices: " + unvisitedVertices);
	    //console.log("graph vertex: " + graph[vertex]);
	    unvisitedNeighbors = intersection(graph[vertex], unvisitedVertices);
	    //console.log("unvisitedNeighbors: " + unvisitedNeighbors);
	    
	    if (unvisitedNeighbors.length == 0) {
		if (!topologicalOrderSet.indexOf(vertex) > -1) {
		    topologicalOrder.push(vertex);
		    topologicalOrderSet.push(vertex);
		}
	    } else {
		stack.push(vertex);
		//console.log("new stack 1: " + stack);
		stack = stack.concat(unvisitedNeighbors);
		//console.log("new stack 2: " + stack);
	    }
	}
    }
    
    
    while (unvisitedVertices.length > 0) {	
	dfsStack(unvisitedVertices.pop());
    }

    return topologicalOrder;
}

function getResult(pairs) {
    var graph = buildGraph(pairs), orderedDocs = '';

    orderedDocs = tarjan(graph);

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
    
    for (var i = 0, length = orderedDocs.length; i < length; i++) {
	correctOrder += (orderedDocs[i] + '\n');
    }
    
    //console.log(orderedDocs);
    writeFile(fs, outputFilename, correctOrder, encoding);
})();
