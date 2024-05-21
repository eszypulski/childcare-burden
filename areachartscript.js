//  SET DIMENSIONS AND MARGINS FOR THE CHART
const margin = { top: 20, right: 60, bottom: 30, left: 50 };
const width = 560 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// SET THE X AND Y SCALES

const x = d3.scaleTime()

    .range([0, width - 10]);

const y = d3.scaleLinear()
    .range([height - 10, 0]);

// CREATE THE SVG ELEMENT AND APPEND IT TO THE CHART CONTAINER

const svg = d3.select("#areachart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// LOAD THE DATA

d3.csv("datasets/ccdata.csv").then(data => {

    // PARSE THE DATA AND CONVERT THE STRINGS TO NUMBERS
    const parseDate = d3.timeParse("%Y");
    data.forEach(d => {
        d.date = parseDate(d.date);
        d.mhi = +d.mhi
        d.mcinfant = +d.mcinfant;
    });

    console.log(data)



    // SET THE X AND Y DOMAINS

    x.domain(d3.extent(data, d => d.date));
    y.domain([12000, 80000]); // REVISIT THIS LATER - SHOULDN'T MATCH EXACTLY


    // ADD THE X-AXIS

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))

    // ADD THE Y-AXIS

    svg.append("g")
    .attr("transform", `translate(${width}, 0)`)
    .call(d3.axisRight(y));
        

// SET UP THE LINE GENERATOR

const line = d3.line ()
.x(d => x(d.date))
.y(d => y(d.mhi));

// SET UP THE AREA GENERATOR

const area = d3.area()
.x(d => x(d.date))
.y0(height-10)
.y1(d => y(d.mhi));

// ADD THE AREA PATH TO THE CHART

svg.append("path")
.datum(data)
.attr("class", "area")
.attr("d", area)
.style("fill", "#85bb65") // CHANGE THE COLOR LATER
.style("opacity", .5); // CHANGE THE OPACITY LATER

// ADD THE LINE PATH TO THE CHART
svg.append("path")
.datum(data)
.attr("class", "line")
.attr("d", line)
.style("fill", "none")
.style("stroke", "#85bb65") // CHANGE THE COLOR LATER
.style("stroke-width", 2); // CHANGE THE WIDTH LATER



// SET UP THE INFANT CARE LINE GENERATOR

const lineInfant = d3.line ()
.x(d => x(d.date))
.y(d => y(d.mcinfant));

// SET UP THE AREA GENERATOR

const areaInfant = d3.area()
.x(d => x(d.date))
.y0(height-10)
.y1(d => y(d.mcinfant));

// ADD THE AREA PATH TO THE CHART

svg.append("path")
.datum(data)
.attr("class", "area")
.attr("d", areaInfant)
.style("fill", "orange") // CHANGE THE COLOR LATER
.style("opacity", .5); // CHANGE THE OPACITY LATER

// ADD THE LINE PATH TO THE CHART
svg.append("path")
.datum(data)
.attr("class", "line")
.attr("d", lineInfant)
.style("fill", "none")
.style("stroke", "orange") // CHANGE THE COLOR LATER
.style("stroke-width", 2); // CHANGE THE WIDTH LATER

});