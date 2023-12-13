// Fetch data from the URL
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
  // Ensure the data object is defined
  if (!data) {
    console.error("Error loading data");
    return;
  }

  // Log the data to the console to inspect it
  console.log(data);

  // Populate dropdown menu
  var dropdown = d3.select("#selDataset");
  data.names.forEach(sample => {
    dropdown.append("option").text(sample).property("value", sample);
  });

  // Initial chart with the first sample
  updateCharts(data.names[0]);

  // Update charts when dropdown selection changes
  dropdown.on("change", function () {
    var selectedSample = this.value;
    updateCharts(selectedSample);
  });

  // Function to update all charts based on the selected sample
  function updateCharts(sample) {
    var selectedData = data.samples.find(d => d.id === sample);

    // Update the bar chart
    var barTrace = {
      type: 'bar',
      orientation: 'h',
      x: selectedData.sample_values.slice(0, 10).reverse(),
      y: selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: selectedData.otu_labels.slice(0, 10).reverse(),
    };

    var barLayout = {
      title: `Top 10 OTUs for Sample ${sample}`,
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU IDs' }
    };

    Plotly.newPlot('bar', [barTrace], barLayout);

    // Update the bubble chart
    var bubbleTrace = {
      type: 'bubble',
      mode: 'markers',
      x: selectedData.otu_ids,
      y: selectedData.sample_values,
      marker: {
        size: selectedData.sample_values,
        color: selectedData.otu_ids,
        colorscale: 'Viridis'
      },
      text: selectedData.otu_labels,
    };

    var bubbleLayout = {
      title: `Bacterial Cultures for Sample ${sample}`,
      xaxis: {
        title: 'OTU IDs',
        tickvals: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500],
        ticktext: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500],
      },
      yaxis: {
        title: 'Sample Values',
        range: [0, 250],
        tickvals: [0, 50, 100, 150, 200],
      },
      margin: { t: 50 }
    };

    Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);

    // Update the metadata panel
    var metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html(""); // Clear existing content

    var metadata = data.metadata.find(m => m.id == sample);
    Object.entries(metadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  }
});
