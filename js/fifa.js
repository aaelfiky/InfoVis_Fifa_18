d3.csv("/Data/complete.csv", function(data) {


  var leagues = ["Spanish","English","French","German","Italian"];
	var names_ = [];
  var atts_ = [];
  var avgs = [];
	var keys = ["Name","Overall","Nationality","League"];




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

  	avgs.push({league:l,average:avg});

  }

	for (var i = 0; i < leagues.length; i++) {
		var l = leagues[i];
		var x = document.createElement("IMG");

		var result = data.filter(function( obj ) {
		  return obj.league.includes(l);
		});
		var finalArray = result.map(function (obj) { // TABLE
		  return {Name:obj.name,Overall:Number(obj.overall),Nationality:obj.nationality,League:obj.league};
		});

    var finalArray_ = result.map(function (obj) { // ATTRIBUTES
      return {Name:obj.name,Overall:Number(obj.overall),Pac:Number(obj.pac),
        Sho:obj.sho,Pas:obj.pas,Dri:obj.dri,Def:obj.def,Phy:obj.phy};
    });

    var finalArray_2 = result.map(function (obj) { // AVERAGES
      return {name:obj.name,overall:Number(obj.overall),league:obj.league};
    });


		finalArray.sort(function(a, b){
		    var keyA = (a.Overall),
		        keyB = (b.Overall);
		    // Compare the 2 dates
		    if(keyA < keyB) return 1;
		    if(keyA > keyB) return -1;
		    return 0;
		});

    finalArray_.sort(function(a, b){
		    var keyA = (a.Overall),
		        keyB = (b.Overall);
		    // Compare the 2 dates
		    if(keyA < keyB) return 1;
		    if(keyA > keyB) return -1;
		    return 0;
		});



    finalArray_2.sort(function(a, b){
        var keyA = (a.overall),
            keyB = (b.overall);
        // Compare the 2 dates
        if(keyA < keyB) return 1;
        if(keyA > keyB) return -1;
        return 0;
    });
    // console.log(finalArray.slice(0,100))
    var ratings = finalArray_2.slice(0,100).map(function (obj) {
      return obj.overall;
    });
    var sum = ratings.reduce(function(a, b) { return a + b; });
    var avg = sum / ratings.length;

    avgs.push({league:l,average:avg});
    atts_.push({league:l,atts:finalArray_.slice(0,100)});
		names_.push({league:l,names:finalArray.slice(0,100)});

	}


  buildChart(avgs,names_);
  buildPie(data,false);

  buildTable(names_);
  buildMap();
  buildHorizontal();
});

function updateTable(data_) {


  var data = data_;

  // join new data with old elements, if any
  var rows = d3.select("#table-names").select("tbody").selectAll('tr')
      .data(data);

  var rowsEnter = rows.enter()
      .append('tr');

  rowsEnter.append('td')
      .attr("class", "NameCol")
      .text(function(d) {
          return d.Name;
      });
  rowsEnter.append('td')
      .attr("class", "OverallCol")
      .text(function(d) {
          return d.Overall;
      });

  rowsEnter.append('td')
      .attr("class", "NationalityCol")
      .text(function(d) {
          return d.Nationality;
      });
  rowsEnter.append('td')
      .attr("class", "LeagueCol")
      .text(function(d) {
          return d.League;
      });

  d3.selectAll(".NameCol").data(data).text(function(d) {
      return d.Name;
  });
  d3.selectAll(".OverallCol").data(data).text(function(d) {
      return d.Overall;
  });
  d3.selectAll(".NationalityCol").data(data).text(function(d) {
      return d.Nationality;
  });
  d3.selectAll(".LeagueCol").data(data).text(function(d) {
      return d.League;
  });


  rows.exit().remove();

  // }

};

function buildTable(data){

  var leagues = ["Spanish","English","French","German","Italian"];
	var names_ = data;
	var keys = ["Name","Overall","Nationality","League"];


	   var table_data = names_[0].names;

  // var columns = ["Variable", "Value"];
    var columns = keys;


  // create table, etc.
    var table = d3.select('#names').append('table').attr("id","table-names");
    var thead = table.append('thead');
    var tbody = table.append('tbody');

    // append the header row
    thead.append('tr')
        .selectAll('th')
        .data(['Name','Overall','Nationality','League']).enter()
        .append('th')
        .text(function(col_names) {
            return col_names;
        });

    // update function

    updateTable(names_[0].names);


}


