// Specify the chart’s dimensions (except for the height).
const swidth = 200;
const smarginTop = 30;
const smarginRight = 20;
const smarginBottom = 0;
const smarginLeft = 30;

// LOAD THE DATA
d3.csv("datasets/data_test.csv").then(data => {

    // PARSE THE DATA AND CONVERT THE STRINGS TO NUMBERS
    const parseDate = d3.timeParse("%Y");

    data.forEach(d => {
        d.date = parseDate(d.date);
        d.careburden = +d.careburden;
        d.rentburden = +d.rentburden;
        d.otherburden = 1 - d.careburden - d.rentburden;
    });

    console.log(data);

    // Stack the data
    const series = d3.stack()
        .keys(["careburden", "otherburden", "rentburden"])
        .offset(d3.stackOffsetExpand)
        (data);

    // Compute the height from the number of stacks.
    const height = series[0].length * 25 + smarginTop + smarginBottom;

    // Prepare the scales for positional and color encodings.
    const x = d3.scaleLinear()
        .domain([0, 1])
        .range([smarginLeft, swidth - smarginRight]);

    // Define the y scale
    const y = d3.scaleBand()
        .domain(data.map(d => d.date))
        .range([smarginTop, height - smarginBottom])
        .padding(0.1);

    const color = d3.scaleOrdinal()
        .domain(series.map(d => d.key))
        .range(d3.schemeSpectral[series.length])
        .unknown("#ccc");

    // Create the SVG container.
    const svg = d3.select("#squeezechart")
        .attr("width", swidth)
        .attr("height", height)
        .attr("viewBox", [0, 0, swidth, height])
        .attr("style", "max-width: 100%; height: auto;");

    // Append a group for each series, and a rect for each element in the series.
    svg.append("g")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(D => D.map(d => (d.key = D.key, d)))
        .join("rect")
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d.data.date))
        .attr("height", y.bandwidth())
        .attr("width", d => x(d[1]) - x(d[0]))
        .append("title")
        .text(d => `${d.key}: ${(d[1] - d[0]) * 100}%`);

    // Append the horizontal axis.
    svg.append("g")
        .attr("transform", `translate(0,${smarginTop})`)
        .call(d3.axisTop(x).ticks(swidth / 100, "%"))
        .call(g => g.selectAll(".domain").remove());

    // Append the vertical axis.
    svg.append("g")
        .attr("transform", `translate(${smarginLeft},0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call(g => g.selectAll(".domain").remove());

    // Return the chart with the color scale as a property (for the legend).
    return Object.assign(svg.node(), { scales: { color } });
});
