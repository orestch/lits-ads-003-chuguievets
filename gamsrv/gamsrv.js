var Vertex=function(a,b){this.label=a;this.isClient=b;this.outboundEdges=[]},Edge=function(a,b,c){this.startVertex=a;this.endVertex=b;this.weight=c},Graph=function(a,b){this.vertices=a;this.edges=b};
function readFile(a,b,c){a=a.readFileSync(b,c).toUpperCase().split("\n");b=[];edgesNumber=verticesNumber=0;clients=[];vertices=[];edge={};reversedEdge={};edges=[];graph={};isClient=!1;weight=endVertex=startVertex=0;b=a[0].split(" ").map(Number);verticesNumber=b[0];edgesNumber=b[1];clients=a[1].split(" ").map(function(a){Number(a);return a-1});for(c=b=0;b<verticesNumber;b++)clients[c]==b&&(isClient=!0,c++),vertices.push(new Vertex(b,isClient)),isClient=!1;for(b=2;b<edgesNumber+2;b++)edge=a[b].split(" ").map(Number),
startVertex=edge[0]-1,endVertex=edge[1]-1,weight=edge[2],edge=new Edge(vertices[startVertex],vertices[endVertex],weight),vertices[startVertex].outboundEdges.push(edge),reversedEdge=new Edge(vertices[endVertex],vertices[startVertex],weight),vertices[endVertex].outboundEdges.push(reversedEdge),edges.push(edge),edges.push(reversedEdge);return graph=new Graph(vertices,edges)}function BinaryHeap(a){this.content=[];this.scoreFunction=a}
BinaryHeap.prototype={push:function(a){this.content.push(a);this.bubbleUp(this.content.length-1)},pop:function(){var a=this.content[0],b=this.content.pop();0<this.content.length&&(this.content[0]=b,this.sinkDown(0));return a},remove:function(a){for(var b=this.content.length,c=0;c<b;c++)if(this.content[c]==a){a=this.content.pop();if(c==b-1)break;this.content[c]=a;this.bubbleUp(c);this.sinkDown(c);break}},size:function(){return this.content.length},bubbleUp:function(a){for(var b=this.content[a],c=this.scoreFunction(b);0<
a;){var g=Math.floor((a+1)/2)-1,e=this.content[g];if(c>=this.scoreFunction(e))break;this.content[g]=b;this.content[a]=e;a=g}},sinkDown:function(a){for(var b=this.content.length,c=this.content[a],g=this.scoreFunction(c);;){var e=2*(a+1),f=e-1,d=null;if(f<b){var k=this.scoreFunction(this.content[f]);k<g&&(d=f)}e<b&&this.scoreFunction(this.content[e])<(null==d?g:k)&&(d=e);if(null==d)break;this.content[a]=this.content[d];this.content[d]=c;a=d}}};
function dijkstra(a,b){for(var c=[],g=[],e=new BinaryHeap(function(a){return a}),f=[],d=f=f=0,k=0,h=0,l=a.vertices.length;h<l;h++)c.push(Infinity);c[b.label]=0;for(e.push([0,b.label]);0<e.content.length;)for(f=e.pop(),f=f[1],f=a.vertices[f],h=0,l=f.outboundEdges.length;h<l;h++)d=f.outboundEdges[h].endVertex,k=c[f.label]+f.outboundEdges[h].weight,k<c[d.label]&&(c[d.label]=k,e.push([k,d.label]));h=0;for(l=a.vertices.length;h<l;h++)g.push([c[a.vertices[h].label],a.vertices[h].isClient]);return g}
function getResult(a){for(var b=Infinity,c,g,e=0,f=a.vertices.length;e<f;e++)if(g=-Infinity,!a.vertices[e].isClient){c=dijkstra(a,a.vertices[e]);for(var d=0,k=c.length;d<k;d++)c[d][1]&&c[d][0]>g&&(g=c[d][0]);b=Math.min(b,g)}return b}function writeFile(a,b,c,g){a.writeFileSync(b,c,g)}(function(){var a=require("fs"),b=readFile(a,"gamsrv.in","utf8"),b=getResult(b);writeFile(a,"gamsrv.out",b,"utf8")})();
