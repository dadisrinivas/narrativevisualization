d3.csv("data/listings.csv").then(function(data) {
    console.log(data);
    // Continue with data processing and visualization here
});

let parameters = {
    scene: 1
};

function createScene1() {
    d3.select("#visualization").html(""); // Clear previous content

    // Create the first scene visualization
    d3.select("#visualization").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("text")
        .attr("x", "50%")
        .attr("y", "50%")
        .attr("text-anchor", "middle")
        .text("Scene 1: Overview of Airbnb Listings in NYC");

    // Add more visual elements and annotations as needed
}

createScene1();

function createScene2() {
    d3.select("#visualization").html(""); // Clear previous content

    // Create the second scene visualization
    d3.select("#visualization").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("text")
        .attr("x", "50%")
        .attr("y", "50%")
        .attr("text-anchor", "middle")
        .text("Scene 2: Detailed Analysis of Listings");

    // Add more visual elements and annotations as needed
}

function nextScene() {
    parameters.scene += 1;
    if (parameters.scene === 2) {
        createScene2();
    }
}

d3.select("body").on("click", nextScene);
