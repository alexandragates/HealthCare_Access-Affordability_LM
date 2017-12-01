var years = d3.range(2015, 2017 + 1);
var interval = 3000;


var blurStable = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 5 -7';
var blurIn = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -11';
var blurOut = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -7';

var margin = { top: 15, right: 15, bottom: 45, left: 55 };
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;


var svg = d3.select('#scatterHealthBubbleChart')
    .append('svg')
    .attr('width', width + margin.left + margin.top*2)
    .attr('height', height + margin.top*2 + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var x = d3.scaleLinear()
				.range([0, width]);
var y = d3.scaleLinear()
				.range([height, 0]);
var y_alt = d3.scaleLinear()
                .range([height, 0]);
var r = d3.scaleLinear()
				.range([10, 50]);
var color = d3.scaleOrdinal()
    .range(([ "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]));

var xAxis = d3.axisBottom()
						.scale(x);
var yAxis = d3.axisLeft()
						.scale(y);
var dataset;

var f = d3.format(".2f")

var first_time = true;

var yearLabel = svg.append('text')
    .attr('class', 'year')
    .attr('x', width / 2)
    .attr('y', height / 2)
    .attr('dy', '.28em')
    .style('font-size', width / 3)
    .style('text-anchor', 'middle')
    .style('font-weight', 'bold')
    .style('opacity', 0.4)
    .text('2015');


d3.json("scatter_area_data.json", initialize);

function initialize(error, data,first_time) {
    if (error) { throw error }

  	//could the issue be here?
    x.domain([200, d3.max(data, function (d) { return d.avg_silver_27 })]).nice()
    y.domain([0.00, 100.00]).nice()
    r.domain([0, 400000])
   

    if(first_time = true){
        data = d3.nest()
            .key(function (d) { return d.year })
            .key(function (d) { return d.state_name })
            .entries(data)

        data.forEach(function (d) {
            d.values.forEach(function (e) {
                e.total_plan_selections = d3.sum(e.values, function (f) { return f.total_plan_selections })
                e.yes_aptc =   d3.sum(e.values , function (f) {
                    return f.yes_aptc})
                e.county_name = d3.max(e.values,function(f){ return f.state_name;})
                e.avg_silver_27 = +d3.sum(e.values, function (f) {
                    return f.avg_silver_27
                })/+e.values.length
                e.values.forEach(function (f) { f.parent = e })

            })
        })
    }

    dataset = data 

    var uniqueStates = data[0].values.map(function (d) { console.log(d,'unique'); return d.key });

    // from http://www.visualcinnamon.com/2016/06/fun-data-visualizations-svg-gooey-effect.html
	  // modified to create a filter for each continent group, which can be individually transitioned
	  
	  var filters = svg.append('defs')
	      .selectAll('filter')
	      .data(uniqueStates)
	      .enter()
	      .append('filter') 
	      .attr('id', function (d) { return 'gooeyCodeFilter-' + d.replace(' ', '-') });

	  filters.append('feGaussianBlur')
	      .attr('in', 'SourceGraphic')
	      .attr('stdDeviation', '10')
	      .attr('color-interpolation-filters', 'sRGB')
	      .attr('result', 'blur');

	  var blurValues = filters.append('feColorMatrix')
	      .attr('class', 'blurValues')
	      .attr('in', 'blur')
	      .attr('mode', 'matrix')
	      .attr('values', blurStable)
	      .attr('result', 'gooey');


	  filters.append('feBlend')
	      .attr('in', 'SourceGraphic')
	      .attr('in2', 'gooey');

	  svg.append('g')
	      .attr('class', 'x axis')
	      .attr('transform', 'translate(' + margin.left + ',' + height + ')')
	      .call(xAxis)
	      .append('text')
	      .attr('x', width-55)
	      .attr('y', 30)
	      .style('text-anchor', 'end')
	      .style('font-weight', 'bold')
	      .text('Average Silver Plan Premium Price Per Month ');

	  svg.append('g')
	      .attr('class', 'y axis')
	      .attr('transform','translate('+ margin.left + ',' + 0 + ')')
	      .call(yAxis)
	      .append('text')
	      .attr('transform','rotate(-90)')
	      .attr('x', 0)
	      .attr('y', -55)
	      .style('text-anchor', 'end')
	      .style('font-weight', 'bold')
	      .text('Percentage with Tax Credits');

	  var yearIndex = 0;
	  var year = '' + years[yearIndex];
	  var exploded = d3.set();
	  var blurTransition = d3.set();

	  d3.select('#explode')
	  .on('click', function () {
	      uniqueStates.forEach(function (d) {
	      	console.log(d,'hello');
	          if (!exploded.has(d)) {
	              exploded.add(d)
	              blurTransition.add(d)
	          }
	      });
	  })

	  d3.select('#collapse').on('click', function () {
        uniqueStates.forEach(function (d) {

            svg.selectAll('.scatter_temp')
                    .remove().exit();

            if (exploded.has(d)) {
                exploded.remove(d)
                blurTransition.add(d)
            }
        })
    })

      d3.select('#reset')
      .on('click', function () {

        svg.selectAll('.scatter_temp')
                    .remove().exit();

          yearIndex = 0
          year = '2015'
          console.log(yearIndex,'reset worked');
          first_time=false;
          var states = svg.selectAll('.state')
                    .data(data[0].values)
                    .enter().append('g')
                    .attr('class', 'state')



    states.append('circle')
        .attr('class', 'aggregate')
        .attr('cx', width/2)
        .attr('cy', height / 2)

        .style('fill', function (d) { return color(d.key) })
        .style('opacity','.9')
        .on('click', function (d) { exploded.add(d.key); blurTransition.add(d.state_name) })
        .append('title').text(function (d) { return d.key })

        update()

      }).classed('bump_temp',true)


    var states = svg.selectAll('.state')
                    .data(data[0].values)
                    .enter().append('g')
                    .attr('class', 'state')


    states.append('circle')
        .attr('class', 'aggregate')
        .attr('cx', width/2)
        .attr('cy', height / 2)
        .style('fill', function (d) { return color(d.key) })
        .style('opacity','.9')
        .on('click', function (d) { exploded.add(d.key); blurTransition.add(d.state_name) })
        .append('title').text(function (d) { return d.key }).classed('bump_temp',true)

    update()
    d3.interval(incrementYear, interval)
    
    function incrementYear() {
        if(year < 2017){ console.log(years.length, 'years length');
        year = '' + years[++yearIndex >= years.length ? yearIndex = 0 : yearIndex]
        console.log(year,'year');
        update()
        

        }
        //make a button to reset
    }
    
    function update() {

        yearLabel.transition().duration(0).delay(interval/2).text(year)
    
        var tooltip = d3.select("body").append("div")
          .attr("class", "tooltip");

       

        states.append('title').text(function (d) { return d.state_name })

        states = states.data(
            data.find(function (d) { return d.key === year }).values,
            function (d) { console.log(d,"updating data for states"); return d.key }
        )

        var counties = states.selectAll('.county')
            .data(function (d) { return d.values }, function (d) { return d.county_name })

        counties.exit().remove()

        var enterCounties = counties.enter().insert('circle', '.aggregate')
            .attr('class', 'county')
            .attr('cx', width / 2)
            .attr('cy', height / 2)
            .style('fill', function (d) { return color(d.state_name) })
            .on('click', function (d) { exploded.remove(d.state_name); blurTransition.add(d.state_name);})

        enterCounties.append('title').text(function (d) { return d.county_name })

        counties = counties.merge(enterCounties)

        console.log(counties,'counties after merge');

        var t =  d3.transition()
                    .ease(d3.easeLinear)
                    .duration(100)
                     .delay(interval/2)

        console.log("before selecting .aggregate");
        console.log(exploded,"exploded")

        states.select('.aggregate')
            .transition(t)

            .attr('r', function (d) { return
                r(d.total_plan_selections);
            })
            .attr('cx', function (d) { return x(d.avg_silver_27) })
            .attr('cy', function (d) { var retval = exploded.has(d.key) ? 0 : y(f(d.yes_aptc/d.total_plan_selections*100));
                return retval
            })

        // states.selectAll("text")
        //   .on("mouseover", function(d) {
        //     svg.selectAll('.state')
        //         .classed('active', true);

        //     var tooltip_str = "Yes APTC %: " + f(d.yes_aptc/d.total_plan_selections *100) +
        //                     "<br/>" + "Region: " + d.state_name+
        //             "<br/>" + "Total Plan Selection: " + d.total_plan_selections +
        //             "<br/>" + "Year: " + d.year;})


        console.log("after selecting .aggregate");

        counties
            .transition(t)
            .attr('r', function (d) {
                var retval = (exploded.has(d.state_name) ? d: d.parent).total_plan_selections;
                return r(retval); })
            .attr('cx', function (d) {
                return x((exploded.has(d.state_name) ? d : d.parent).avg_silver_27) })
            .attr('cy', function (d) {
                var retval = y(f((exploded.has(d.state_name) ? d : d.parent).yes_aptc/(exploded.has(d.state_name) ? d : d.parent).total_plan_selections *100));
                console.log(retval);
                if(retval){

                    return retval}})
                        
        svg.selectAll("circle")
          .on("mouseover", function(d) {
            svg.selectAll('circle')
                .classed('active', true);

            var tooltip_str = "Yes APTC %: " + f(d.yes_aptc/d.total_plan_selections *100) +
                            "<br/>" + "Region: " + d.county_name+
                    "<br/>" + "Total Plan Selection: " + d.total_plan_selections +
                    "<br/>" + "Year: " + d.year;})


        blurValues
            .transition(t)
            .attrTween('values', function (d) {
                if (blurTransition.has(d)) {
                    blurTransition.remove(d)

                    if (exploded.has(d)) {
                        return d3.interpolateString(blurIn, blurOut)
                    } else {
                        return d3.interpolateString(blurOut, blurIn)
                    }
                }

                return function () { return blurStable }
            })

        }

	  };

		
	 
