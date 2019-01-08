var div = d3.select("body").append("div")
     .attr("class", "tooltip")

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%M:%S");

// set the ranges
var x = d3.scaleTime().range([20, width]);
var y = d3.scaleLinear().range([height, 0]);

// set the colour scale
var colour = d3.scaleLinear()
               .domain([1, 4.5, 8])
               .range(["red", "yellow", "green"]);

// define the line
var mean_line = d3.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.engagement_mean); });

var rater_line1 = d3.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.eng1); });

var rater_line2 = d3.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.eng2); });

var rater_line3 = d3.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.eng3); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// set legend
var legendLinear = d3.legendColor()
  .shapeWidth(10)
  .title("Mood Colour")
  .cells([1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8])
  .labels(["negative", "", "", "", "", "", "", "neutral", "", "", "", "", "", "", "positive"])
  .orient('horizontal')
  .scale(colour)

// Get the data
d3.csv(data_file, function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.time = parseTime(d.time);
      d.mood_mean = +d.mood_mean;
      d.engagement_mean = +d.engagement_mean;
      d.mood1 = +d.mood1;
      d.mood2 = +d.mood2;
      d.mood3 = +d.mood3;
      d.eng1 = +d.eng1;
      d.eng2 = +d.eng2;
      d.eng3 = +d.eng3;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.time; }));
  //y.domain([2, d3.max(data, function(d) { return d.mood_mean; })]);
  y.domain([1, 10]);

  // Add path for rater 1
  svg.append("path")
    .data([data])
    .attr("fill", "none")
    .attr("stroke", "#eeeeee")
    .attr("stroke-width", 1)
    .attr("d", rater_line1)
    .on("mouseover", function() {
      d3.select(this)
        .attr("stroke", "red")
        .attr("opacity", 0.5)
    })
    .on("mouseout", function() {
      d3.select(this)
        .transition()
        .duration(1000)
        .attr("stroke", "#eeeeee")
    });

  // add points for rater 1
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 10)
      .attr("cx", function(d) { return x(d.time)})
      .attr("cy", function(d) { return y(d.eng1)})
      .attr("fill", function(d) {return colour(d.mood1)})
      .attr("opacity", 0.1)
      .on("mouseover", function (d) {
        d3.select(this)
          .transition()
          .duration(500)
          .attr("fill", colour(d.mood1))
          .attr("opacity", 0.9)
          .attr("r", 10*4)
        div.transition()
          .duration(200)
          .style("opacity", .8);
          div.html("rater 1: " + d.mood1 + " mood")
          .style("left", (d3.event.pageX + "px"))
          .style("top", (d3.event.pageY + 15 + "px"));
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(500)
          .attr("opacity", 0.1)
          .attr("fill", colour(d.mood1))
          .attr("r", 10)
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

// rater 2
  svg.append("path")
    .data([data])
    .attr("fill", "none")
    .attr("stroke", "#eeeeee")
    .attr("stroke-width", 1)
    .attr("d", rater_line2)
    .on("mouseover", function() {
      d3.select(this)
        .attr("stroke", "red")
        .attr("opacity", 0.5)
    })
    .on("mouseout", function() {
      d3.select(this)
        .transition()
        .duration(1000)
        .attr("stroke", "#eeeeee")
    });

  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 10)
      .attr("cx", function(d) { return x(d.time)})
      .attr("cy", function(d) { return y(d.eng2)})
      .attr("fill", function(d) { return colour(d.mood2)})
      .attr("opacity", 0.1)
      .on("mouseover", function (d) {
        d3.select(this)
          .transition()
          .duration(500)
          .attr("fill", colour(d.mood2))
          .attr("opacity", 0.8)
          .attr("r", 10*4)
        div.transition()
          .duration(200)
          .style("opacity", .9);
          div.html("rater 2: " + d.mood2 + " mood")
          .style("left", (d3.event.pageX + "px"))
          .style("top", (d3.event.pageY + 15 + "px"));
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(500)
          .attr("fill", colour(d.mood2))
          .attr("opacity", 0.1)
          .attr("r", 10)
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

// rater 3
  svg.append("path")
    .data([data])
    .attr("fill", "none")
    .attr("stroke", "#eeeeee")
    .attr("stroke-width", 1)
    .attr("d", rater_line3)
    .on("mouseover", function() {
      d3.select(this)
        .attr("stroke", "red")
    })
    .on("mouseout", function() {
      d3.select(this)
        .transition()
        .duration(1000)
        .attr("stroke", "#eeeeee")
    });


  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 10)
      .attr("cx", function(d) { return x(d.time)})
      .attr("cy", function(d) { return y(d.eng3)})
      .attr("fill", function(d) { return colour(d.mood3)})
      .attr("opacity", 0.1)
      .on("mouseover", function (d) {
        d3.select(this)
          .transition()
          .duration(500)
          .attr("fill", colour(d.mood3))
          .attr("opacity", 0.8)
          .attr("r", 10*4)
        div.transition()
          .duration(200)
          .style("opacity", .9);
          div.html("rater 3: " + d.mood3 + " mood")
          .style("left", (d3.event.pageX + "px"))
          .style("top", (d3.event.pageY + 15 + "px"));
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(500)
          .attr("fill", colour(d.mood3))
          .attr("opacity", 0.1)
          .attr("r", 10)
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

// mean data
  svg.append("path")
      .data([data])
      .attr("class", "mean_line")
      .attr("d", mean_line);

  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 10)
      .attr("cx", function(d) { return x(d.time)})
      .attr("cy", function(d) { return y(d.engagement_mean)})
      .attr("fill", function(d) { return colour(d.mood_mean)})
      .attr("opacity", 1)

// Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
        .tickFormat(d3.timeFormat("%M:%S")))

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // add labels for axes
  svg.append("text")
      .attr("text-anchor", "right")
      .attr("transform",
            "translate(" + (width - margin.right) + "," + height * 0.99 + ")")
      .text("time");

  svg.append("text")
      .attr("text-anchor", "bottom")
      .attr("transform", "translate(12," + height * 0.99 + ")rotate(-90)")
      .text("engagement");

  // add legend
  svg.append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate(20, 20)");

  svg.select(".legendLinear")
      .call(legendLinear);

});
