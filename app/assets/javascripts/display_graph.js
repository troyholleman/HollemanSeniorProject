	
	//  var categories = <%= @categories.to_json.html_safe %>;
	var tasks = gon.tasks;
	var categories = gon.categories;
	
	// var width = 960,
			// height = 500,
			// radius = Math.min(width, height) / 2;
// 	
	// // var color = d3.scale.ordinal()
			// // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
// 	
	// var arc = d3.svg.arc()
			// .outerRadius(radius - 10)
			// .innerRadius(0);
// 	
	// var pie = d3.layout.pie()
			// .sort(null)
			// .value(
				// // return d.population;
				// function(d) { return 5; }
			// );
// 	
	// var svg = d3.select("#graph2").append("svg")
			// .attr("width", width)
			// .attr("height", height)
		// .append("g")
			// .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
// 	
// 	
	// var g = svg.selectAll(".arc")
			// // .data(pie(data))
			// .data(pie(categories.length))
		// .enter()
			// .append("g")
			// .attr("class", "arc");
// 
	// g.append("path")
		// .attr("d", arc)
		// // .style("fill", function (d) { return color(d.data.age); });
		// .style("fill", "#666666");
// 
	// g.append("text")
		// .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
		// .attr("dy", ".35em")
		// .style("text-anchor", "middle")
		// .text(function (d) { return d.name; });
		
	var w = 300;
	var h = 300;

	var dataset = [ 5, 10, 20, 45, 6, 25 ];

	var outerRadius = w / 2;
	var innerRadius = 0;
	
	var arc = d3.svg.arc()
					.innerRadius(innerRadius)
					.outerRadius(outerRadius);
	
	var pie = d3.layout.pie();
	
	//Easy colors accessible via a 10-step ordinal scale
	var color = d3.scale.category10();

	//Create SVG element
	var svg = d3.select("#graph2")
				.append("svg")
				.attr("width", w)
				.attr("height", h);
	
	//Set up groups
	var arcs = svg.selectAll("g.arc")
				  .data(pie(dataset))
				  .enter()
				  .append("g")
				  //.attr("class", "arc")
				  .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
	
	//Draw arc paths
	arcs.append("path")
	    .attr("fill", function(d, i) {
	    	return color(i);
	    })
	    .attr("d", arc);
	
	//Labels
	arcs.append("text")
	    .attr("transform", function(d) {
	    	return "translate(" + arc.centroid(d) + ")";
	    })
	    .attr("text-anchor", "middle")
	    .text(function(d) {
	    	return d.value;
	    });