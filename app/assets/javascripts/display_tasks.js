
	
	// var tasks = <%= @tasks.to_json.html_safe %>;
	var tasks = gon.tasks;
	
	// I thought this was built in? My console seems to have a date.diff function.
	var daysUntil = function (date) {
    var today = new Date();
    return Math.floor((date.valueOf() - today.valueOf()) / (1000 * 3600 * 24));
	};
	
	var taskPosition = function (task) {
    var diff = daysUntil(new Date(task.deadline));
     
    switch (task.priority) {
      case 1:
        return [200 - (diff * 3), 150];
        break;
      case 2:
        return [200 - (diff * 3), 275];
        break;
      case 3:
        return [200 - (diff * 3), 400];
        break;
    };
	};
	
	var sampleSVG = d3.select("#graph")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);
	
	var popup = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
	
	sampleSVG
	  .selectAll("circle")
	  	.data(tasks)
	  .enter()
	  	.append("circle")
	  
	  .style("stroke", "gray")
	  .style("fill", "white")
	  
	  .attr("height", 40)
	  .attr("width", 75)
	  .attr("r", 10)
	  .attr("cx", function (task) { return taskPosition(task)[0] })
	  .attr("cy", function (task) { return taskPosition(task)[1] })
	
	  .on("click", function (task) {
	  	div.transition()
        .duration(200)
        .style("opacity", .9);
      popup.html(task.name)
			 .style("left", (d3.event.pageX) + "px")
			 .style("top", (d3.event.pageY - 28) + "px");
	   })
	   
	  .on("mouseout", function (task) {
      div.transition()
       .duration(500)
       .style("opacity", 0);
	  });