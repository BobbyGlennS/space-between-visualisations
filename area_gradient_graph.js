// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%M:%S");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the area
var area = d3.area()
    .x(function(d) { return x(d.time); })
    .y0(height)
    .y1(function(d) { return y(d.engagement_mean); });

// define the line !! don't need it when only plotting area
// var valueline = d3.line()
//     .x(function(d) { return x(d.time); })
//     .y(function(d) { return y(d.engagement_mean); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("dt_nl_group1_HW_adds_120318.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.time = parseTime(d.time);
      d.engagement_mean = +d.engagement_mean;
  });

  // scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.time; }));
  y.domain([0, d3.max(data, function(d) { return d.engagement_mean; })]);

  // set the gradient
  svg.append("linearGradient")
    .attr("id", "area-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0).attr("y1", y(0))
    .attr("x2", 0).attr("y2", y(10))
  .selectAll("stop")
    .data([
      {offset: "0%", color: "red"},
      {offset: "30%", color: "red"},
      {offset: "45%", color: "black"},
      {offset: "55%", color: "black"},
      {offset: "60%", color: "lawngreen"},
      {offset: "100%", color: "lawngreen"}
    ])
  .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.color; });

  // Add the area.
  svg.append("path")
      .data([data])
      .attr("class", "area2")
      .attr("d", area);

  // add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
        //.tickFormat(d3.timeFormat("%M:%S")));

  // add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});
