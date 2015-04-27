	
	
	var current_tasks = gon.current_tasks;
	var completed_tasks = gon.completed_tasks;
	var overdue_tasks = gon.overdue_tasks;
	var categories = gon.categories;
	
	var events = "touch release hold tap doubletap dragstart drag dragend dragleft dragright dragup dragdown swipe swipeleft swiperight swipeup swipedown transformstart transform transformend rotate rotateleft rotateright pinch pinchin pinchout";
	
	var width = $("#graph").width(),
			height = 550,
			length = categories.length,
			
			radius = 6,
			radiusAll = 125,
      
      startAngle = Math.PI,
      stepAngle = (2 * Math.PI) / length,
      outerRadius = 2 * radiusAll,
      innerRadius = radiusAll / 4;
      
      cx = width / 2;
      cy = height / 2;
      
  // -------------------------------- HELPER FUNCTIONS -------------------------------- //
	
	// var daysUntil = function (date) {
	  // var today = new Date();
	  // return Math.floor((date.valueOf() - today.valueOf()) / (1000 * 3600 * 24));
	// };
// 	
	// var taskPosition = function (task) {
	  // var diff = daysUntil(new Date(task.deadline));
	  // return diff;
// 	   
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
	// };
	
	if (length == 6) startAngle *= 1.65;
	else if (length == 5) startAngle *= 1.7;
  	else if (length == 4) startAngle *= 1.75;
  	else if (length == 3) startAngle *= 1.8;
  	else if (length == 2) startAngle *= 1.85;
  	else if (length == 1) startAngle *= 1.9;
  	else startAngle *= 2;
	
	var taskPriority = function (task) {
		switch (task.priority) {
			case 1:
				return outerRadius / 3;
				break;
			case 2:
				return outerRadius / 1.5;
				break;
			case 3:
				return outerRadius;
				break;
		};
	};
	
	var fillColor = function (task) {
		switch (task.priority) {
  		case 1:
  			return getCategory(task).color;
  			break;
			case 2:
				return toRgba(getCategory(task).color, 35);
				break;
			case 3:
				return 'rgba(' + 255 + ',' + 255 + ',' + 255 + ',' + .6 + ')';
				break;
		};
	};
	
	var toRgba = function convertHex(hex, opacity) {
		hex = hex.replace('#', '');
		r = parseInt(hex.substring(0, 2), 16);
		g = parseInt(hex.substring(2, 4), 16);
		b = parseInt(hex.substring(4, 6), 16);
		 
		return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
	};
	
	var getCategory = function (task) {
		var cat_id = task.category_id;
		
		for (var categoryIndex in categories) {
			if (categories[categoryIndex].id == cat_id)
				return categories[categoryIndex];
		}
	};
	
	var priorityToText = function (task) {
		switch (task.priority) {
  		case 1:
  			return "High";
  			break;
			case 2:
				return "Medium";
				break;
			case 3:
				return "Low";
				break;
		};
	};
	
	// -------------------------------- D3 Canvas -------------------------------- //
	
	var canvasSVG = d3.select("#graph").append("svg")
		.attr("preserveAspectRatio", "xMidYMin meet")
	  .attr("viewBox", "0 0 " + width + " " + height)
		.attr("width", width)
		.attr("height", height);
	
	var div = d3.select("body").append("div")
	  .attr("class", "info-popup")
	  .style("opacity", 0)
	  .style("display", "none");
	  
	var arc = d3.svg.arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius);
	  
	var arcs = canvasSVG.selectAll("path")
		.data(categories).enter()
		.append("path")
			.attr("d", arc
		    .startAngle( function (cat) { return categories.indexOf(cat) * stepAngle; } )
		    .endAngle( function (cat) { return (categories.indexOf(cat) ) * stepAngle; } )
			)
			// .attr("stroke", function (cat) { return cat.color; })
			.attr("stroke", "#c2c2c2")
			.attr("stroke-width", 3)
			.attr("fill", "none")
			.attr("transform", "translate(" + cx + ", " + cy + ")");
			
	var arcLabels = canvasSVG.selectAll("g.text")
			.data(categories).enter()
			.append("g")
				.append("text")
				.attr("text-anchor", "middle")
				.attr("class", "medium")
				.attr("fill", function (task) { return toRgba('#5c5c5c', 75); })
			  .attr("x", function (cat) {
			  	return cx + Math.cos( startAngle + stepAngle * categories.indexOf(cat) ) * outerRadius;
		  	})
		  	.attr("y", function (cat) {
			  	return cy + Math.sin( startAngle + stepAngle * categories.indexOf(cat) ) * outerRadius;
		  	})
			  .text( function (cat) { return cat.name.toUpperCase(); });
	  
	var center = canvasSVG.append("circle")
			.attr("r", radius * 5)
			.attr("stroke", "#c2c2c2")
			.attr("stroke-width", 3)
			.attr("fill", "none")
			.attr("transform", "translate(" + cx + ", " + cy + ")");
		
	var centerText = canvasSVG.append("text")
			.attr("fill", "#5c5c5c")
		  .attr("text-anchor", "middle")
		  .attr("transform", "translate(" + cx + ", " + (cy + 5) + ")")
		  .text("NOW");
		  
	var force = d3.layout.force()
    .nodes(current_tasks)
    .size([width, height])
    .gravity(0.6)
    .friction(0.2)
    .charge(-150)
    .chargeDistance(200)
    .theta(-1.5)
    .start()
  
	  .on("tick", function (e) {
		  canvasSVG.selectAll("circle.task")
	      .attr("cx", function (task) {
			  	return task.x + Math.cos( startAngle + stepAngle * categories.indexOf(getCategory(task)) ) * taskPriority(task); 	
		  	})
			  .attr("cy", function (task) {
			  	return task.y + Math.sin( startAngle + stepAngle * categories.indexOf(getCategory(task)) ) * taskPriority(task);
		  	});
		});
		
	var circles = canvasSVG.selectAll("circle.task")
  	.data(current_tasks);
  	
  	circles.enter().append("circle")
  		.attr("class", "task")
		  .style("fill", function (task) { return fillColor(task); })
	  	.style("stroke", function (task) { return getCategory(task).color; })
		  
		  .attr("r", radius)
		  .call(force.drag)
	  	
	  	.on("click", function(task) {
	  		div.style("border-color", getCategory(task).color );
		   	div.html(
		    	"<div class='task-info'>" +
		    	
			    	"<h5 class='bold'>" + task.name + "</h5>" + "<br />" +
			    	
			    	"<p class='display-ib bold'>Priority:</p>" + " " +
			    	"<p class='display-ib'>" + priorityToText(task) + "</p>" +
			    	"<div class='clearfix'></div>" +
			    	
			    	"<p class='display-ib bold'>Deadline:</p>" + " " +
			    	"<p class='display-ib'>" + task.deadline + "</p>" +
			    	"<div class='clearfix'></div>" + "</br>" +
			    	
			    	"<p class='bold'>Comments:</p>" + " " +
			    	"<p>" + task.comment + "</p>" +
			    	
		    	"</div>"
		    	);
	  	})
	  	
	  	.each(function(d, i) {
		    Hammer(this, {
		      prevent_default: true,
		      no_mouseevents: true
		    }).on(events, createPopup);
		  });
		  
	// -------------------------------- Hammer.js -------------------------------- //
	
	function createPopup(event) {
	 	if (event.type == "tap") {
	 		div.transition()
		  	.duration(750)
		  	.style("opacity", 1)
		  	.style("display", "table")
		  	.style("left", (event.center.x) + "px")
				.style("top", (event.center.y - 28) + "px");
	 	}
	}
	
  var resetPopups = Hammer(document.getElementById('graph') )
	  .on("doubletap", function(event) {
      div.transition()
	 			.duration(500)
	 			.style("opacity", 0)
	 			.style("display", "none");
 			
 			$('.popover').popover('hide');
		});
	  
	// -------------------------------- Responsive SVG -------------------------------- //

	$(window).resize(function() {
	  var width = $("#graph").width();
	  canvasSVG.attr("width", width);
	  canvasSVG.attr("height", height);
	});
