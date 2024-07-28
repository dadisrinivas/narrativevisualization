document.addEventListener("DOMContentLoaded", function() {
    const scenes = [createScene1, createScene2, createScene3];
    let currentSceneIndex = 0;
    
    const parameters = {
        currentScene: 0,
        data: null,
        neighborhoodsData: null,
        reviewsData: null
    };

    const svg = d3.select("#visualization").append("svg")
        .attr("width", "100%")
        .attr("height", "600px");

    // Load datasets
    Promise.all([
        d3.csv("data/listings.csv"),
        d3.csv("data/neighbourhoods.csv"),
        d3.csv("data/reviews.csv")
    ]).then(function([listings, neighborhoods, reviews]) {
		console.log(listings)
		console.log(neighborhoods)
		console.log(reviews)
        parameters.data = listings;
        parameters.neighborhoodsData = neighborhoods;
        parameters.reviewsData = reviews;

        // Initialize the first scene
        scenes[0]();

        // Next button event listener
        d3.select("#next").on("click", function() {
            if (currentSceneIndex < scenes.length - 1) {
                currentSceneIndex++;
                parameters.currentScene = currentSceneIndex;
                scenes[currentSceneIndex]();
            }
        });
    }).catch(function(error) {
        console.error('Error loading or parsing data:', error);
    });

    function createScene1() {
        svg.html(""); // Clear previous content

        svg.append("text")
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text("Scene 1: Overview of Airbnb Listings");
        
        // Add more visual elements and annotations as needed
    }

    function createScene2() {
        svg.html(""); // Clear previous content

        // Your code to create scene 2 visualization
        svg.append("text")
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text("Scene 2: Detailed Analysis of Neighborhoods");

        // Add more visual elements and annotations as needed
    }

    function createScene3() {
        svg.html(""); // Clear previous content

        // Your code to create scene 3 visualization
        svg.append("text")
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text("Scene 3: Analysis of Reviews");

        // Add more visual elements and annotations as needed
    }
});
