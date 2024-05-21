// SET DIMENSIONS AND MARGINS FOR THE CHART
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
    let filteredData;

    data.forEach(d => {
        d.date = parseDate(d.date);
        d.mhi = +d.mhi
        d.mcinfant = +d.mcinfant
        d.benchmark = +d.benchmark;
        d.county = d.county;
    });

    // ADD THE DROPDOWN MENU OPTIONS 
    d3.select("#countyDropdown")
        .selectAll("option")
        .data(["Cook County", "Harris County", "Los Angeles County", "Maricopa County", "San Diego County"])
        .enter()
        .append("option")
        .text(function (d) { return d; });

    // Function to update the chart based on the selected county
    function updateChart() {
        // Get the selected county from the dropdown menu
        let selectedCounty = d3.select("#countyDropdown").property("value");

        // Filter the data to include only data from the selected county
        filteredData = data.filter(function (d) { return d.county === selectedCounty; });

        // SET THE X AND Y DOMAINS
        x.domain(d3.extent(filteredData, d => d.date));
        y.domain([0, (d3.max(filteredData, d => d.mhi)) + 5000]);

    

        // Filtered data log
        console.log(filteredData);
    

  

 



    //Filter the data to include only data from one county
   //filteredData = data.filter(function (d) { return d.county == "Maricopa County" });


    

    // SET THE X AND Y DOMAINS

    x.domain(d3.extent(filteredData, d => d.date));
    y.domain([0, (d3.max(filteredData, d => d.mhi)) + 5000]); // REVISIT THIS LATER - SHOULDN'T MATCH EXACTLY


    // ADD THE X-AXIS

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))

    // ADD THE Y-AXIS

    svg.append("g")
        .attr("transform", `translate(${width}, 0)`)
        .call(d3.axisRight(y));


    // SET UP THE LINE GENERATOR

    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.mhi));

    // SET UP THE AREA GENERATOR

    const area = d3.area()
        .x(d => x(d.date))
        .y0(height - 10)
        .y1(d => y(d.mhi));

    // ADD THE AREA PATH TO THE CHART

    svg.append("path")
        .datum(filteredData)
        .attr("class", "area")
        .attr("d", area)
        .style("fill", "#85bb65") // CHANGE THE COLOR LATER
        .style("opacity", .5); // CHANGE THE OPACITY LATER

    // ADD THE LINE PATH TO THE CHART
    svg.append("path")
        .datum(filteredData)
        .attr("class", "line")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#85bb65") // CHANGE THE COLOR LATER
        .style("stroke-width", 2); // CHANGE THE WIDTH LATER



    // SET UP THE INFANT CARE LINE GENERATOR

    const lineInfant = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.mcinfant));

    // SET UP THE AREA GENERATOR

    const areaInfant = d3.area()
        .x(d => x(d.date))
        .y0(height - 10)
        .y1(d => y(d.mcinfant));

    // ADD THE AREA PATH TO THE CHART

    svg.append("path")
        .datum(filteredData)
        .attr("class", "area")
        .attr("d", areaInfant)
        .style("fill", "orange") // CHANGE THE COLOR LATER
        .style("opacity", .5); // CHANGE THE OPACITY LATER

    // ADD THE LINE PATH TO THE CHART
    svg.append("path")
        .datum(filteredData)
        .attr("class", "line")
        .attr("d", lineInfant)
        .style("fill", "none")
        .style("stroke", "orange") // CHANGE THE COLOR LATER
        .style("stroke-width", 2); // CHANGE THE WIDTH LATER 
    }

  // Call the updateChart function initially
  updateChart();

  // Add an event listener to the dropdown menu to update the chart when the selection changes
  d3.select("#countyDropdown").on("change", updateChart);

    // ADD THE LEGEND




})
