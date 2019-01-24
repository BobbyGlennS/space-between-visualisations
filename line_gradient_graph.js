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

  // format the data
  data.forEach(function(d) {
      d.time = +d.unit;
      d.engagement_mean = +d.engagement_mean;
  });

  // scale the range of the data
  x.domain([1, 312])
  // x.domain([1, d3.max(data, function(d) { return d.unit; })]);
  y.domain([0, d3.max(data, function(d) { return d.engagement_mean; })]);

  // set the gradient
  svg.append("linearGradient")
    .attr("id", "area-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", x(0)).attr("y1", y(0))
    .attr("x2", x(312)).attr("y2", y(0))
  .selectAll("stop")
    .data([
      {offset: "0.32051282051282%", color: "#FABB00"},
      {offset: "1.28205128205128%", color: "#F1E300"},
      {offset: "10.5769230769231%", color: "#C6DB00"},
      {offset: "16.9871794871795%", color: "#D3DE00"},
      {offset: "22.4358974358974%", color: "#F8AA00"},
      {offset: "25.6410256410256%", color: "#D3DE00"},
      {offset: "31.0897435897436%", color: "#FFE600"},
      {offset: "34.6153846153846%", color: "#C6DB00"},
      {offset: "37.1794871794872%", color: "#FFE600"},
      {offset: "45.5128205128205%", color: "#FABB00"},
      {offset: "46.474358974359%", color: "#E4E100"},
      {offset: "85.5769230769231%", color: "#FDD500"},
      {offset: "97.4358974358974%", color: "#A8D600"},
      {offset: "100%", color: "#FBC800"},
    ])
  .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.color; });

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
      .call(d3.axisBottom(x));
        //.tickFormat(d3.timeFormat("%M:%S")));

  // add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});
