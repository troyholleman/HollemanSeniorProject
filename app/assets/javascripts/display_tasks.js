	
	// -------- VARIABLES -------- //
	
	var tasks = gon.tasks;
	var categories = gon.categories;
	var cat_tasks = gon.cat_tasks;
	
	var width = 500,
			height = 500,
			
			radius = 6,
			radiusAll = 120,
      maxRadius = radiusAll - 5,
      
      startAngle = Math.PI * 1.7,
      // startAngle = 0,
      stepAngle = (2 * Math.PI) / categories.length,
      outerRadius = 2 * radiusAll,
      innerRadius = radiusAll / 4;
      
      cx = width / 2;
      cy = height / 2;
      
  // -------- HELPER FUNCTIONS -------- //
	
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
	
	var taskPriority = function (task) {
		switch (task.priority) {
			case 1:
				return outerRadius / 3;
				break;
			case 2:
				return outerRadius / 1.75;
				break;
			case 3:
				return outerRadius / 1;
				break;
		};
	};
	
	var fillColor = function (task) {
		switch (task.priority) {
  		case 1:
  			return getCategory(task).color;
  			break;
			case 2:
				return toRgba(getCategory(task).color, 20);
				break;
			case 3:
				return toRgba(getCategory(task).color, 0);
				break;
		};
	};
	
	var toRgba = function convertHex(hex, opacity) {
		hex = hex.replace('#', '');
		r = parseInt(hex.substring(0, 2), 16);
		g = parseInt(hex.substring(2, 4), 16);
		b = parseInt(hex.substring(4, 6), 16);
	
		result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
		return result;
	};
	
	var getCategory = function (task) {
		var cat_id = task.category_id;
		
		for (var categoryIndex in categories) {
			if (categories[categoryIndex].id == cat_id)
				return categories[categoryIndex];
		}
	};
	
	// -------- D3 Canvas -------- //
	
	var canvasSVG = d3.select("#graph")
	  .append("svg")
		  .attr("width", width)
		  .attr("height", height);
	
	var div = d3.select("body").append("div")
	  .attr("class", "info-popup")
	  .style("opacity", 0);
	  
	var arc = d3.svg.arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius);
	  
	var arcs = canvasSVG.selectAll("path")
		.data(categories)
		.enter()
		.append("path")
			.attr("d", arc
		    .startAngle( function (cat) { return categories.indexOf(cat) * stepAngle; } ) //converting from degs to radians
		    .endAngle( function (cat) { return (categories.indexOf(cat) ) * stepAngle; } )
			)
			// .attr("stroke", function (cat) { return cat.color; })
			.attr("stroke", "#c2c2c2")
			.attr("stroke-width", 2)
			.attr("fill", "none")
			.attr("transform", "translate(" + cx + ", " + cy + ")");
			// .append("text")
          // .attr("text-anchor", "middle") //center the text on it's origin
          // .text(function(cat) { return cat.name; });
	  
	var center = canvasSVG.append("text")
		  .attr("transform", "translate(" + cx + ", " + (cy + 5) + ")")
		  .attr("text-anchor", "middle")
		  .text("NOW");
		  
	var force = d3.layout.force()
    .nodes(tasks)
    .size([width, height])
    .start();
  
  force.on("tick", function(e) {
	  canvasSVG.selectAll("circle")
      // .attr("cx", function(d) { return d.x; })
      // .attr("cy", function(d) { return d.y; });
      .attr("cx", function (task) {
			  	return task.x +
			  	// Math.cos( startAngle + stepAngle * categories.indexOf(getCategory(task)) ) * outerRadius *
			  	Math.cos( startAngle + stepAngle * categories.indexOf(getCategory(task)) ) * taskPriority(task); 	
			  	// * task.priority * (taskPosition(task) / 7);
		  	})
			  .attr("cy", function (task) {
			  	return task.y + 
			  	// Math.sin( startAngle + stepAngle * categories.indexOf(getCategory(task)) ) * outerRadius *
			  	Math.sin( startAngle + stepAngle * categories.indexOf(getCategory(task)) ) * taskPriority(task);
			  	// * task.priority * (taskPosition(task) / 7);
		  	});
	});
	 
	// var cat = canvasSVG.append('g')
		// .data(categories)
		// .attr('cx', function(d, i) { return (width / 2) + Math.cos(startAngle + stepAngle * i) * outerRadius; })
		// .attr('cy', function(d, i) { return (height / 2) + Math.cos(startAngle + stepAngle * i) * outerRadius; });
	
	// function drawCircles(data) {
		
		var circles = canvasSVG.selectAll("circle")
	  	.data(tasks);
	  	
	  	circles.enter()	
		  	.append("circle")
				  .style("fill", function (task) { return fillColor(task); })
			  	.style("stroke", function (task) { return getCategory(task).color; })
				  
				  .attr("r", radius)
				  .call(force.drag)
				  
				  // .attr("cx", function (task) {
				  	// return cx +
				  	// // Math.cos( startAngle + stepAngle * categories.indexOf(getCategory(task)) ) * outerRadius *
				  	// Math.cos( startAngle + stepAngle * categories.indexOf(getCategory(task)) ) * taskPriority(task); 	
				  	// // * task.priority * (taskPosition(task) / 7);
			  	// })
				  // .attr("cy", function (task) {
				  	// return cy + 
				  	// // Math.sin( startAngle + stepAngle * categories.indexOf(getCategory(task)) ) * outerRadius *
				  	// Math.sin( startAngle + stepAngle * categories.indexOf(getCategory(task)) ) * taskPriority(task);
				  	// // * task.priority * (taskPosition(task) / 7);
			  	// })
			  	//.attr("transform", "translate(" + Math.floor( Math.random() * 10 ) + ", " + Math.floor( Math.random() * 10 ) + ")")
			
		  .on("click", function (task) {
		  	div.transition()
		      .duration(200)
		      .style("opacity", 1)
		      .style("border-color", getCategory(task).color );
		      
		    div.html(
		    	"<div class='task-info'>" +
			    	"<h5 class='bold'>What you need to do:</h5>" +
			    	"<p>" + task.name + "</p>" +
			    	"<p class='inline bold'>Priority</p>" +
			    	"<p class='inline'>" + ": " + task.priority + "</p>" +
			    	"<div class+'clearfix'></div>" +
			    	"<p class='inline bold'>Deadline</p>" +
			    	"<p class='inline'>" + ": " + task.deadline + "</p>" +
		    	"</div>"
		    	)
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 28) + "px");
		   })
		   
		  .on("mouseout", function (task) {
		    div.transition()
		     .duration(500)
		     .style("opacity", 0);
		  });
	// }
	
// for (var t in cat_tasks) {
	// console.log(cat_tasks[t]);
	// drawCircles(cat_tasks[t]);
// }