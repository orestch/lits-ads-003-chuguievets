/* Vertex class */
var Vertex = (function () {
    function Vertex(label, isClient) {
        this.label = label;
        this.isClient = isClient;
        this.outboundEdges = [];
    }
    return Vertex;
})();

Vertex.prototype.stringify = function() {
	return "Label: " + this.label + "\nEdges: " + this.outboundEdges.join(', ');
}

Vertex.prototype.getLabel = function() {
	return this.label;
}

/* Edge class */
var Edge = (function () {
    function Edge(startVertex, endVertex, weight) {
        this.startVertex = startVertex;
        this.endVertex = endVertex;
        this.weight = weight;
    }
    return Edge;
})();

Edge.prototype.stringify = function() {
	return this.startVertex.getLabel() + " ---" + this.weight + "---> " + this.endVertex.getLabel();
}

/* Graph class */
var Graph = (function () {
    function Graph(vertices, edges) {
        this.vertices = vertices;
        this.edges = edges;
    }
    return Graph;
})();

/* Read input file and return the Graph object */
function readFile(fs, inputFilename, encoding) {
    var data = fs.readFileSync(inputFilename, encoding).toUpperCase().split('\n'),
    	numbers = [];
    	verticesNumber = 0,
    	edgesNumber = 0,
    	clients = [],
    	vertices = [],
    	edge = {},
    	reversedEdge = {},
    	edges = [],
    	graph = {},
    	isClient = false,
    	startVertex = 0,
    	endVertex = 0,
    	weight = 0;
    
    // Read number of vertices and edges	
    numbers = data[0].split(' ').map(Number);
    verticesNumber = numbers[0];
    edgesNumber = numbers[1];
    
    // Read client nodes
    clients = data[1].split(' ').map(function(num) {
		Number(num);
		return num - 1;
	});
    
    // Vertices instantiation
    for (var i = 0, j = 0; i < verticesNumber; i++) {
    	if (clients[j] == i) {
			isClient = true; 
			j++;
		}
		vertices.push(new Vertex(i, isClient));
		isClient = false;
	}
    
    // Edges instantiation
    for (var i = 2; i < edgesNumber + 2; i++) {
    	edge = data[i].split(' ').map(Number);
    	
		startVertex = edge[0] - 1;
		endVertex = edge[1] - 1;
    	weight = edge[2];
    	
    	edge = new Edge(vertices[startVertex], vertices[endVertex], weight);    	
    	vertices[startVertex].outboundEdges.push(edge);
    	
    	reversedEdge = new Edge(vertices[endVertex], vertices[startVertex], weight)
    	vertices[endVertex].outboundEdges.push(reversedEdge);
    	
    	edges.push(edge);
    	edges.push(reversedEdge);
    	
	}
    
    // Graph instantiation
    graph = new Graph(vertices, edges);
    return graph;
}

/* MinHeap Realization */
function BinaryHeap(scoreFunction){
	  this.content = [];
	  this.scoreFunction = scoreFunction;
	}

	BinaryHeap.prototype = {
	  push: function(element) {
	    // Add the new element to the end of the array.
	    this.content.push(element);
	    // Allow it to bubble up.
	    this.bubbleUp(this.content.length - 1);
	  },

	  pop: function() {
	    // Store the first element so we can return it later.
	    var result = this.content[0];
	    // Get the element at the end of the array.
	    var end = this.content.pop();
	    // If there are any elements left, put the end element at the
	    // start, and let it sink down.
	    if (this.content.length > 0) {
	      this.content[0] = end;
	      this.sinkDown(0);
	    }
	    return result;
	  },

	  remove: function(node) {
	    var length = this.content.length;
	    // To remove a value, we must search through the array to find
	    // it.
	    for (var i = 0; i < length; i++) {
	      if (this.content[i] != node) continue;
	      // When it is found, the process seen in 'pop' is repeated
	      // to fill up the hole.
	      var end = this.content.pop();
	      // If the element we popped was the one we needed to remove,
	      // we're done.
	      if (i == length - 1) break;
	      // Otherwise, we replace the removed element with the popped
	      // one, and allow it to float up or sink down as appropriate.
	      this.content[i] = end;
	      this.bubbleUp(i);
	      this.sinkDown(i);
	      break;
	    }
	  },

	  size: function() {
	    return this.content.length;
	  },

	  bubbleUp: function(n) {
	    // Fetch the element that has to be moved.
	    var element = this.content[n], score = this.scoreFunction(element);
	    // When at 0, an element can not go up any further.
	    while (n > 0) {
	      // Compute the parent element's index, and fetch it.
	      var parentN = Math.floor((n + 1) / 2) - 1,
	      parent = this.content[parentN];
	      // If the parent has a lesser score, things are in order and we
	      // are done.
	      if (score >= this.scoreFunction(parent))
	        break;

	      // Otherwise, swap the parent with the current element and
	      // continue.
	      this.content[parentN] = element;
	      this.content[n] = parent;
	      n = parentN;
	    }
	  },

	  sinkDown: function(n) {
	    // Look up the target element and its score.
	    var length = this.content.length,
	    element = this.content[n],
	    elemScore = this.scoreFunction(element);

	    while(true) {
	      // Compute the indices of the child elements.
	      var child2N = (n + 1) * 2, child1N = child2N - 1;
	      // This is used to store the new position of the element,
	      // if any.
	      var swap = null;
	      // If the first child exists (is inside the array)...
	      if (child1N < length) {
	        // Look it up and compute its score.
	        var child1 = this.content[child1N],
	        child1Score = this.scoreFunction(child1);
	        // If the score is less than our element's, we need to swap.
	        if (child1Score < elemScore)
	          swap = child1N;
	      }
	      // Do the same checks for the other child.
	      if (child2N < length) {
	        var child2 = this.content[child2N],
	        child2Score = this.scoreFunction(child2);
	        if (child2Score < (swap == null ? elemScore : child1Score))
	          swap = child2N;
	      }

	      // No need to swap further, we are done.
	      if (swap == null) break;

	      // Otherwise, swap and continue.
	      this.content[n] = this.content[swap];
	      this.content[swap] = element;
	      n = swap;
	    }
	  }
	};

