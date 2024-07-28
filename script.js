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

        // Aggregate data by neighbourhood and calculate average price
        const groupedData = d3.rollup(parameters.data, v => d3.mean(v, d => d.price), d => d.neighbourhood);
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
    }

    function createScene2() {
        svg.html(""); // Clear previous content

        // Aggregate data by room type
        const roomTypeData = d3.rollup(parameters.data, v => v.length, d => d.room_type);
        const nestedRoomTypeData = Array.from(roomTypeData, ([key, value]) => ({ key, value }));

        const radius = Math.min(800, 600) / 2;

        const g = svg.append("g")
            .attr("transform", `translate(${800 / 2}, ${600 / 2})`);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie().value(d => d.value);

        const path = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        const label = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        const arc = g.selectAll(".arc")
            .data(pie(nestedRoomTypeData))
            .enter().append("g")
            .attr("class", "arc");

        arc.append("path")
            .attr("d", path)
            .attr("fill", d => color(d.data.key));

        arc.append("text")
            .attr("transform", d => `translate(${label.centroid(d)})`)
            .attr("dy", "0.35em")
            .text(d => d.data.key);

        // Add title
        svg.append("text")
            .attr("x", 400)
            .attr("y", 50)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Distribution of Room Types");
    }

    function createScene3() {
        svg.html(""); // Clear previous content

        // Aggregate data by availability
        const availabilityData = d3.rollup(parameters.data, v => d3.mean(v, d => d.availability_365), d => d.neighbourhood);
        const nestedAvailabilityData = Array.from(availabilityData, ([key, value]) => ({ key, value }));

        const margin = { top: 20, right: 20, bottom: 100, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
        const y = d3.scaleLinear().rangeRound([height, 0]);

        x.domain(nestedAvailabilityData.map(d => d.key));
        y.domain([0, d3.max(nestedAvailabilityData, d => d.value)]);

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

        // Add line
        const line = d3.line()
            .x(d => x(d.key))
            .y(d => y(d.value));

        g.append("path")
            .datum(nestedAvailabilityData)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        // Add points
        g.selectAll(".dot")
            .data(nestedAvailabilityData)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.key))
            .attr("cy", d => y(d.value))
            .attr("r", 5)
            .attr("fill", "steelblue");

        // Add title
        svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")  
            .style("font-size", "20px") 
            .text("Average Availability of Listings by Neighborhood");

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
            .text("Average Availability (days)");
    }
});
