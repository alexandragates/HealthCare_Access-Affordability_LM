//lots of code from here: https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2

var map_width = 960,
    map_height = 500,
    active = d3.select(null);

// make the projection
var projection = d3.geoMercator()
    .scale(1900)
    .center([-90,42.5]);

// start the zooom
var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

// make the path
var path = d3.geoPath()
    .projection(projection);

// initialize the state name and abbreviation variables
var state_name;
var state_abbr;

//create general svg
var map_svg = d3.select("#chart").append("svg")
    .attr('value',state_name)
    .attr("width", map_width)
    .attr("height", map_height)
    .on("click", stopped, true);

// allows user to zoom back out if they click away from the
 map_svg.append("rect")
     .attr("class", "background")
     .attr("width", map_width)
     .attr("height", map_height)
     .on("click", reset);

// attaches two separate g layers, one for the county map, one for the state map
var countyG = map_svg.append("g"),
    stateG = map_svg.append("g");

// pull the county level data and make it into a map
d3.json("county_level_geojson.json", function(error, county) {
  if (error) throw error;

  countyG.selectAll("path")
      .data(county.features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "feature")
      .on("click", clicked);
});

// pull the state level data and make it into a map
d3.json("state_level_geojson.json", function(error, state) {
  if (error) throw error;

  stateG.selectAll("path")
      .data(state.features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "feature")
      .on("click", clicked);
});

// when a state is clicked, it zooms in, prints the state name and abbreviation and classifies it as active
function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  
  console.log(active.node(), 'this node')

  active = d3.select(this).classed("active", true);
  active.append('true')
  
  state_name = d.properties.NAME;
  state_abbr = d.properties.STUSPS;

  console.log(active.node(), 'this node')
  console.log(state_name, state_abbr);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / map_width, dy / map_height))),
      translate = [map_width / 2 - scale * x, map_height / 2 - scale * y];

  map_svg.transition()
      .duration(750)
      .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
}

function reset() {
  active.classed("active", false);
  active = d3.select(null);
  active.append('false')

  console.log(active.node, 'zoomed out')
  map_svg.transition()
      .duration(750)
     .call( zoom.transform, d3.zoomIdentity );
}

function zoomed() {
  stateG.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  stateG.attr("transform", d3.event.transform);
  countyG.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  countyG.attr("transform", d3.event.transform); 
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}





