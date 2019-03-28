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
var rater_line1 = d3.line()
    .curve(d3.curveCardinal.tension(0.9))
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.eng1); });

var rater_line2 = d3.line()
    .curve(d3.curveCardinal.tension(0.9))
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.eng2); });

var rater_line3 = d3.line()
    .curve(d3.curveCardinal.tension(0.9))
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.eng3); });

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg1_1 = d3.select(area_id)
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
      d.mood1 = +d.mood1;
      d.mood2 = +d.mood2;
      d.mood3 = +d.mood3;
      d.eng1 = +d.eng1;
      d.eng2 = +d.eng2;
      d.eng3 = +d.eng3;
  });
  // scale the range of the data
  x.domain([parseTime("00:00"), parseTime("05:00")]);
  y.domain([0, 8])

  // set the gradient for rater 1
  svg1_1.append("linearGradient")
    .attr("id", gradient_id1_1)
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", x(d3.min(data, function(d) { return d.time; }))).attr("y1", y(0))
    .attr("x2", x(d3.max(data, function(d) { return d.time; }))).attr("y2", y(0))
  .selectAll("stop")
    .data(data)
  .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return colour(d.mood1); });

    // set the gradient for rater 2
    svg1_1.append("linearGradient")
      .attr("id", gradient_id1_2)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", x(d3.min(data, function(d) { return d.time; }))).attr("y1", y(0))
      .attr("x2", x(d3.max(data, function(d) { return d.time; }))).attr("y2", y(0))
    .selectAll("stop")
      .data(data)
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })
      .attr("stop-color", function(d) { return colour(d.mood2); });

    // set the gradient for rater 3
    svg1_1.append("linearGradient")
      .attr("id", gradient_id1_3)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", x(d3.min(data, function(d) { return d.time; }))).attr("y1", y(0))
      .attr("x2", x(d3.max(data, function(d) { return d.time; }))).attr("y2", y(0))
    .selectAll("stop")
      .data(data)
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })
      .attr("stop-color", function(d) { return colour(d.mood3); });

  // Add path for rater 1
  svg1_1.append("path")
    .data([data])
    .attr("fill", "none")
    .attr("stroke", "#AAAAAA")
    .attr("stroke-width", 2)
    .attr("d", rater_line1)
    .on("mouseenter", function() {
      d3.select(this)
        .style("stroke", "url(#" + gradient_id1_1 + ")")
        .attr("stroke-width", "13px")
    })
    .on("mouseleave", function() {
      d3.select(this)
        .attr("stroke-width", 2)
        .style("stroke", "#AAAAAA")
    });

  // add points for rater 1
  svg1_1.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 3)
      .attr("cx", function(d) { return x(d.time)})
      .attr("cy", function(d) { return y(d.eng1)})
      .attr("fill", "#000000")
      .on("mouseover", function (d) {
        d3.select(this)
          .transition()
          .duration(500)
          .attr("r", 8)
        div.transition()
          .duration(200)
          .style("opacity", 0.9);
          div.html("<p><strong>Rater 1</strong></p><p>" + d.mood1 + " mood</p>")
          .style("left", (d3.event.pageX + "px"))
          .style("top", (d3.event.pageY + 15 + "px"));
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(500)
          .attr("r", 3)
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

  // rater 2 line
  svg1_1.append("path")
    .data([data])
    .attr("fill", "none")
    .attr("stroke", "#AAAAAA")
    .attr("stroke-width", 2)
    .attr("d", rater_line2)
    .on("mouseover", function() {
      d3.select(this)
        .style("stroke", "url(#" + gradient_id1_2 + ")")
        .attr("stroke-width", "13px")
    })
    .on("mouseout", function() {
      d3.select(this)
        .attr("stroke-width", 2)
        .style("stroke", "#AAAAAA")
    });

  // add points for rater 2
  svg1_1.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 3)
      .attr("cx", function(d) { return x(d.time)})
      .attr("cy", function(d) { return y(d.eng2)})
      .attr("fill", "#000000")
      .on("mouseover", function (d) {
        d3.select(this)
          .transition()
          .duration(500)
          .attr("r", 8)
        div.transition()
          .duration(200)
          .style("opacity", .9);
          div.html("<p><strong>Rater 2</strong></p><p>" + d.mood2 + " mood</p>")
          .style("left", (d3.event.pageX + "px"))
          .style("top", (d3.event.pageY + 15 + "px"));
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(500)
          .attr("r", 3)
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

      // rater 3 line
      svg1_1.append("path")
        .data([data])
        .attr("fill", "none")
        .attr("stroke", "#AAAAAA")
        .attr("stroke-width", 2)
        .attr("d", rater_line3)
        .on("mouseover", function() {
          d3.select(this)
            .style("stroke", "url(#" + gradient_id1_3 + ")")
            .attr("stroke-width", "13px")
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("stroke-width", 2)
            .style("stroke", "#AAAAAA")
        });

      // rater 3 dots
      svg1_1.selectAll("dot")
          .data(data)
        .enter().append("circle")
          .attr("r", 3)
          .attr("cx", function(d) { return x(d.time)})
          .attr("cy", function(d) { return y(d.eng3)})
          .attr("fill", "#000000")
          .on("mouseover", function (d) {
            d3.select(this)
              .transition()
              .duration(500)
              .attr("r", 8)
            div.transition()
              .duration(200)
              .style("opacity", .9);
              div.html("<p><strong>Rater 3</strong></p><p>" + d.mood3 + " mood</p>")
              .style("left", (d3.event.pageX + "px"))
              .style("top", (d3.event.pageY + 15 + "px"));
          })
          .on("mouseout", function(d) {
            d3.select(this)
              .transition()
              .duration(500)
              .attr("r", 3)
            div.transition()
              .duration(500)
              .style("opacity", 0);
          });

  // add the X Axis
    svg1_1.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .attr("class", "axisGrey")
        .call(d3.axisBottom(x)
          .tickFormat(d3.timeFormat("%M:%S")));

    // add the Y Axis
    svg1_1.append("g")
        .attr("transform", "translate(" + 50 + ",0)")
        .attr("class", "axisGrey")
        .call(d3.axisLeft(y)
                .ticks(8));
                // .tickValues([1, 4, 8]));

    d3.select(".tick").remove()
    svg1_1.selectAll(".tick")
        .each(function (d) {
            if ( d === 0 ) {
                this.remove();
            }
        });

    // add labels for axes
    svg1_1.append("text")
        .attr("text-anchor", "center")
        .attr("transform",
              "translate(" + ((width - margin.left - margin.right) / 2) + "," + (height + 25) + ")")
        .text("Time")
        .style("font-weight", "500");

    svg1_1.append("text")
        .attr("text-anchor", "center")
        .attr("transform", "translate(0," + height / 2 + ")rotate(-90)")
        .text("Engagement")
        .style("font-weight", "500");

});
