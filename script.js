document.addEventListener("DOMContentLoaded", function() {
    const scenes = [createScene1, createScene2, createScene3];
    let currentSceneIndex = 0;

    const parameters = {
        currentScene: 0,
        selectedNeighborhood: null,
        selectedListing: null,
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
        parameters.data = listings;
        parameters.neighborhoodsData = neighborhoods;
        parameters.reviewsData = reviews;

        // Initialize the first scene
        scenes[0]();

        // Back button event listener
        d3.select("#back").on("click", function() {
            if (currentSceneIndex > 0) {
                currentSceneIndex--;
                parameters.currentScene = currentSceneIndex;
                scenes[currentSceneIndex]();
                updateButtons();
            }
        });

        // Next button event listener
        d3.select("#next").on("click", function() {
            if (currentSceneIndex < scenes.length - 1) {
                currentSceneIndex++;
                parameters.currentScene = currentSceneIndex;
                scenes[currentSceneIndex]();
                updateButtons();
            }
        });

        // Update button states
        function updateButtons() {
            d3.select("#back").attr("disabled", currentSceneIndex === 0 ? "true" : null);
            d3.select("#next").attr("disabled", currentSceneIndex === scenes.length - 1 ? "true" : null);
        }

        updateButtons();
    }).catch(function(error) {
        console.error('Error loading or parsing data:', error);
    });

    function createScene1() {
        svg.html(""); // Clear previous content

        // Aggregate data by neighbourhood and count listings
        const groupedData = d3.rollup(parameters.data, v => v.length, d => d.neighbourhood);
        const nestedData = Array.from(groupedData, ([key, value]) => ({ key, value }));

        // Set up margins and dimensions
        const margin = { top: 20, right: 20, bottom: 100, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

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
            .attr("fill", "steelblue")
            .on("click", function(event, d) {
                parameters.selectedNeighborhood = d.key;
                currentSceneIndex++;
                parameters.currentScene = currentSceneIndex;
                scenes[currentSceneIndex]();
                updateButtons();
            });

        // Add title
        svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")  
            .style("font-size", "20px") 
            .text("Overview of Listings by Neighborhood");

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
            .text("Number of Listings");
    }

    function createScene2() {
        svg.html(""); // Clear previous content

        // Filter data by selected neighborhood
        const neighborhoodData = parameters.data.filter(d => d.neighbourhood === parameters.selectedNeighborhood);

        // Set up margins and dimensions
        const margin = { top: 20, right: 20, bottom: 100, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
        const y = d3.scaleLinear().rangeRound([height, 0]);

        x.domain(neighborhoodData.map(d => d.name));
        y.domain([0, d3.max(neighborhoodData, d => d.price)]);

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
            .data(neighborhoodData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.name))
            .attr("y", d => y(d.price))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.price))
            .attr("fill", "steelblue")
            .on("click", function(event, d) {
                parameters.selectedListing = d.id;
                currentSceneIndex++;
                parameters.currentScene = currentSceneIndex;
                scenes[currentSceneIndex]();
                updateButtons();
            });

        // Add title
        svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")  
            .style("font-size", "20px") 
            .text(`Listings in ${parameters.selectedNeighborhood}`);

        // Add x-axis label
        svg.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
            .style("text-anchor", "middle")
            .text("Listing");

        // Add y-axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Price ($)");
    }

    function createScene3() {
        svg.html(""); // Clear previous content

        // Filter reviews by selected listing
        const listingReviews = parameters.reviewsData.filter(d => d.listing_id == parameters.selectedListing);

        // Aggregate reviews by date
        const reviewsByDate = d3.rollup(listingReviews, v => v.length, d => d.date);
        const nestedReviewsByDate = Array.from(reviewsByDate, ([key, value]) => ({ date: key, value }));

        // Set up margins and dimensions
        const margin = { top: 20, right: 20, bottom: 100, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime().rangeRound([0, width]);
        const y = d3.scaleLinear().rangeRound([height, 0]);

        const parseDate = d3.timeParse("%Y-%m-%d");
        nestedReviewsByDate.forEach(d => {
            d.date = parseDate(d.date);
        });

        x.domain(d3.extent(nestedReviewsByDate, d => d.date));
        y.domain([0, d3.max(nestedReviewsByDate, d => d.value)]);

        // Add x-axis
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        // Add y-axis
        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10));

        // Add line
        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value));

        g.append("path")
            .datum(nestedReviewsByDate)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        // Add points
        g.selectAll(".dot")
            .data(nestedReviewsByDate)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.date))
            .attr("cy", d => y(d.value))
            .attr("r", 5)
            .attr("fill", "steelblue");

        // Add title
        svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")  
            .style("font-size", "20px") 
            .text("Reviews Over Time for Selected Listing");

        // Add x-axis label
        svg.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
            .style("text-anchor", "middle")
            .text("Date");

        // Add y-axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Number of Reviews");
    }
});
