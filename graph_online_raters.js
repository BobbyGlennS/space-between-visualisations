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

// set the colour scale
var colour = d3.scaleLinear()
               .domain([0, 1.3, 2.7, 4, 5.3, 6.7, 8])
               .range(["##9F150F", "#FF0000", "#F59100", "#FFE600", "#A8D600", "#009900", "#0A5609"]);

// define the line
var valueline = d3.line()
    .curve(d3.curveCardinal.tension(0.9))
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.engagement_mean); })

var rater_line1 = d3.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.eng1); });

var rater_line2 = d3.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.eng2); });

var rater_line3 = d3.line()
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
      d.mood1 = +d.mood1;
      d.mood2 = +d.mood2;
      d.mood3 = +d.mood3;
      d.eng1 = +d.eng1;
      d.eng2 = +d.eng2;
      d.eng3 = +d.eng3;
  });
  // print the first row of the data in the browser's console to check whether
  // importing has gone ok
  console.log(data[1]);
  // scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.time; }));
  // y.domain([0, d3.max(data, function(d) { return d.engagement_mean; })]);
  y.domain([0, 8])

  // set the gradient
  svg1_1.append("linearGradient")
    .attr("id", gradient_id)
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", x(d3.min(data, function(d) { return d.time; }))).attr("y1", y(0))
    .attr("x2", x(d3.max(data, function(d) { return d.time; }))).attr("y2", y(0))
  .selectAll("stop")
    .data(data)
  .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.mood_colour; });

  // add the valueline path.
  svg1_1.append("path")
      .data([data])
      //.attr("class", "line4")
      .style("fill", "none")
      .style("stroke", "#111111")
      .style("opacity", 0.5)
      .style("stroke-width", "7px")
      .attr("d", valueline);

  // add points
  svg1_1.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 4)
      .attr("fill", "url(#" + gradient_id + ")")
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


  // Add path for rater 1
  svg1_1.append("path")
    .data([data])
    .attr("fill", "none")
    .attr("stroke", "#CCCCCC")
    .attr("stroke-width", 3)
    .attr("d", rater_line1)
    .on("mouseover", function() {
      d3.select(this)
        .attr("stroke", "#FF0000")
        .attr("opacity", 0.5)
        .attr("stroke-width", 5)
    })
    .on("mouseout", function() {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("stroke", "#CCCCCC")
        .attr("stroke-width", 5)
    });

  // add points for rater 1
  svg1_1.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 10)
      .attr("cx", function(d) { return x(d.time)})
      .attr("cy", function(d) { return y(d.eng1)})
      .attr("fill", function(d) {return colour(d.mood1)})
      .attr("opacity", 0.3)
      .on("mouseover", function (d) {
        d3.select(this)
          .transition()
          .duration(500)
          .attr("fill", colour(d.mood1))
          .attr("opacity", 0.9)
          .attr("r", 10*2)
        div.transition()
          .duration(200)
          .style("opacity", .8);
          div.html("<strong>rater 1:</strong> " + d.mood3 + " mood")
          .style("left", (d3.event.pageX + "px"))
          .style("top", (d3.event.pageY + 15 + "px"));
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(500)
          .attr("opacity", 0.3)
          .attr("fill", colour(d.mood1))
          .attr("r", 10)
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

  // rater 2
  svg1_1.append("path")
    .data([data])
    .attr("fill", "none")
    .attr("stroke", "#CCCCCC")
    .attr("stroke-width", 3)
    .attr("d", rater_line2)
    .on("mouseover", function() {
      d3.select(this)
        .attr("stroke", "#FF0000")
        .attr("opacity", 0.5)
        .attr("stroke-width", 5)
    })
    .on("mouseout", function() {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("stroke", "#CCCCCC")
        .attr("stroke-width", 5)
    });

  svg1_1.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 10)
      .attr("cx", function(d) { return x(d.time)})
      .attr("cy", function(d) { return y(d.eng2)})
      .attr("fill", function(d) {return colour(d.mood2)})
      .attr("opacity", 0.3)
      .on("mouseover", function (d) {
        d3.select(this)
          .transition()
          .duration(500)
          .attr("fill", colour(d.mood2))
          .attr("opacity", 0.9)
          .attr("r", 10*2)
        div.transition()
          .duration(200)
          .style("opacity", .8);
          div.html("<strong>rater 2:</strong> " + d.mood3 + " mood")
          .style("left", (d3.event.pageX + "px"))
          .style("top", (d3.event.pageY + 15 + "px"));
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(500)
          .attr("opacity", 0.3)
          .attr("fill", colour(d.mood2))
          .attr("r", 10)
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

      // rater 3
      svg1_1.append("path")
        .data([data])
        .attr("fill", "none")
        .attr("stroke", "#CCCCCC")
        .attr("stroke-width", 3)
        .attr("d", rater_line3)
        .on("mouseover", function() {
          d3.select(this)
            .attr("stroke", "#FF0000")
            .attr("opacity", 0.5)
            .attr("stroke-width", 5)
        })
        .on("mouseout", function() {
          d3.select(this)
            .transition()
            .duration(500)
            .attr("stroke", "#CCCCCC")
            .attr("stroke-width", 5)
        });
      svg1_1.selectAll("dot")
          .data(data)
        .enter().append("circle")
          .attr("r", 10)
          .attr("cx", function(d) { return x(d.time)})
          .attr("cy", function(d) { return y(d.eng3)})
          .attr("fill", function(d) {return colour(d.mood3)})
          .attr("opacity", 0.3)
          .on("mouseover", function (d) {
            d3.select(this)
              .transition()
              .duration(500)
              .attr("fill", colour(d.mood2))
              .attr("opacity", 0.9)
              .attr("r", 10*2)
            div.transition()
              .duration(200)
              .style("opacity", .8);
              div.html("<strong>rater 3:</strong> " + d.mood3 + " mood")
              .style("left", (d3.event.pageX + "px"))
              .style("top", (d3.event.pageY + 15 + "px"));
          })
          .on("mouseout", function(d) {
            d3.select(this)
              .transition()
              .duration(500)
              .attr("opacity", 0.3)
              .attr("fill", colour(d.mood3))
              .attr("r", 10)
            div.transition()
              .duration(500)
              .style("opacity", 0);
          });

  // add the X Axis
    svg1_1.append("g")
        .attr("transform", "translate(0," + (height - 20) + ")")
        .attr("class", "axisGrey")
        .call(d3.axisBottom(x)
          .tickFormat(d3.timeFormat("%M:%S")));

  // add the Y Axis
  svg1_1.append("g")
      .attr("transform", "translate(" + -10 + ",0)")
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

});
