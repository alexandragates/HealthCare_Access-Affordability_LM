

var options_area = {state_area: "all"}


// var f_area = d3.format(".2f")


var aChart = d3.json('all_state_metals_data.json', function (d){ 

  d = makeOrderVal(d);
  
  d = d.sort(function(a,b){return a.date - b.date;
      });

  console.log(d)

  var keys = ['catastrophic','bronze','silver','gold','platinum'];

  ac = new areaChart(type(d,columns = keys), options_area)
  });

//var parseDate = d3.timeParse("%B %Y");

function changeStateArea(value){
    options_area.state_area = value;
    console.log(options_area, "line 4 area")
    if(options_area.state_area != 'all'){
      console.log('i ran a state');
      d3.selectAll(".area_temp")
          .remove()
          .exit();

      d3.json("state_metals_data.json", function(d) {  
        dataset = d.filter(function(d) {return d.state == options_area.state_area;});
         
         keys = d3.keys(dataset[0]).slice(1,5);

        dataset = type(dataset,columns = keys)
        ac = areaChart(dataset,options_area) 
        })}
    else{   
        console.log('i ran all');
        d3.selectAll(".area_temp")
          .remove()
          .exit();
        d3.json("all_state_metals_data.json",function(d) { 
          keys = d3.keys(d[0]).slice(1,5);
          d = type(d,columns = keys)
          ac = areaChart(d,options_area)
        }) 
      }};

function areaChart(area_data, options_area){



  var data = area_data;
  console.log(data);

  margin = { top: 65, right: 10, bottom: 100, left: 70 };
  width = 700
  height = 300

  var svg = d3.select("#area_chart")
            .append("svg")
            .attr('height',height+margin.top+margin.bottom)
            .attr('width',width+margin.left+margin.right)
            .classed('area_temp',true);

  var x = d3.scaleTime().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      z = d3.scaleOrdinal().range(['#C468CC','#CCBA97','#958E99','#FFDA68','#83C2CC']);

  var area = d3.area()
    .x(function(d, i) { console.log(d.data.date); return x(d.data.date); })
    .y0(function(d) { console.log(d[0],'hi'); return y(d[0]); })
    .y1(function(d) { console.log(d[1],'hi2'); return y(d[1]); });



  var stack = d3.stack();


  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;

  var keys = ['catastrophic','bronze','silver','gold','platinum'];

  console.log(keys);
  // do this down where the swich and case are d = ['01//01/2014', ]

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0.00, 1200000.00])
  z.domain(keys);
  stack.keys(keys);


  var layer = g.selectAll(".layer")
    .data(stack(data))
    .enter().append("g")
      .attr("class", "layer");

  console.log(layer,'layer');

  layer.append("path")
      .attr("class", "area")
      .style("fill", function(d) { console.log(d.key, z(d.key),'z'); return z(d.key); })
      .attr("d", area);

  // layer.filter(function(d) { console.log(d); return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
  //   .append("text")
  //     .attr("x", width - 6)
  //     .attr("y", function(d) { 
  //       console.log(d,'what am i');
  //       return f(y(d[d.length - 1][0] + d[d.length - 1][1] / 2)); })
  //     .attr("dy", ".25em")
  //     .style("font", "10px sans-serif")
  //     .style("text-anchor", "end")
  //     .text(function(d) { console.log(d.key,'key'); return d.key; });

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate("+ 0 + "," + 305 + ")")

      .call(d3.axisBottom(x))
      
      .selectAll("text")
        .attr("transform","translate(12,30)rotate(90)")
        //.attr("transform","translate("+5+","+10+")")

      ;

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y));

  
  // create catastrophic legend
  var legend1_area= svg.append('g')
    .attr('height', 100)
    .attr('width', 100)

  legend1_area.selectAll('path')
    .data(data)
    .enter().append('rect')
    .attr('x', width/2 - 225)
    .attr('y', height + margin.top*1.9)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', '#C468CC')

  legend1_area.selectAll('text')
    .data(data)
    .enter().append('text')
    .attr('x', width/2 - 225)
      .attr('y', height + margin.top*2.5)
      .attr('class', 'ltext_area')
      .text('Catastrophic')

  // create bronze legend
  var legend2_area = svg.append('g')
    .attr('height', 100)
    .attr('width', 100)

  legend2_area.selectAll('path')
    .data(data)
    .enter().append('rect')
    .attr('x', width/2 - 85)
    .attr('y', height + margin.top*1.9)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', '#CCBA97')

  legend2_area.selectAll('text')
    .data(data)
    .enter().append('text')
    .attr('x', width/2 - 85)
      .attr('y', height + margin.top*2.5)
      .attr('class', 'ltext_area')
      .text('Bronze')

  // create the silver legend
  var legend3_area = svg.append('g')
    .attr('height', 100)
    .attr('width', 100)

  legend3_area.selectAll('path')
    .data(data)
    .enter().append('rect')
    .attr('x', width/2 +15)
    .attr('y', height + margin.top*1.9)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', '#958E99')

  legend3_area.selectAll('text')
    .data(data)
    .enter().append('text')
    .attr('x', width/2 +15)
      .attr('y', height + margin.top*2.5)
      .attr('class', 'ltext_area')
      .text('Silver')

  // create the Gold legend
  var legend4_area = svg.append('g')
    .attr('height', 100)
    .attr('width', 100)

  legend4_area.selectAll('path')
    .data(data)
    .enter().append('rect')
    .attr('x', width/2 + 125 )
    .attr('y', height + margin.top*1.9)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', '#FFDA68')

  legend4_area.selectAll('text')
    .data(data)
    .enter().append('text')
    .attr('x', width/2 + 125 )
      .attr('y', height + margin.top*2.5)
      .attr('class', 'ltext_area')
      .text('Gold')

  // create the 2014 legend
  var legend5_area = svg.append('g')
    .attr('height', 100)
    .attr('width', 100)

  legend5_area.selectAll('path')
    .data(data)
    .enter().append('rect')
    .attr('x', width/2+250)
    .attr('y', height + margin.top*1.9)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', '#83C2CC')

  legend5_area.selectAll('text')
    .data(data)
    .enter().append('text')
    .attr('x', width/2+250)
      .attr('y', height + margin.top*2.5)
      .attr('class', 'ltext_area')
      .text('Platinum')


}

function type(d, columns) {
  //d.date = parseDate(d.date);
  

  console.log(d.date)
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]];
  return d;
}

function makeOrderVal(d){

  keys = ['catastrophic','bronze','silver','gold','platinum'];
  console.log(d);

  var parseDate=d3.timeParse('%m/%Y')

  d.forEach( function(e){
  switch(e.date){
    case 'December 2014':
      console.log('hello');
     e['date']= parseDate('12/2014') ;
     break;

    case 'March 2015':
     e['date']= parseDate('03/2015') ;
     break;

    case 'June 2015':
      e['date']= parseDate('06/2015') ;
     break;

    case 'September 2015':
     e['date']= parseDate('09/2015');
     break;

    case 'December 2015':
     e['date']= parseDate('12/2015');
     break;

    case 'March 2016':
     e['date']= parseDate('03/2016');
     break;
    };})

  return d;
}