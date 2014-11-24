$(function() {
    d3.select('#graph2')
    .datum({
        Name: 'Total Widgets',
        Value: 224,
        Clusters: [
            ['Other', 45],
            ['FooBars', 30],
            ['Foos', 50],
            ['Bars', 124],
            ['BarFoos', 0]
        ]
    })
    .call( clusterChart() );

});

function clusterChart() {
    var width = 500,
        radiusAll = 90,
        maxRadius = radiusAll - 5,
        padding = 8, 
        height = 3 * (radiusAll*2 + padding),
        startAngle = Math.PI / 2,
        val = function(d) { return d; },
        onTotalMouseOver = null,
        onTotalClick = null,
        onClusterMouseOver = null,
        onClusterClick = null;

    function chart(selection) {
        selection.each(function(data) {

            var cx = width / 2,
                cy = height / 2,
                stepAngle = 2 * Math.PI / data.Clusters.length,
                outerRadius = 2*radiusAll + padding;


            //  Remove svg, if already exist
            d3.select(this).select('svg').remove();

            //  Add svg element
            var svg = d3.select(this).append('svg')
                .attr('class', 'cluster-chart')
                .attr("viewBox", "0 0 " + width + " " + height )
                .attr("preserveAspectRatio", "xMidYMin meet")
                .attr('width', width)
                .attr('height', height);

            //  Total group value
            var totalCluster = svg.append('g')
                .attr('class', 'total-cluster');
                
            totalCluster.append('circle')
                .attr('cx', cx)
                .attr('cy', cy)
                .attr('r', radiusAll)
                .on('mouseover', onTotalMouseOver)
                .on('click', onTotalClick);

            totalCluster.append('text')
                .attr('class', 'value')
                .attr('x', cx)
                .attr('y', cy + 4)
                .text(val(data.Value));
            
            totalCluster.append('text')
                .attr('class', 'group-name')
                .attr('x', cx)
                .attr('y', cy + 16)
                .text(val(data.Name));

            //  Clusters values
            var cluster =  svg.selectAll('g.cluster')
                .data(data.Clusters)
                .enter().append('g')
                .attr('class', function(d, i) { 
                    if(d[1] === 0){ return 'cluster empty'}
                    else {return 'cluster'}
                });
                
            cluster.append('circle')
                .attr('cx', function(d, i) { return cx + Math.cos(startAngle + stepAngle * i) * outerRadius; })
                .attr('cy', function(d, i) { return cy + Math.sin(startAngle + stepAngle * i) * outerRadius; })
                .attr("r", 50)
                .on('mouseover', function(d, i, j) {
                    //do something
                    if (onClusterMouseOver != null) onClusterMouseOver(d, i, j);
                })
                .on('mouseout', function() {
                    //do something
                })
                .on('click', function(d, i){ onClusterClick(d); });  
            
            cluster.append('text')
                .attr('class', 'value')
                .attr('x', function(d, i) { return cx + Math.cos(startAngle + stepAngle * i) * outerRadius; })
                .attr('y', function(d, i) { return cy + Math.sin(startAngle + stepAngle * i) * outerRadius - 4; })
                .text(function(d) { return val(d[1]); });
            
            cluster.append('text')
                .attr('class', 'group-name')
                .attr('x', function(d, i) { return cx + Math.cos(startAngle + stepAngle * i) * outerRadius; })
                .attr('y', function(d, i) { return cy + Math.sin(startAngle + stepAngle * i) * outerRadius + 16; })
                .text(function(d) { return val(d[0]); });

            $(window).resize(function() {
              var w = $('.cluster-chart').width(); //make this more generic
              svg.attr("width", w);
              svg.attr("height", w * height / width);
            });

        });
        

    }


    

    return chart;
 }