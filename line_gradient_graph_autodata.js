// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
// var parseTime = d3.timeParse("%M:%S");

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the area
// var area = d3.area()
//     //.x0(1)
//     .x(function(d) { return x(d.unit); })
//     .y0(height)
//     .y1(function(d) { return y(d.engagement_mean); });

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.unit); })
    .y(function(d) { return y(d.engagement_mean); })

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv(data_file, function(error, data) {
  if (error) throw error;

  // all data is now imported. For numerical variables, format the data using "+"
  data.forEach(function(d) {
      d.unit = +d.unit;
      d.engagement_mean = +d.engagement_mean;
  });
  // print the first row of the data in the browser's console to check whether
  // importing has gone ok
  console.log(data[0]);
  console.log(data[1]);
  // scale the range of the data
  // x.domain([1, 312])
  x.domain([-2, d3.max(data, function(d) { return d.unit; })]);
  // y.domain([0, d3.max(data, function(d) { return d.engagement_mean; })]);
  y.domain([1, 8])

  // set the gradient
  svg.append("linearGradient")
    .attr("id", "area-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", x(0)).attr("y1", y(0))
    .attr("x2", x(d3.max(data, function(d) { return d.unit; }))).attr("y2", y(0))
  .selectAll("stop")
    .data(data)
  .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.mood_colour; });

  // // Add the area.
  // svg.append("path")
  //     .data([data])
  //     .attr("class", "area2")
  //     .attr("d", area);

  // add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line2")
      .attr("d", valueline);

  // dad points
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 3)
      .attr("cx", function(d) { return x(d.unit)})
      .attr("cy", function(d) { return y(d.engagement_mean)})

  // add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axisGrey")
      .call(d3.axisBottom(x));
        //.tickFormat(d3.timeFormat("%M:%S")));

  // add the Y Axis
  svg.append("g")
      .attr("class", "axisGrey")
      .call(d3.axisLeft(y));
});