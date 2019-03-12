// set the dimensions and margins of the graph
var margin = {top: 1, right: 50, bottom: 20, left: 30},
    // width = 900 - margin.left - margin.right,
    // height = 450 - margin.top - margin.bottom;
    width = 950,
    height = 550;

// parse the date / time
var parseTime = d3.timeParse("%M:%S");

// set the ranges
var x = d3.scaleTime().range([20, width - 50]);
var y = d3.scaleLinear().range([height - 20, 20]);

// define the line
var valueline = d3.line()
    .curve(d3.curveCardinal.tension(0.9))
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.engagement_mean); })

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(area_id)
  .append("div")
   .classed("svg-container", true) //container class to make it responsive
  .append("svg")
   //responsive SVG needs these 2 attributes and no width and height attr
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox","0 0 " + width + " " + height)
   //class to make it responsive
   .classed("svg-content-responsive", true)
 .append("g")
   .attr("transform",
         "translate(" + margin.left + "," + margin.top + ")");

//  set the tooltip parameters
var div = d3.select(area_id).append("div")
  .attr("class", "tooltip")

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
  console.log(data[1]);
  // scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.time; }));
  // y.domain([0, d3.max(data, function(d) { return d.engagement_mean; })]);
  y.domain([0, 8])

  // add laughter
  svg.selectAll("laugh_background")
      .data(data)
    .enter().append("rect")
      .style("fill", "#F0F0F0")
      .attr("x", function(d) { return x(d.laughter_start)})
      .attr("y", 0)
      .attr("height", height-20)
      .attr("width", function(d) { return x(d.laughter_duration)})

  svg.selectAll("laugh_colour")
      .data(data)
    .enter().append("rect")
      .style("fill", function (d) { return d.type_colour})
      .attr("x", function(d) { return x(d.laughter_start)})
      .attr("y", height - 40)
      .attr("height", 20)
      .attr("width", function(d) { return x(d.laughter_duration)})

  // set the gradient
  svg.append("linearGradient")
    .attr("id", gradient_id)
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", x(d3.min(data, function(d) { return d.time; }))).attr("y1", y(0))
    .attr("x2", x(d3.max(data, function(d) { return d.time; }))).attr("y2", y(0))
  .selectAll("stop")
    .data(data)
  .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.mood_colour; });

  // create background dots to round off edges of line
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("fill", "url(#" + gradient_id + ")")
      .attr("r", 6)
      .attr("cx", function(d) { return x(d.time)})
      .attr("cy", function(d) { return y(d.engagement_mean)})

  // add the valueline path.
  svg.append("path")
      .data([data])
      //.attr("class", "line4")
      .style("fill", "none")
      .style("stroke", "url(#" + gradient_id + ")")
      .style("stroke-width", "12px")
      .attr("d", valueline);

  // add points
  svg.selectAll("dot")
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
          .attr("r", 8)
        div.transition()
          .duration(200)
          .style("opacity", .9)
          div.html("<strong>TJ:</strong> Feels like you're being a little harsh. <p> <strong>RD:</strong> Thanks, good note. I was going for extremely harsh, I'll turn it up.")
          .style("left", (d3.event.pageX + "px"))
          .style("top", (d3.event.pageY + 15 + "px"));
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 4)
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

  // add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + (height - 20) + ")")
        .attr("class", "axisGrey")
        .call(d3.axisBottom(x)
          .ticks(d3.timeSecond.every(30))
          .tickFormat(d3.timeFormat("%M:%S")));

  // add the Y Axis
  svg.append("g")
      .attr("transform", "translate(" + -10 + ",0)")
      .attr("class", "axisGrey")
      .call(d3.axisLeft(y)
              .ticks(8));
              // .tickValues([1, 4, 8]));

  d3.select(".tick").remove()
  svg.selectAll(".tick")
      .each(function (d) {
          if ( d === 0 ) {
              this.remove();
          }
      });

});
