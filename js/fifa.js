d3.csv("Data/complete.csv", function(data) {


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
      return {Name:obj.name,Overall:Number(obj.overall),Pace:Number(obj.pac),
        Shoot:obj.sho,Pass:obj.pas,Dri:obj.dri,Def:obj.def,Phy:obj.phy};
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
  var all_nats = [];


  for (var n = 0; n<names_.length; n++){

    var nats = names_[n].names.map(a => a.Nationality);

  	var counts = {};
  	nats.forEach(function(d) {
  	  if (!counts[d]) {
  	    counts[d] = 0;
  	  }
  	  counts[d]++;
  	});

  	var natCounts = d3.entries(counts);
    all_nats.push({"League":names_[n].league,"Nats":natCounts});

  }

  // console.log(all_nats);


	// var other = 0;


	// var new_natCounts = [];
  //
	// for (var i = 0; i < natCounts.length; i++) {
	// 	var tt = natCounts[i];
  //
	// 	if(tt.value <3){
	// 		other = other+1;
	// 	}
	// 	else{
	// 		new_natCounts.push({key:tt.key,value:tt.value});
	// 	}
	// }
	// new_natCounts.push({key:"Other Nationalities",value:other});


  // console.log(atts_);
  buildChart(avgs,names_,atts_,all_nats);
  // buildPie(data,false);
  buildTable(names_,atts_);
  buildMap(all_nats[0].Nats,false,all_nats[0].League);
  buildHorizontal(atts_[0].atts[0],false);
});

function updateTable(data_,index,atts,name) {

  var data = data_;

  // join new data with old elements, if any
  var title = d3.select("#table-names").select("caption").text(name + " League Top 100 Players");
  var rows = d3.select("#table-names").select("tbody").selectAll('tr')
      .data(data);

  // console.log("RW: ",rows);

  var rowsEnter = rows.enter()
      .append('tr');



  rowsEnter.append('td')
      .attr("class", "NameCol")
      .text(function(d) {
          return d.Name;
      });

  // console.log("ROWS: ",rowsEnter);
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

  d3.select("#table-names").select("tbody").selectAll("tr").on("click",function(d,i){
    // console.log("T: ",atts.atts[i]);
    buildHorizontal(atts.atts[i],true);
  });


  rows.exit().remove();

  // }

};

function buildTable(data,atts_){

    var leagues = ["Spanish","English","French","German","Italian"];
  	var names_ = data;
  	var keys = ["Name","Overall","Nationality","League"];


    var table_data = names_[0].names;
    console.log(names_[0]);

  // var columns = ["Variable", "Value"];
    var columns = keys;


  // create table, etc.
    var table = d3.select('#names').append("div").attr("id","names_sub").append('table').attr("id","table-names");
    var title = table.append("caption");
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

    updateTable(names_[0].names,0,atts_[0],names_[0].league);


}


function buildChart(avgs,names,atts_,all_nats){

	var leagues = ["Spanish","English","French","German","Italian"];
	// var avgs = [];

	var names_ = names;
	var keys = ["Name","Overall","Nationality","League"];




	var margin = {top: 50, right: 20, bottom: 40, left: 40},
	    width = 440 - margin.left - margin.right,
	    height = 370 - margin.top - margin.bottom;
	var chart = d3.select("#chart")
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      chart.append("text")
                .attr("class","chart-name")
                .attr("x", (width / 2))
                .attr("y", 0 )
                .attr("text-anchor", "middle")
                .style("font", "16px sans-serif").style("fill","darkblue").style("font-weight","bold")
                .text("Overall Ratings");
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

    var on_over = d3.select("#chart").select("g").selectAll("rect").on("mouseover",function(d){
      d3.select(this).style("fill","lightblue").style("cursor","pointer");
    });
    var on_out = d3.select("#chart").select("g").selectAll("rect").on("mouseout",function(d){
      d3.select(this).style("fill","steelblue");
    });
    //
    var rect_ = d3.select("#chart").select("g").selectAll("rect").on('click',(d,i)=>{
      console.log(i);
      updateTable(names_[i-5].names,i-5,atts_[i-5],all_nats[i-5].League);
      buildMap(all_nats[i-5].Nats,true,all_nats[i-5].League);

    })
	}
	drawChart(avgs);


	// console.log(avgs)

}


