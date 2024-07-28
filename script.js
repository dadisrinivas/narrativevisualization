document.addEventListener("DOMContentLoaded", function() {
    // Basic D3 setup to create an SVG and add a text element
    const svg = d3.select("#visualization").append("svg")
        .attr("width", "100%")
        .attr("height", "600px")
        .style("border", "1px solid black");

    svg.append("text")
        .attr("x", "50%")
        .attr("y", "50%")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text("Scene 1: Overview of Airbnb Listings in NYC");

    // Load and log data
    d3.csv("data/listings.csv").then(function(data) {
        console.log(data);
        // Add more data-dependent visualizations here
    }).catch(function(error) {
        console.error('Error loading or parsing data:', error);
    });
});