/* Dijkstra's algorithm */
function dijkstra(graph, startVertex) {
	var distances = [], 
		result = [],
		heap = new BinaryHeap(function(x){return x;}),
		distance = 0,
		heapCol = [],
		shortestDistanceLabel = 0,
		shortestDistanceVertex = 0,
		neighborVertex = 0,
		alternativeDistance = 0;
	
	for (var i = 0; i < graph.vertices.length; i++) {
		distances.push(Infinity);
	}	
	
	distances[startVertex.label] = 0;
	heap.push([0, startVertex.label]);
	
	
	while (heap.content.length > 0) {
		heapCol = heap.pop();
		distance = heapCol[0];
		shortestDistanceLabel = heapCol[1];
		shortestDistanceVertex = graph.vertices[shortestDistanceLabel];
		for (var i = 0; i < shortestDistanceVertex.outboundEdges.length; i++) {
			neighborVertex = shortestDistanceVertex.outboundEdges[i].endVertex;
			alternativeDistance = distances[shortestDistanceVertex.label] + shortestDistanceVertex.outboundEdges[i].weight;			
			if (alternativeDistance < distances[neighborVertex.label]) {
				distances[neighborVertex.label] = alternativeDistance;
				heap.push([alternativeDistance, neighborVertex.label]);
			}
		}
	}
	
	for (var i = 0; i < graph.vertices.length; i++) {
		result.push([distances[graph.vertices[i].label], graph.vertices[i].isClient]);
	}

	return result;
}

/* Problem solving */
function getResult(graph) {
    var maxTimeout = Infinity,
    	distances = 0,
    	maxTimeoutVert;
    
    for (var i = 0; i < graph.vertices.length; i++) {
    	maxTimeoutVert = -Infinity;
		if (!graph.vertices[i].isClient) {
			distances = dijkstra(graph, graph.vertices[i]);
			//console.log(distances);
			for (var j = 0; j < distances.length; j++) {
				if (distances[j][1] && distances[j][0] > maxTimeoutVert) {
					maxTimeoutVert = distances[j][0];
					// console.log(maxTimeoutVert);
				}
			}
			//console.log("maxTimeout1: " + maxTimeout);
			//console.log("maxTimeoutVert: " + maxTimeoutVert);
			
			maxTimeout = Math.min(maxTimeout, maxTimeoutVert);
			// max_latency = min(max_latency, max(latency for (latency, is_client) in distances if is_client))
		}
	}    
    
    return maxTimeout;
}

/* Write result to file */
function writeFile(fs, outputFilename, data, encoding) {
    fs.writeFileSync(outputFilename, data, encoding);
}

/* Init */
(function init() {
    var inputFilename = 'gamsrv.in', 
    	outputFilename = 'gamsrv.out', 
    	encoding = 'utf8', 
    	fs = require('fs'),
    	graph = readFile(fs, inputFilename, encoding),    	
    	maxTimeout = 0;
    
    maxTimeout = getResult(graph);
    //console.log("maxTimeout: " + maxTimeout);
    writeFile(fs, outputFilename, maxTimeout, encoding);
})();
