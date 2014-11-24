	
	
	// var tasks = <%= @tasks.to_json.html_safe %>;
	var tasks = gon.tasks;
	var categories = gon.categories;
	var cat_tasks = gon.cat_tasks;
	
	var width = 500,
			height = 500,
			
			radiusAll = 40,
      maxRadius = radiusAll - 5,
      padding = 8,
      
      // startAngle = Math.PI / 2,
      startAngle = 0,
      stepAngle = 2 * Math.PI / categories.length,
      outerRadius = 2 * radiusAll + padding;
      
      cx = width / 2;
      cy = height / 2;
	
	// I thought this was built in? My console seems to have a date.diff function.
	var daysUntil = function (date) {
	  var today = new Date();
	  return Math.floor((date.valueOf() - today.valueOf()) / (1000 * 3600 * 24));
	};
	
	var taskPosition = function (task) {
	  var diff = daysUntil(new Date(task.deadline));
	  return diff;
	   
	  // switch (task.priority) {
	    // case 1:
	      // return [300 - (diff * 3), 100];
	      // break;
	    // case 2:
	      // return [300 - (diff * 3), 150];
	      // break;
	    // case 3:
	      // return [300 - (diff * 3), 200];
	      // break;
	  // };
	};
	
	var getCategory = function (task) {
		
		var cat_id = task.category_id;
		
		for (var categoryIndex in categories) {
			if (categories[categoryIndex].id == cat_id)
				return categories[categoryIndex];
		}
	};
	
	d3.select("#graph").select('svg').remove();
	
	var sampleSVG = d3.select("#graph")
	  .append("svg")
	  .attr("width", width)
	  .attr("height", height);
	
	var div = d3.select("body").append("div")
	  .attr("class", "info-popup")
	  // ADD COLOR TO POPUP BG HERE
	  .style("opacity", 0);
	  
	var arcs = sampleSVG.selectAll("path")
		.data(categories)
		.enter()
		.append("path")
			.attr("d", d3.svg.arc()
				.innerRadius(0)
		    .outerRadius(outerRadius * 2)
		    .startAngle( function (cat) { return categories.indexOf(cat) * stepAngle; } ) //converting from degs to radians
		    .endAngle( function (cat) { return (categories.indexOf(cat) + 1) * stepAngle; } )
			)
			.attr("stroke", function (cat) { return cat.color; })
			.attr("stroke-width", 5)
			.attr("fill", "none")
			// .style("fill", function (cat) { return cat.color; })
			// .style("opacity", .25)
			.attr("transform", "translate(" + cx + ", " + cy + ")");
	  
	var center = sampleSVG.append('g')
		.attr("class", "center-circle")
		.append("circle")
			.style("stroke", "gray")
			
			.attr("height", 40)
		  .attr("width", 75)
		  .attr("r", 10)
		  
		  .attr("cx", cx)
		  .attr("cy", cy);
	 
	// var cat = sampleSVG.append('g')
		// .data(categories)
		// .attr('cx', function(d, i) { return (width / 2) + Math.cos(startAngle + stepAngle * i) * outerRadius; })
		// .attr('cy', function(d, i) { return (height / 2) + Math.cos(startAngle + stepAngle * i) * outerRadius; });
	
	//for (var t in cat_tasks) {
	function drawCircles(data) {
		
		var circles = sampleSVG.selectAll("g.circle")
	  	.data(data);
	  	
	  	circles.enter()
	  	
	  	.append('g')
	  	.attr("class", "circle");
	
	  	circles.append("circle")
			  .style("fill", function (task) { return getCategory(task).color; })
			  
			  .attr("height", 40)
			  .attr("width", 75)
			  .attr("r", 10)
			  
			  .attr("cx", function (task) {
			  	return cx +
			  	Math.cos( startAngle + stepAngle * categories.indexOf(getCategory(task)) - 2/3) * outerRadius *
			  	// Math.cos( startAngle + stepAngle * categories.indexOf(task) ) * outerRadius *
			  	task.priority * (taskPosition(task) / 7);
		  	})
			  .attr("cy", function (task) {
			  	return cy + 
			  	Math.sin( startAngle + stepAngle * categories.indexOf(getCategory(task)) - 2/3) * outerRadius *
			  	// Math.sin( startAngle + stepAngle * categories.indexOf(task)) * outerRadius *
			  	task.priority * (taskPosition(task) / 7);
		  	})
			  
			  // .attr("transform", "translate()")
			
		  .on("click", function (task) {
		  	div.transition()
		      .duration(200)
		      .style("opacity", .5)
		      .style("background-color", getCategory(task).color );
		    div.html(task.name)
				 .style("left", (d3.event.pageX) + "px")
				 .style("top", (d3.event.pageY - 28) + "px");
		   })
		   
		  .on("mouseout", function (task) {
		    div.transition()
		     .duration(500)
		     .style("opacity", 0);
		  });
		  // circles.exit().remove();
		  console.log("Here");
	}
	
for (var t in cat_tasks) {
	console.log(cat_tasks[t]);
	drawCircles(cat_tasks[t]);
}
	 //}