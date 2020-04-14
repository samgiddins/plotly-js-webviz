// Select metadata
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        console.log(data.metadata);
        var metadata = data.metadata;
        var idCheck = metadata.filter(val => val.id == sample);
        console.log(idCheck);
        var panelThingy = d3.select("#sample-metadata");
        panelThingy.html("");
        Object.entries(idCheck[0]).forEach(([key, value]) => {
            panelThingy.append("h6").text(`${key}: ${value}`);
        })
    });
}

// Grab info for a section
function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var dynamicData = data.samples
        var resultArray = dynamicData.filter(value => value.id == sample)
        console.log(resultArray[0]);
        var otuIds = resultArray[0].otu_ids;
        var values = resultArray[0].sample_values;
        var labels = resultArray[0].otu_labels;

        // Bubble Chart
        var trace1 = {
            x: otuIds,
            y: values,
            mode: 'markers',
            marker: {
                color: otuIds,
                size: values,
                labels: labels
            }
          };
          
          var data = [trace1];
          
          var layout = {
            showlegend: false,
            height: 600,
            width: 1200
          };
          
          Plotly.newPlot('bubble', data, layout);

        // Bar Chart
        var topTenIds = otuIds.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();;
        var topTenLabels = labels.slice(0, 10).reverse();
        var topTenValues = values.slice(0, 10).reverse();

        var data1 = [
            {
              x: topTenValues,
              y: topTenIds,
              type: 'bar',
              orientation: 'h',
              text: topTenLabels
            }
          ];
          
          Plotly.newPlot('bar', data1);

    });
}

// Add ids to dropdown
function init() {
    var selector = d3.select("#selDataset")
    d3.json("samples.json").then((data) => {
        var ids = data.names
        console.log(ids)
        ids.forEach((val) => {
            selector   
                .append("option")
                .text(val)
                .property("value", val)
        })
    var sample1 = ids[0]
    buildMetadata(sample1);
    buildCharts(sample1);
   
    });
}

function optionChanged(newSample) {
    buildMetadata(newSample)
    buildCharts(newSample)
}

init();

