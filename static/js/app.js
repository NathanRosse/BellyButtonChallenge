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

    // Initial update for all plots and metadata
    updatePlotsAndMetadata(data.names[0]);

    // Update all plots and metadata when dropdown selection changes
    dropdown.on("change", function () {
        var selectedSample = this.value;
        updatePlotsAndMetadata(selectedSample);
    });

    // Function to update all plots and metadata based on the selected sample
    function updatePlotsAndMetadata(sample) {
        updateChart(sample);
        drawBubbleChart(sample);
        displayMetadata(sample);
    }

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
            marker: {
                color: 'rgba(50,171,96,0.6)', // Custom color for bars
            }
        };

        var layout = {
            title: `Top 10 Operational Taxonomic Units (OTUs) for Sample ${sample}`,
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU IDs' },
            margin: { t: 50, l: 150 }
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
            colorscale: 'Viridis' // Custom colorscale for better gradient
        },
        text: selectedData.otu_labels,
    };

    var layout = {
        title: `Bacterial Cultures for Sample ${sample}`,
        xaxis: {
            title: 'OTU IDs',
            tickvals: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500], // Set custom tick values
            ticktext: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500]  // Set tick labels accordingly
        },
        yaxis: { title: 'Sample Values' },
        margin: { t: 50 }
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
