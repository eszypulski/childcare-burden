// set the dimensions and margins of the graph
const marginBar = { top: 5, right: 35, bottom: 50, left: 80 };
const widthBar = 450 - marginBar.left - marginBar.right;
const heightBar = 350 - marginBar.top - marginBar.bottom;

// append the svg object to the body of the page
const svgBar = d3.select("#viz_container")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 450 350")
    .attr("preserveAspectRatio", "xMinYMin")
    .append("g")
    .attr("transform", `translate(${marginBar.left}, ${marginBar.top})`);

// parse the Data - REPLACED WITH MY OWN
d3.csv("datasets/2018data.csv")
    .then(function (dataBar) {

        // list of value keys
        const typeKeys = dataBar.columns.slice(1);

        // stack the data
        const stack = d3.stack()
            .keys(typeKeys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone)
        const stackedData = stack(dataBar)

        // X scale and Axis
        const xScaleBar = d3.scaleLinear()
            .domain([0, 1])
            .range([0, widthBar]);

        svgBar
            .append('g')
            .attr("transform", `translate(0, ${heightBar})`)
            .call(d3.axisBottom(xScaleBar).ticks(10, "%").tickSize(0).tickPadding(8));

        // Y scale and Axis
        const yScaleBar = d3.scaleBand()
            .domain(dataBar.map(d => d.date))
            .range([0, heightBar])
            .padding(.2);

        svgBar
            .append('g')
            .call(d3.axisLeft(yScaleBar).tickSize(0).tickPadding(4))
            .call(d => d.select(".domain").remove());

        // color palette
        const colorBar = d3.scaleOrdinal()
            .domain(typeKeys)
            .range(["#21897E", "#DADADA", "#7EBCE6"])
        

        // create bars
        svgBar.append("g")
            .selectAll("g")
            .data(stackedData)
            .join("g")
            .attr("fill", d => colorBar(d.key))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("y", d => yScaleBar(d.data.date))
            .attr("x", d => xScaleBar(0))
            .attr("height", yScaleBar.bandwidth())
            .attr("width", d => xScaleBar(d[1]) - xScaleBar(d[0]))
            .attr("x", d => xScaleBar(d[0]))

        

 
        /*set legend
        svgBar
            .append("rect")
            .attr("x", 5)
            .attr("y",5)
            .attr("width", 13)
            .attr("height", 13)
            .style("fill", "#18375F")
        svgBar
            .append("text")
            .attr("class", "legend")
            .attr("x", 200)
            .attr("y", 200)
            .text("Earmarked")
        svgBar
            .append("rect")
            .attr("x", 60)
            .attr("y", -(marginBar.top / 2.5))
            .attr("width", 13)
            .attr("height", 13)
            .style("fill", "#0072BC")
        svgBar
            .append("text")
            .attr("class", "legend")
            .attr("x", 80)
            .attr("y", -(marginBar.top / 3.5))
            .text("Softly earmarked")
        svgBar
            .append("rect")
            .attr("x", 170)
            .attr("y", -(marginBar.top / 2.5))
            .attr("width", 13)
            .attr("height", 13)
            .style("fill", "#8EBEFF")
        svgBar
            .append("text")
            .attr("class", "legend")
            .attr("x", 190)
            .attr("y", -(marginBar.top / 3.5))
            .text("Tightly earmarked")
        svgBar
            .append("rect")
            .attr("x", 290)
            .attr("y", -(marginBar.top / 2.5))
            .attr("width", 13)
            .attr("height", 13)
            .style("fill", "#00B398")
        svgBar
            .append("text")
            .attr("class", "legend")
            .attr("x", 310)
            .attr("y", -(marginBar.top / 3.5))
            .text("Unearmarked")*/
    })