function buildChart(avgs,names){

	var leagues = ["Spanish","English","French","German","Italian"];
	// var avgs = [];

	var names_ = names;
	var keys = ["Name","Overall","Nationality","League"];


	var margin = {top: 20, right: 20, bottom: 40, left: 40},
	    width = 540 - margin.left - margin.right,
	    height = 470 - margin.top - margin.bottom;
	var chart = d3.select("#chart")
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	// Add scales
	var xScale = d3.scaleBand()
	    .domain(avgs.map(function(d) { return d.league; }))
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

		var rects = bars
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
    //
    var rect_ = d3.select("#chart").select("g").selectAll("rect").on('click',(d,i)=>{
      console.log(i);
      updateTable(names_[i-5].names);

    })
	}
	drawChart(avgs);


	// console.log(avgs)

}


function buildPie(data){

	var leagues = ["Spanish","English","French","German","Italian"];
	var names_ = [];
	// var keys = ["Name","Overall","Nationality","League"];


	for (var i = 0; i < leagues.length; i++) {
		var l = leagues[i];
		var x = document.createElement("IMG");

		var result = data.filter(function( obj ) {
		  return obj.league.includes(l);
		});
		var finalArray = result.map(function (obj) {
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

		names_.push({league:l,names:finalArray.slice(0,100)});


	}


	var nats = names_[0].names.map(a => a.Nationality);

	var counts = {};
	nats.forEach(function(d) {
	  if (!counts[d]) {
	    counts[d] = 0;
	  }
	  counts[d]++;
	});

	var natCounts = d3.entries(counts);

	var other = 0;


	var new_natCounts = [];

	for (var i = 0; i < natCounts.length; i++) {
		var tt = natCounts[i];

		if(tt.value <3){
			other = other+1;
		}
		else{
			new_natCounts.push({key:tt.key,value:tt.value});
		}
	}
	new_natCounts.push({key:"Other Nationalities",value:other});


	var margin = {top:20 ,right:20, bottom:20, left:20},
    width = 500 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom,
    radius = width/2;

	// color range
	var color = d3.scaleOrdinal()
	.range(["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2"]);

	//Arc generator
	var arc = d3.arc()
	    .outerRadius(radius-10)
	    .innerRadius(0);

	var labelArc = d3.arc()
	    .outerRadius(radius - 50)
	    .innerRadius(radius -50);

	//Pie generator
	var pie = d3.pie()
	    .sort(function(a, b) {
			return a.value>b.value;
		})
	    .value(function(d){return d.value;});

	//Define svg
	var svg = d3.select("#pie")
	    .attr("width",width)
	    .attr("height",height)
	    .append("g")
	    .attr("transform","translate(" + width / 2 +"," + height / 2 + ")");

    //Append g elements
    var g = svg.selectAll(".arc")
        .data(pie(new_natCounts))
        .enter().append("g")
        .attr("class","arc");
    //Append the path of the arc
    g.append("path")
        .attr("d",arc)
        .style("fill",function(d){return color(d.data.key);})

    //Append the text (labels)
    g.append("text")
        .attr("transform",function(d){return "translate(" + labelArc.centroid(d) + ")";})
        .attr("dy",".35em")
        .text(function(d){return d.data.key; });

}

function buildStar(){
	var margin = {
	  top: 36,
	  right: 50,
	  bottom: 20,
	  left: 50
	};
	var width = 240 - margin.left - margin.right;
	var height = 240 - margin.top - margin.bottom;
	var labelMargin = 8;
	var scale = d3.scaleLinear()
	  .domain([0, 4])
	  .range([0, 100])
	d3.csv('Data/complete.csv')
	  .row(function(d) {
	    d.pac = +d.pac;
	    d.sho = +d.sho;
	    d.pas = +d.pas;
	    d.dri = +d.dri;
	    d.def = +d.def;
	    d.phy = +d.phy;
	      return d;
	  })
	  .get(function(error, rows) {
	    var star = d3.starPlot()
	      .width(width)
	      .accessors([
	        function(d) { return scale(d.pac); },
	        function(d) { return scale(d.sho); },
	        function(d) { return scale(d.pas); },
	        function(d) { return scale(d.dri); },
	        function(d) { return scale(d.def); },
	        function(d) { return scale(d.phy); },
	      ])
	      .labels([
	        'pac',
	        'sho',
	        'pas',
	        'dri',
	        'def',
	        'phy',
	      ])
	      .title(function(d) { return d.name; })
	      .margin(margin)
	      .labelMargin(labelMargin)
	      r = rows.slice(0,1)
	      r.forEach(function(d, i) {
	      star.includeLabels(i+1);
	      d3.select('#target').append('svg')
	        .attr('class', 'chartt')
	        .attr('width', width + margin.left + margin.right)
	        .attr('height', width + margin.top + margin.bottom)
	        .append('g')
	        .datum(d)
	        .call(star)
	        // console.log((d))
	    });
	  });
}


function buildMap(){
  const format = d3.format(',');

  // Set tooltips
  const tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(d => `<strong>Country: </strong><span class='details'>${d.properties.name}<br></span><strong>Population: </strong><span class='details'>${format(d.population)}</span>`);

  const margin = {top: 0, right: 0, bottom: 0, left: 0};
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const color = d3.scaleThreshold()
    .domain([
      10000,
      100000,
      500000,
      1000000,
      5000000,
      10000000,
      50000000,
      100000000,
      500000000,
      1500000000
    ])
    .range([
      'rgb(247,251,255)',
      'rgb(222,235,247)',
      'rgb(198,219,239)',
      'rgb(158,202,225)',
      'rgb(107,174,214)',
      'rgb(66,146,198)',
      'rgb(33,113,181)',
      'rgb(8,81,156)',
      'rgb(8,48,107)',
      'rgb(3,19,43)'
    ]);

  const svg = d3.select('#choro')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('class', 'map');

  const projection = d3.geoRobinson()
    .scale(148)
    .rotate([352, 0, 0])
    .translate( [width / 2, height / 2]);

  const path = d3.geoPath().projection(projection);

  svg.call(tip);

  queue()
    .defer(d3.json, 'js/world_countries.json')
    .defer(d3.tsv, 'Data/world_population.tsv')
    .await(ready);

  function ready(error, data, population) {
    const populationById = {};

    population.forEach(d => { populationById[d.id] = +d.population; });
    data.features.forEach(d => { d.population = populationById[d.id] });

    svg.append('g')
      .attr('class', 'countries')
      .selectAll('path')
      .data(data.features)
      .enter().append('path')
        .attr('d', path)
        .style('fill', d => color(populationById[d.id]))
        .style('stroke', 'white')
        .style('opacity', 0.8)
        .style('stroke-width', 0.3)
        // tooltips
        .on('mouseover',function(d){
          tip.show(d);
          d3.select(this)
            .style('opacity', 1)
            .style('stroke-width', 3);
        })
        .on('mouseout', function(d){
          tip.hide(d);
          d3.select(this)
            .style('opacity', 0.8)
            .style('stroke-width',0.3);
        });

    svg.append('path')
      .datum(topojson.mesh(data.features, (a, b) => a.id !== b.id))
      .attr('class', 'names')
      .attr('d', path);
  }
}


function buildHorizontal(){
  var data = [{"Attribute":"Pace","Value":33},{"Attribute":"Sho","Value":12},{"Attribute":"pass","Value":41},
  {"Attribute":"Dri","Value":16},{"Attribute":"Phy","Value":59},{"Attribute":"Def","Value":38}];

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // set the ranges
  var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

  var x = d3.scaleLinear()
            .range([0, width]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var title = d3.select("#horz").append("h3").text("Cristiano Ronaldo").style("text-align","center")
  .style("font-family","sans-serif").style("color","steelblue");
  var svg = d3.select("#horz").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    data.forEach(function(d) {
      d.Value = +d.Value;
    });

    // Scale the range of the data in the domains
    x.domain([0, d3.max(data, function(d){ return d.Value; })])
    y.domain(data.map(function(d) { return d.Attribute; }));
    //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        //.attr("x", function(d) { return x(d.sales); })
        .attr("width", function(d) {return x(d.Value); } )
        .attr("y", function(d) { return y(d.Attribute); })
        .attr("height", y.bandwidth()).style("fill","steelblue");

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
}