function buildMap(data_,update,name){
  const format = d3.format(',');

  // Set tooltips
  const tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(d => `<strong>Country: </strong><span class='details'>${d.properties.name}<br></span><strong>Count: </strong><span class='details'>${format(d.population)}</span>`);

  const margin = {top: -30, right: 0, bottom: 0, left: 0};
  const width = 750 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const color = d3.scaleThreshold()
    .domain([
      1,
      4,
      8,
      12,
      16,
      20,
      24,
      28,
      32,
      36
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

    const projection = d3.geoRobinson()
      .scale(120)
      .rotate([352, 0, 0])
      .translate( [width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

  if(update){

    queue()
      .defer(d3.json, 'js/world_countries.json')
      .await(ready);

    function ready(error, data) {

      var populationById = {};
      // console.log(data_);
      data_.forEach(d => { populationById[d.key] = +d.value; });

      // console.log("POP BY ID: ",populationById);
      data.features.forEach(d => { d.population = populationById[d.properties.name]; });
      data.features.forEach(function(d){
        if(d.population == null){
          d.population = 0;
        }
      });
      var svg_ = d3.select("#choro").select(".map");
      var title = d3.select("#choro").select(".l-name").text(name + " League Distributions").style("fill","darkblue");
      svg_.call(tip);
      // console.log("D FEATURES: ",data.features);
      var selection = d3.select("#choro").select("svg")
      .select(".map").select(".countries").selectAll("path");


      // console.log(selection);
      var update_ = selection.data(data.features).enter();

      var update_path = selection.attr('d', path).style('fill',
        function(d){
          if(populationById[d.properties.name]==null){
            return "#f7f7f7";
          }
          else {return color(populationById[d.properties.name]);}
      })
      .style('stroke', 'white')
      .style('opacity', 0.8)
      .style('stroke-width', 0.3)
      // tooltips
      .on('mouseover',function(d){
        console.log(d);
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
    }
    d3.select("#choro").select("svg")
    .select(".map").select(".countries")
    .selectAll("path").exit().remove();
    return;

  }

  const svg = d3.select('#choro')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('class', 'map');

  svg.append("text")
          .attr("class","l-name")
          .attr("x", (width / 2))
          .attr("y", 15)
          .attr("text-anchor", "middle")
          .style("font", "16px sans-serif").style("font-weight","bold").style("fill","darkblue")
          .text(name + " League Distributions");



  svg.call(tip);

  queue()
    .defer(d3.json, 'js/world_countries.json')
    .await(ready);

  function ready(error, data, population) {

    var populationById = {};
    data_.forEach(d => { populationById[d.key] = +d.value; });
    data.features.forEach(d => { d.population = populationById[d.properties.name]; });
    data.features.forEach(function(d){
      if(d.population == null){
        d.population = 0;
      }
    });
    var countries = svg.append('g')
      .attr('class', 'countries');

    var enter = countries.selectAll('path')
      .data(data.features)
      .enter().append('path')
        .attr('d', path)
        .style('fill',
          function(d){
            if(populationById[d.properties.name]==null){
              return "#f7f7f7";
            }
            else {return color(populationById[d.properties.name]);}
        })
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

    enter.exit().remove();
    svg.append('path')
      .datum(topojson.mesh(data.features, (a, b) => a.key !== b.key))
      .attr('class', 'names')
      .attr('d', path);
  }
}



function buildHorizontal(vals,update){
  // console.log(vals);



  var data_ = [];
  var keys = Object.keys(vals);
  var values = Object.values(vals);

  var name = values[0];
  for(var i = 2; i<values.length; i++){
    data_.push({"Attribute":keys[i],"Value":Number(values[i])});
  }
  var data = data_;
  // set the dimensions and margins of the graph
  var margin = {top: 60, right: 20, bottom: 30, left: 40},
      width = 600 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  // set the ranges
  var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

  var x = d3.scaleLinear()
            .range([0, width]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  x.domain([0, d3.max(data, function(d){ return d.Value; })])
  y.domain(data.map(function(d) { return d.Attribute; }));

  if(update){
    var title = d3.select("#pie").select(".p-name").text(name + "'s Attributes");
    data.forEach(function(d) {
      d.Value = +d.Value;
    });

    var selection = d3.select("#pie").select("#atts").select("g").selectAll(".bar");
    var update = selection.data(data);


    var enter_ = selection.enter().append("rect").attr("class","bar");

    var attrs_ = selection.transition().duration(700).attr("width", function(d) {return x(d.Value); } )
        .attr("y", function(d) { return y(d.Attribute); })
        .attr("height", y.bandwidth()).style("fill","steelblue");

    selection.exit().remove();
    return;
  }


  var svg = d3.select("#names").append("svg").attr("id","pie").append("svg").attr("id","atts")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
            .attr("class","p-name")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font", "16px sans-serif").style("font-weight","bold").style("fill","darkblue")
            .text(name + "'s Attributes");

    // format the data
    data.forEach(function(d) {
      d.Value = +d.Value;
    });

    // Scale the range of the data in the domains

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("width", function(d) {return x(d.Value); } )
        .attr("y", function(d) { return y(d.Attribute); })
        .attr("height", y.bandwidth()).style("fill","steelblue");
    // updateHorizontal(data);

    // add the x Axis
    svg.append("g").attr("class","x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g").attr("class","y-axis")
        .call(d3.axisLeft(y));

    console.log(data);



}

