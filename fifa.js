d3.csv("/Data/complete.csv", function(data) {
  buildChart(data);
  buildTable(data);
});
function buildChart(data){
	
	var leagues = ["Spanish","English","French","German","Italian"];
	var avgs = [];



	for (var i = 0; i < leagues.length; i++) {
		var l = leagues[i];
		var result = data.filter(function( obj ) {
		  return obj.league.includes(l);
		});
		var finalArray = result.map(function (obj) {
		  return {name:obj.name,overall:Number(obj.overall),league:obj.league};
		});
		
		finalArray.sort(function(a, b){
		    var keyA = (a.overall),
		        keyB = (b.overall);
		    // Compare the 2 dates
		    if(keyA < keyB) return 1;
		    if(keyA > keyB) return -1;
		    return 0;
		});
		// console.log(finalArray.slice(0,100))
		var ratings = finalArray.slice(0,100).map(function (obj) {
		  return obj.overall;
		});
		var sum = ratings.reduce(function(a, b) { return a + b; });
		var avg = sum / ratings.length;
		// console.log(avg);
		avgs.push({league:l,average:avg});

	}

	


	var margin = {top: 20, right: 20, bottom: 40, left: 40},
	    width = 420 - margin.left - margin.right,
	    height = 270 - margin.top - margin.bottom;
	var chart = d3.select("#chart")
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	// Add scales
	var xScale = d3.scaleBand()
	    .domain(data.map(function(d) { return d.league; }))
	    .rangeRound([0, width-20])
	    .padding(0.1);
	var yScale = d3.scaleLinear()
	    .domain([d3.min(avgs, (d) => d.average)-2, d3.max(avgs, (d) => d.average)])
	    .rangeRound([height, 0]);
	// Add x-axis
	chart.append("g")
	    .attr("class", "axis axis-x")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(xScale));
	// Add y-axis
	chart.append("g")
	    .attr("class", "axis axis-y")
	    .call(d3.axisLeft(yScale).ticks(7));
	    
	//Sample enter, update and exit loop
	function drawChart(dataSet) {
		//xScale domain needs to change based on data set
		xScale.domain(dataSet.map(function(d) { return d.league; }));
		chart.select("g .axis-x")
		    // .transition()
		    // .duration(1000)
		    .call(d3.axisBottom(xScale));
		    
		var bars = chart.selectAll("rect");

		bars
		    .data(dataSet)
		    .enter()
		    .append("rect")
		    .attr("x", function(d) {return xScale(d.league);})
		    .attr("y", function(d) { return yScale(d.average); })
		.merge(bars)	
		    .transition()
		    // .duration(1000)
		    .attr("x", function(d) {return xScale(d.league);})
		    .attr("y", function(d) { return yScale(d.average); })
		    .attr("width", function(d) {return xScale.bandwidth()-20;})
		    .attr("height", function(d) { return height - yScale(d.average); })
		    .attr("class", "svgRect");

		bars.data(dataSet).exit().remove();
	}
	drawChart(avgs);

	
	console.log(avgs)

}
function buildTable(data){

	var leagues = ["Spanish","English","French","German","Italian"];
	var names_ = [];
	var keys = ["Name","Overall","Nationality","League"];


	for (var i = 0; i < leagues.length; i++) {
		var l = leagues[i];
		var x = document.createElement("IMG");
		    
		var result = data.filter(function( obj ) {
		  return obj.league.includes(l);
		});
		var finalArray = result.map(function (obj) {
			// x.setAttribute("src", obj.photo);
		 //    x.setAttribute("width", "25");
		 //    x.setAttribute("height", "25");
		    // x.setAttribute("alt", "The Pulpit Rock");
		  return {Name:obj.name,Overall:Number(obj.overall),Nationality:obj.nationality,League:obj.league};
		});
		
		finalArray.sort(function(a, b){
		    var keyA = (a.Overall),
		        keyB = (b.Overall);
		    // Compare the 2 dates
		    if(keyA < keyB) return 1;
		    if(keyA > keyB) return -1;
		    return 0;
		});
		// console.log(finalArray.slice(0,100))
		// var ratings = finalArray.slice(0,100).map(function (obj) {
		//   return obj.overall;
		// });
		names_.push({league:l,names:finalArray.slice(0,100)});
		// var sum = ratings.reduce(function(a, b) { return a + b; });
		// var avg = sum / ratings.length;
		// console.log(avg);
		// avgs.push(table);

	}
	console.log(names_);

	function tabulate(data, columns) {
		var table = d3.select('#names').append('table').attr("id","table-names");
		var thead = table.append('thead')
		var	tbody = table.append('tbody');

		// append the header row
		thead.append('tr')
		  .selectAll('th')
		  .data(columns).enter()
		  .append('th')
		    .text(function (column) { return column; });

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .append('tr');

		// create a cell in each row for each column
		var cells = rows.selectAll('td')
		  .data(function (row) {
		    return columns.map(function (column) {
		      return {column: column, value: row[column]};
		    });
		  })
		  .enter()
		  .append('td')
		    .text(function (d) { return d.value; });

	  return table;
	}

	// render the table(s)
	tabulate(names_[0].names, keys); // 2 column table

}