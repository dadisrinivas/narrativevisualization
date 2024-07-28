document.addEventListener("DOMContentLoaded", function() {
    // Basic D3 setup to create an SVG and add a text element
    const svg = d3.select("#visualization").append("svg")
        .attr("width", "100%")
        .attr("height", "600px")
        .style("border", "1px solid black");

    d3.csv("data/listings.csv").then(function(data) {
        // Simple bar chart example
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = svg.attr("width") - margin.left - margin.right;
        const height = svg.attr("height") - margin.top - margin.bottom;
        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
        const y = d3.scaleLinear().rangeRound([height, 0]);

        x.domain(data.map(d => d.neighbourhood));
        y.domain([0, d3.max(data, d => +d.price)]);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10));

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.neighbourhood))
            .attr("y", d => y(d.price))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.price));
    }).catch(function(error) {
        console.error('Error loading or parsing data:', error);
    });
});
