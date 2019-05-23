// set the dimensions and margins of the graph
var margin = {top: 10, right: 100, bottom: 40, left: 70},
    width = 1100 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// parse the date / time
  var parseTime = d3.timeParse("%M:%S");

// set the ranges
var x = d3.scaleTime().range([margin.left, width - margin.right]);
var y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

// set the colour scale
var colour = d3.scaleLinear()
               .domain([0, 1.3, 2.7, 4, 5.3, 6.7, 8])
               .range(["##9F150F", "#FF0000", "#F59100", "#FFE600", "#A8D600", "#009900", "#0A5609"]);

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
   .attr("viewBox","0 0 " + width + " " + height + 25)
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
      d.laughter_duration = +d.laughter_duration;
  });
  // print the first row of the data in the browser's console to check whether
  // importing has gone ok
  // console.log(data[data.length - 1].mood1)
  // console.log(data)

  // scale the range of the data
  // x.domain(d3.extent(data, function(d) { return d.time; }));
  x.domain([parseTime("00:00"), parseTime("05:00")])
  y.domain([0, 8]);

  // add laughter
  svg.selectAll("laugh_background")
      .data(data)
    .enter().append("rect")
      .style("fill", "#F0F0F0")
      .attr("x", function(d) { return x(d.laughter_start)})
      .attr("y", 0)
      .attr("height", height - 40)
      .attr("width", function(d) { return (d.laughter_duration / 300) * (width - margin.left)})

  svg.selectAll("laugh_colour")
      .data(data)
    .enter().append("rect")
      .style("fill", function (d) { return d.type_colour})
      .attr("x", function(d) { return x(d.laughter_start)})
      .attr("y", height - 60)
      .attr("height", 20)
      .attr("width", function(d) { return (d.laughter_duration / 300) * (width - margin.left)})

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
    .attr("stop-color", function(d) { return colour(d.mood_mean); });

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
          .style("width", "250px")
          div.html(d.utterance)
          .style("left", (d3.event.pageX + "px"))
          .style("top", (d3.event.pageY + 15 + "px"));

          var matrix = this.getScreenCTM()
                  .translate(+this.getAttribute("cx"),
                           +this.getAttribute("cy"));

          console.log(d3.event.pageY + 15 + "px");
          console.log(matrix);

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
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .attr("class", "axisGrey")
        .call(d3.axisBottom(x)
          .tickFormat(d3.timeFormat("%M:%S")));

    // add the Y Axis
    svg.append("g")
        .attr("transform", "translate(" + 50 + ",0)")
        .attr("class", "axisGrey")
        .call(d3.axisLeft(y)
                .tickValues(d3.range(1, 9)));

    // add labels for axes
    svg.append("text")
        .attr("text-anchor", "center")
        .attr("transform",
              "translate(" + ((width - margin.left - margin.right) / 2) + "," + (height + 25) + ")")
        .text("Time")
        .attr("class", "axisLabel")

    svg.append("text")
        .attr("text-anchor", "center")
        .attr("transform", "translate(0," + height / 2 + ")rotate(-90)")
        .text("Engagement")
        .attr("class", "axisLabel")

});
