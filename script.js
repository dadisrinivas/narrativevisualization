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

        // Group data by neighbourhood and calculate average price
        const groupedData = d3.rollup(data, v => d3.mean(v, d => d.price), d => d.neighbourhood);

        // Convert the grouped data to an array of objects for D3
        const nestedData = Array.from(groupedData, ([key, value]) => ({ key, value }));

        // Set up margins and dimensions
        const margin = { top: 20, right: 20, bottom: 100, left: 60 };
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

        // Add title
        svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")  
            .style("font-size", "20px") 
            .text("Average Price of Airbnb Listings by Neighborhood");

        // Add x-axis label
        svg.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
            .style("text-anchor", "middle")
            .text("Neighborhood");

        // Add y-axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Average Price ($)");
    }).catch(function(error) {
        console.error('Error loading or parsing data:', error);
    });
});
