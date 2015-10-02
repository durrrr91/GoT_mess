var margin = {top: 20, right: 10, bottom: 20, left: 10};

var   w = 1200- margin.left - margin.right,
      h = 600 - margin.top - margin.bottom;

var circleWidth = 5;

var palette = {
      "lightgray": "#819090",
      "gray": "#708284",
      "mediumgray": "#536870",
      "darkgray": "#475B62",

      "darkblue": "#0A2933",
      "darkerblue": "#042029",

      "paleryellow": "#FCF4DC",
      "paleyellow": "#EAE3CB",
      "yellow": "#A57706",
      "orange": "#BD3613",
      "red": "#D11C24",
      "pink": "#C61C6F",
      "purple": "#595AB7",
      "blue": "#2176C7",
      "green": "#259286",
      "yellowgreen": "#738A05"
  }

var nodes = [
      { name: "Tywin Lannister", house: "Lannister", married: [7], img: "tywin.jpg"},
      { name: "Tyrion Lannister", house: "Lannister", parents: [0,7], img: "tyrion.jpg"},
      { name: "Jaime Lannister", house: "Lannister", parents: [0,7], img: "jaime.jpg"},
      { name: "Cersei Lannister", house: "Lannister", parents: [0,7], img: "cersei.jpg"},
      { name: "Myrcella Baratheon", house: "Baratheon", parents: [3,8], img: "myrcella.png"},
      { name: "Tommen Baratheon", house: "Baratheon", parents: [3,8], img: "tommen.jpg"},
      { name: "Joffrey Baratheon", house: "Baratheon", parents: [3,8], img: "joffrey.jpg"},
      { name: "Joanna Lannister", house: "Lannister", img: "joanna.jpg"},
      { name: "Robert Baratheon", house: "Baratheon", married: [3], img: "robert.jpg"},
      { name: "Gendry", house: "Baratheon", parents: [8], img: "gendry.jpg"},
      { name: "Eddard Stark", house: "Stark", married: [11], img: "eddard.jpg"},
      { name: "Catelyn Stark", house: "Tully", img: "catelyn.jpg"},
      { name: "Jon Snow", house: "Snow", parents: [10], img: "jon.jpg"},
      { name: "Robb Stark", house: "Stark", parents: [10,11], img: "robb.jpg"},
	  { name: "Rickon Stark", house: "Stark", parents: [10,11], img: "rickon.jpg"},
	  { name: "Bran Stark", house: "Stark", parents: [10,11], img: "bran.jpg"},
	  { name: "Arya Stark", house: "Stark", parents: [10,11], img: "arya.jpg"},
	  { name: "Sansa Stark", house: "Stark", parents: [10,11], img: "sansa.jpg"}
];
var links = [];

for (var i = 0; i< nodes.length; i++) {
    if (nodes[i].parents !== undefined) {
            for (var x = 0; x< nodes[i].parents.length; x++ ) {
                  links.push({
                        source: nodes[i],
                        target: nodes[nodes[i].parents[x]],
                  		relationship: "parents"
                  })
            }
      }
    if (nodes[i].married !== undefined) {
            for (var x = 0; x< nodes[i].married.length; x++ ) {
                  links.push({
                        source: nodes[i],
                        target: nodes[nodes[i].married[x]],
                  		relationship: "married"
                  })
            }
      }
}

var myChart = d3.select('#chart').append('svg')
	.attr('width', w + margin.left + margin.right)
	.attr('height', h + margin.top + margin.bottom)
	.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var force = d3.layout.force()
	.nodes(nodes)
	.links([])
	.gravity(0)
	.charge(0)
	.size([w, h])

var link = myChart.selectAll('line')
	.data(links).enter().append('line')
	.attr('stroke', function(d){
		if(d.relationship == "parents"){
			console.log(d);
			if(d.target.house == "Lannister" || d.target.house == "Baratheon"){
				return palette.yellow;
			}else{
				return palette.red;
			}
		}else if(d.relationship == "married"){
			return palette.blue;
		}else{
			return palette.pink;
		}
	})

var node = myChart.selectAll('circle')
	.data(nodes).enter()
	.append('g')
	.call(force.drag);

node.append('circle')
	.attr('cx', function(d) { return d.x; })
	.attr('cy', function(d) { return d.y; })
	.attr('r', circleWidth )
	.attr('fill', palette.pink)

node.append('text')
	.text(function(d) { return d.name})
	.attr('font-family', 'Helvetica Neue')
	.attr('fill', "#FFF")
	.attr('x', circleWidth + 4)
	.attr('y', circleWidth)
	.attr('font-size','0.7em')

node.append('svg:image')
	.attr('x', circleWidth+6)
	.attr('y', circleWidth+5)
	.attr('width', 80)
	.attr('height', 80)
	.attr("xlink:href",function(d) { 
		if(d.img){
			return "img/"+d.img;
		}else{
			return "img/unknown.jpg";
		}
	})

force.on('tick', function(e) {
	node.attr('transform', function(d, i) {
		return 'translate('+ d.x +', '+ d.y +')';
	})
	link
		.attr('x1', function(d) { return d.source.x })
		.attr('y1', function(d) { return d.source.y })
		.attr('x2', function(d) { return d.target.x })
		.attr('y2', function(d) { return d.target.y })
})


force.start();

