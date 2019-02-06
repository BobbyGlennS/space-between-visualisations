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
// var area = d3.area()
//     //.x0(1)
//     .x(function(d) { return x(d.unit); })
//     .y0(height)
//     .y1(function(d) { return y(d.engagement_mean); });

// define the line
var valueline = d3.line()
    .curve(d3.curveCardinal.tension(0.9))
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.engagement_mean); })

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg2 = d3.select(area_id).append("svg")
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
      d.time = parseTime(d.time);
      d.laughter_start = parseTime(d.laughter_start);
      d.engagement_mean = +d.engagement_mean;
      d.laughter_duration = parseTime(d.laughter_duration);
  });
  // print the first row of the data in the browser's console to check whether
  // importing has gone ok
  // console.log(data[1]);
  // scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.time; }));
  // y.domain([0, d3.max(data, function(d) { return d.engagement_mean; })]);
  y.domain([0, 8])

  // add laughter
  svg2.selectAll("laugh_background")
      .data(data)
    .enter().append("rect")
      .style("fill", "#F0F0F0")
      .attr("x", function(d) { return x(d.laughter_start)})
      .attr("y", 0)
      .attr("height", height)
      .attr("width", function(d) { return x(d.laughter_duration)})

  svg2.selectAll("laugh_colour")
      .data(data)
    .enter().append("rect")
      .style("fill", function (d) { return d.type_colour})
      .attr("x", function(d) { return x(d.laughter_start)})
      .attr("y", height - 20)
      .attr("height", 20)
      .attr("width", function(d) { return x(d.laughter_duration)})

  // set the gradient
  svg2.append("linearGradient")
    .attr("id", gradient_id)
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", x(d3.min(data, function(d) { return d.time; }))).attr("y1", y(0))
    .attr("x2", x(d3.max(data, function(d) { return d.time; }))).attr("y2", y(0))
  .selectAll("stop")
    .data(data)
  .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.mood_colour; });

  // // Add the area.
  // svg2.append("path")
  //     .data([data])
  //     .attr("class", "area2")
  //     .attr("d", area);

  svg2.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("fill", "url(#" + gradient_id + ")")
      .attr("r", 8)
      .attr("cx", function(d) { return x(d.time)})
      .attr("cy", function(d) { return y(d.engagement_mean)})

  // add the valueline path.
  svg2.append("path")
      .data([data])
      //.attr("class", "line4")
      .style("fill", "none")
      .style("stroke", "url(#" + gradient_id + ")")
      .style("stroke-width", "12px")
      .attr("d", valueline);

  // add points
  svg2.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 4)
      .attr("fill", "#333333")
      .attr("cx", function(d) { return x(d.time)})
      .attr("cy", function(d) { return y(d.engagement_mean)})
      .on("mouseover", function (d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 8);
        })
      .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 4);
      });

  // add the X Axis
    svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axisGrey")
        .call(d3.axisBottom(x)
          .tickFormat(d3.timeFormat("%M:%S")))

  // add the Y Axis
  svg2.append("g")
      .attr("transform", "translate(" + -10 + ",0)")
      .attr("class", "axisGrey")
      .call(d3.axisLeft(y)
              .ticks(8));
});
