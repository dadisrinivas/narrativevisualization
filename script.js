document.addEventListener("DOMContentLoaded", function() {
    // Basic D3 setup to create an SVG and add a text element
    const svg = d3.select("#visualization").append("svg")
        .attr("width", "100%")
        .attr("height", "600px")
        .style("border", "1px solid black");

    d3.csv("data/listings.csv").then(function(data) {
        console.log(data); // Check the structure of the data

        // Ensure price is a number and filter out invalid data
        data.forEach(d => {
            d.price = +d.price; // Ensure price is a number
        });

        // Aggregate data by neighbourhood and calculate average price
        const nestedData = d3.nest()
            .key(d => d.neighbourhood)
            .rollup(v => d3.mean(v, d => d.price))
            .entries(data);

        // Set up margins and dimensions
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        // Set up scales
        const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
        const y = d3.scaleLinear().rangeRound([height, 0]);

        x.domain(nestedData.map(d => d.key));
        y.domain([0, d3.max(nestedData, d => d.value)]);

        // Add x-axis
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Add y-axis
        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10));

        // Add bars
        g.selectAll(".bar")
            .data(nestedData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.key))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", "steelblue");
    }).catch(function(error) {
        console.error('Error loading or parsing data:', error);
    });
});
