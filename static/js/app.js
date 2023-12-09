// Fetch data from the URL
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
    // Ensure the data object is defined
    if (!data) {
        console.error("Error loading data");
        return;
    }

    // Populate dropdown menu
    var dropdown = d3.select("#selDataset");
    data.names.forEach(sample => {
        dropdown.append("option").text(sample).property("value", sample);
    });

    // Initial chart with the first sample
    updateChart(data.names[0]);
    drawBubbleChart(data.names[0]);
    displayMetadata(data.names[0]); // Display metadata for the initial sample

    // Update chart, bubble chart, and metadata when dropdown selection changes
    dropdown.on("change", function () {
        var selectedSample = this.value;
        updateChart(selectedSample);
        drawBubbleChart(selectedSample);
        displayMetadata(selectedSample); // Display metadata for the selected sample
    });

    // Function to update the horizontal bar chart based on the selected sample
    function updateChart(sample) {
        var selectedData = data.samples.find(d => d.id === sample);

        // Extract necessary data for the chart
        var trace = {
            type: 'bar',
            orientation: 'h',
            x: selectedData.sample_values.slice(0, 10).reverse(),
            y: selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: selectedData.otu_labels.slice(0, 10).reverse(),
        };

        var layout = {
            title: `Top 10 OTUs for Sample ${sample}`,
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU IDs' }
        };

        // Plot the bar chart in the 'bar' div
        Plotly.newPlot('bar', [trace], layout);
    }

    // Function to draw the bubble chart based on the selected sample
    function drawBubbleChart(sample) {
        var selectedData = data.samples.find(d => d.id === sample);

        // Extract necessary data for the bubble chart
        var trace = {
            type: 'bubble',
            mode: 'markers',
            x: selectedData.otu_ids,
            y: selectedData.sample_values,
            marker: {
                size: selectedData.sample_values,
                color: selectedData.otu_ids,
            },
            text: selectedData.otu_labels,
        };

        var layout = {
            title: `Bubble Chart for Sample ${sample}`,
            xaxis: { title: 'OTU IDs' },
            yaxis: { title: 'Sample Values' },
        };

        // Plot the bubble chart in the 'bubble' div
        Plotly.newPlot('bubble', [trace], layout);
    }

    // Function to display sample metadata based on the selected sample
    function displayMetadata(sample) {
        var metadata = data.metadata.find(d => d.id == sample);

        // Select the metadata div and clear any existing content
        var metadataDiv = d3.select("#sample-metadata").html("");

        // Loop through the key-value pairs in the metadata and append them to the div
        Object.entries(metadata).forEach(([key, value]) => {
            metadataDiv.append("p").text(`${key}: ${value}`);
        });
    }
});
