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
var rater_line_mean = d3.line()
    .curve(d3.curveCardinal.tension(0.9))
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.engagement_mean); });

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

var rater_line4 = d3.line()
    .curve(d3.curveCardinal.tension(0.9))
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.eng4); });

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg2_1 = d3.select(area_id)
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
      d.mood_mean = +d.mood_mean;
      d.mood1 = +d.mood1;
      d.mood2 = +d.mood2;
      d.mood3 = +d.mood3;
      d.mood4 = +d.mood4;
      d.engagement_mean = +d.engagement_mean;
      d.eng1 = +d.eng1;
      d.eng2 = +d.eng2;
      d.eng3 = +d.eng3;
      d.eng4 = +d.eng4;
  });
  // scale the range of the data
  x.domain([parseTime("00:00"), parseTime("05:00")]);
  y.domain([0, 8])

  // set the gradient for mean line
  svg2_1.append("linearGradient")
    .attr("id", gradient_id2_0)
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", x(d3.min(data, function(d) { return d.time; }))).attr("y1", y(0))
    .attr("x2", x(d3.max(data, function(d) { return d.time; }))).attr("y2", y(0))
  .selectAll("stop")
    .data(data)
  .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return colour(d.mood_mean); });

  // set the gradient for rater 1
  svg2_1.append("linearGradient")
    .attr("id", gradient_id2_1)
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", x(d3.min(data, function(d) { return d.time; }))).attr("y1", y(0))
    .attr("x2", x(d3.max(data, function(d) { return d.time; }))).attr("y2", y(0))
  .selectAll("stop")
    .data(data)
  .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return colour(d.mood1); });

    // set the gradient for rater 2
    svg2_1.append("linearGradient")
      .attr("id", gradient_id2_2)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", x(d3.min(data, function(d) { return d.time; }))).attr("y1", y(0))
      .attr("x2", x(d3.max(data, function(d) { return d.time; }))).attr("y2", y(0))
    .selectAll("stop")
      .data(data)
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })
      .attr("stop-color", function(d) { return colour(d.mood2); });

    // set the gradient for rater 3
    svg2_1.append("linearGradient")
      .attr("id", gradient_id2_3)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", x(d3.min(data, function(d) { return d.time; }))).attr("y1", y(0))
      .attr("x2", x(d3.max(data, function(d) { return d.time; }))).attr("y2", y(0))
    .selectAll("stop")
      .data(data)
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })
      .attr("stop-color", function(d) { return colour(d.mood3); });

    // set the gradient for rater 4
    svg2_1.append("linearGradient")
      .attr("id", gradient_id2_4)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", x(d3.min(data, function(d) { return d.time; }))).attr("y1", y(0))
      .attr("x2", x(d3.max(data, function(d) { return d.time; }))).attr("y2", y(0))
    .selectAll("stop")
      .data(data)
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })
      .attr("stop-color", function(d) { return colour(d.mood3); });

    // create background dots to round off edges of line
    svg2_1.selectAll("dot")
        .data(data)
      .enter().append("circle")
        .attr("fill", "url(#" + gradient_id2_0 + ")")
        .attr("r", 6)
        .attr("cx", function(d) { return x(d.time)})
        .attr("cy", function(d) { return y(d.engagement_mean)})

  // Add path for rater mean
  svg2_1.append("path")
    .data([data])
    .attr("fill", "none")
    .style("stroke", "url(#" + gradient_id2_0 + ")")
    .attr("stroke-width", "12px")
    .style("opacity", 1)
    .attr("d", rater_line_mean)
    // .attr('filter', 'url(#dropShadow)');

  // add points for rater mean
  svg2_1.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 3)
      .attr("cx", function(d) { return x(d.time)})
      .attr("cy", function(d) { return y(d.engagement_mean)})
      .attr("fill", "#000000")

  // Add path for rater 1
  svg2_1.append("path")
    .data([data])
    .attr("fill", "none")
    .style("stroke", "url(#" + gradient_id2_1 + ")")
    .attr("stroke-width", "5px")
    .style("opacity", 0.2)
    .attr("d", rater_line1)
    .on("mouseenter", function() {
      d3.select(this)
        .style("opacity", 1)

        // get coordinates for rater box display
        // first get offset by comparing content mouse coordinate with frame mouse coordinate
        var scroll_offset_y = d3.event.pageY - d3.event.clientY;
        var scroll_offset_x = d3.event.pageX - d3.event.clientX;
        var matrix = this.getScreenCTM()
                .translate(+ x(data[data.length - 1].time),
                         + y(data[data.length - 1].eng1));

        div.transition()
          .duration(200)
          .style("opacity", 0.9);
          div.html("<em>Rater 1</em>")
          .style("left", ((matrix.e + scroll_offset_x + 10) + "px"))
          .style("top", ((matrix.f + scroll_offset_y) + "px"))
    })
    .on("mouseleave", function() {
      d3.select(this)
        .style("opacity", 0.2)
      div.transition()
        // .duration(200)
        .style("opacity", 0);
    });

  // add points for rater 1
  // svg2_1.selectAll("dot")
  //     .data(data)
  //   .enter().append("circle")
  //     .attr("r", 3)
  //     .attr("cx", function(d) { return x(d.time)})
  //     .attr("cy", function(d) { return y(d.eng1)})
  //     .attr("fill", "#000000")
  //     .on("mouseover", function (d) {
  //       d3.select(this)
  //         .transition()
  //         .duration(500)
  //         .attr("r", 8)
  //       div.transition()
  //         .duration(200)
  //         .style("opacity", 0.9);
  //         div.html("<p><em>Rater 1</em></p><p>" + d.mood1 + " mood</p>")
  //         .style("left", (d3.event.pageX + "px"))
  //         .style("top", (d3.event.pageY + 15 + "px"));
  //     })
  //     .on("mouseout", function(d) {
  //       d3.select(this)
  //         .transition()
  //         .duration(500)
  //         .attr("r", 3)
  //       div.transition()
  //         .duration(500)
  //         .style("opacity", 0);
  //     });

  // rater 2 line
  svg2_1.append("path")
    .data([data])
    .attr("fill", "none")
    .style("stroke", "url(#" + gradient_id2_2 + ")")
    .attr("stroke-width", "5px")
    .style("opacity", 0.2)
    .attr("d", rater_line2)
    .on("mouseenter", function() {
      d3.select(this)
        .style("opacity", 1)

        // get coordinates for rater box display
        // first get offset by comparing content mouse coordinate with frame mouse coordinate
        var scroll_offset_y = d3.event.pageY - d3.event.clientY;
        var scroll_offset_x = d3.event.pageX - d3.event.clientX;
        // then get coordinates of last data point of line
        var matrix = this.getScreenCTM()
                .translate(+ x(data[data.length - 1].time),
                         + y(data[data.length - 1].eng2));

        div.transition()
          .duration(200)
          .style("opacity", 0.9);
          div.html("<em>Rater 2</em>")
          .style("left", ((matrix.e + scroll_offset_x + 10) + "px"))
          .style("top", ((matrix.f + scroll_offset_y) + "px"))
    })
    .on("mouseleave", function() {
      d3.select(this)
        .style("opacity", 0.2)
      div.transition()
        // .duration(200)
        .style("opacity", 0);
    });

  // add points for rater 2
  // svg2_1.selectAll("dot")
  //     .data(data)
  //   .enter().append("circle")
  //     .attr("r", 3)
  //     .attr("cx", function(d) { return x(d.time)})
  //     .attr("cy", function(d) { return y(d.eng2)})
  //     .attr("fill", "#000000")
  //     .on("mouseover", function (d) {
  //       d3.select(this)
  //         .transition()
  //         .duration(500)
  //         .attr("r", 8)
  //       div.transition()
  //         .duration(200)
  //         .style("opacity", .9);
  //         div.html("<p><em>Rater 2</em></p><p>" + d.mood2 + " mood</p>")
  //         .style("left", (d3.event.pageX + "px"))
  //         .style("top", (d3.event.pageY + 15 + "px"));
  //     })
  //     .on("mouseout", function(d) {
  //       d3.select(this)
  //         .transition()
  //         .duration(500)
  //         .attr("r", 3)
  //       div.transition()
  //         .duration(500)
  //         .style("opacity", 0);
  //     });

    // rater 3 line
    svg2_1.append("path")
      .data([data])
      .attr("fill", "none")
      .style("stroke", "url(#" + gradient_id2_3 + ")")
      .attr("stroke-width", "5px")
      .style("opacity", 0.2)
      .attr("d", rater_line3)
      .on("mouseenter", function() {
        d3.select(this)
          .style("opacity", 1)

          // get coordinates for rater box display
          // first get offset by comparing content mouse coordinate with frame mouse coordinate
          var scroll_offset_y = d3.event.pageY - d3.event.clientY;
          var scroll_offset_x = d3.event.pageX - d3.event.clientX;
          // then get coordinates of last data point of line
          var matrix = this.getScreenCTM()
                  .translate(+ x(data[data.length - 1].time),
                           + y(data[data.length - 1].eng3));

          div.transition()
            .duration(200)
            .style("opacity", 0.9);
            div.html("<em>Rater 3</em>")
            .style("left", ((matrix.e + scroll_offset_x + 10) + "px"))
            .style("top", ((matrix.f + scroll_offset_y) + "px"))
      })
      .on("mouseleave", function() {
        d3.select(this)
          .style("opacity", 0.2)
        div.transition()
          // .duration(200)
          .style("opacity", 0);
      });

      // rater 3 dots
      // svg2_1.selectAll("dot")
      //     .data(data)
      //   .enter().append("circle")
      //     .attr("r", 3)
      //     .attr("cx", function(d) { return x(d.time)})
      //     .attr("cy", function(d) { return y(d.eng3)})
      //     .attr("fill", "#000000")
      //     .on("mouseover", function (d) {
      //       d3.select(this)
      //         .transition()
      //         .duration(500)
      //         .attr("r", 8)
      //       div.transition()
      //         .duration(200)
      //         .style("opacity", .9);
      //         div.html("<p><em>Rater 3</em></p><p>" + d.mood3 + " mood</p>")
      //         .style("left", (d3.event.pageX + "px"))
      //         .style("top", (d3.event.pageY + 15 + "px"));
      //     })
      //     .on("mouseout", function(d) {
      //       d3.select(this)
      //         .transition()
      //         .duration(500)
      //         .attr("r", 3)
      //       div.transition()
      //         .duration(500)
      //         .style("opacity", 0);
      //     });

      // rater4 line
      svg2_1.append("path")
        .data([data])
        .attr("fill", "none")
        .style("stroke", "url(#" + gradient_id2_4 + ")")
        .attr("stroke-width", "5px")
        .style("opacity", 0.2)
        .attr("d", rater_line4)
        .on("mouseenter", function() {
          d3.select(this)
            .style("opacity", 1)

            // get coordinates for rater box display
            // first get offset by comparing content mouse coordinate with frame mouse coordinate
            var scroll_offset_y = d3.event.pageY - d3.event.clientY;
            var scroll_offset_x = d3.event.pageX - d3.event.clientX;
            // then get coordinates of last data point of line
            var matrix = this.getScreenCTM()
                    .translate(+ x(data[data.length - 1].time),
                             + y(data[data.length - 1].eng3));

            div.transition()
              .duration(200)
              .style("opacity", 0.9);
              div.html("<em>Rater 4</em>")
              .style("left", ((matrix.e + scroll_offset_x + 10) + "px"))
              .style("top", ((matrix.f + scroll_offset_y) + "px"))
        })
        .on("mouseleave", function() {
          d3.select(this)
            .style("opacity", 0.2)
          div.transition()
            // .duration(200)
            .style("opacity", 0);
        });

  // add the X Axis
    svg2_1.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .attr("class", "axisGrey")
        .call(d3.axisBottom(x)
          .tickFormat(d3.timeFormat("%M:%S")));

    // add the Y Axis
    svg2_1.append("g")
        .attr("transform", "translate(" + 50 + ",0)")
        .attr("class", "axisGrey")
        .call(d3.axisLeft(y)
                .ticks(8));
                // .tickValues([1, 4, 8]));

    d3.select(".tick").remove()
    svg2_1.selectAll(".tick")
        .each(function (d) {
            if ( d === 0 ) {
                this.remove();
            }
        });

    // add labels for axes
    svg2_1.append("text")
        .attr("text-anchor", "center")
        .attr("transform",
              "translate(" + ((width - margin.left - margin.right) / 2) + "," + (height + 25) + ")")
        .text("Time")
        .attr("class", "axisLabel")

    svg2_1.append("text")
        .attr("text-anchor", "center")
        .attr("transform", "translate(0," + height / 2 + ")rotate(-90)")
        .text("Engagement")
        .attr("class", "axisLabel")

});
