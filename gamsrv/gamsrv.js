/* Vertex class */
var Vertex = function(label, isClient) {
        this.label = label;
        this.isClient = isClient;
        this.outboundEdges = [];
    }

/* Edge class */
var Edge = function Edge(startVertex, endVertex, weight) {
        this.startVertex = startVertex;
        this.endVertex = endVertex;
        this.weight = weight;
}

/* Graph class */
var Graph = function Graph(vertices, edges) {
        this.vertices = vertices;
        this.edges = edges;
}

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
    graph = new Graph(vertices);
    return graph;
}

/* Dijkstra's algorithm */
function dijkstra(graph, startVertex, heap) {
	var distances = [], 
		result = [],		
		distance = 0,
		heapCol = [],
		shortestDistanceLabel = 0,
		shortestDistanceVertex = 0,
		neighborVertex = 0,
		heap = heap,
		alternativeDistance = 0;
	
	for (var i = 0, length = graph.vertices.length; i < length; i++) {
		distances.push(Infinity);
	}	
	distances[startVertex.label] = 0;
	heap.push([0, startVertex.label]);

	while (heap.length > 0) {
		heapCol = heap.pop();
		distance = heapCol[0];
		shortestDistanceLabel = heapCol[1];
		shortestDistanceVertex = graph.vertices[shortestDistanceLabel];
		for (var i = 0, length = shortestDistanceVertex.outboundEdges.length; i < length; i++) {
			neighborVertex = shortestDistanceVertex.outboundEdges[i].endVertex;
			alternativeDistance = distances[shortestDistanceVertex.label] + shortestDistanceVertex.outboundEdges[i].weight;			
			if (alternativeDistance < distances[neighborVertex.label]) {
				distances[neighborVertex.label] = alternativeDistance;				
				heap.push([alternativeDistance, neighborVertex.label]);
			}
		}
	}
	
	for (var i = 0, length = graph.vertices.length; i < length; i++) {
		result.push([distances[graph.vertices[i].label], graph.vertices[i].isClient]);
	}

	return [result, heap];
}

/* Problem solving */
function getResult(graph) {
    var maxTimeout = Infinity,
    	distances = 0,
    	maxTimeoutVert,
    	heap = [],
    	actdist = [],
    	test = 0;
    
    for (var i = 0, length = graph.vertices.length; i < length; i++) {
    	maxTimeoutVert = -Infinity;
    	
		if (!graph.vertices[i].isClient) {
			
			actdist = dijkstra(graph, graph.vertices[i], heap);

			distances = actdist[0];
			
			heap = actdist[1];
			for (var j = 0, dislength = distances.length; j < dislength; j++) {
				if (distances[j][1] && distances[j][0] > maxTimeoutVert) {
					maxTimeoutVert = distances[j][0];
				}
			}
			maxTimeout = Math.min(maxTimeout, maxTimeoutVert);
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
    writeFile(fs, outputFilename, maxTimeout, encoding);
})();
