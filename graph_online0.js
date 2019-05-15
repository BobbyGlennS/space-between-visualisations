// set the dimensions and margins of the graph
var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 1 - margin.left - margin.right,
    height = 1 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%M:%S");

// set the ranges
var x = d3.scaleTime().range([margin.left, width - margin.right]);
var y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

// define the line
var valueline = d3.line()
    .curve(d3.curveCardinal.tension(0.9))
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.engagement_mean); })

  var svg0 = d3.select(area_id)
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
      d.laughter_duration = +d.laughter_duration;
  });
  // scale the range of the data
  x.domain([parseTime("00:00"), parseTime("05:00")])
  y.domain([0, 8])

  // add the X Axis
    svg0.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .attr("class", "axisWhite")
        .call(d3.axisBottom(x)
          .tickFormat(d3.timeFormat("%M:%S")));

    // add the Y Axis
    svg0.append("g")
        .attr("transform", "translate(" + 50 + ",0)")
        .attr("class", "axisWhite")
        .call(d3.axisLeft(y)
                .ticks(8));
});
