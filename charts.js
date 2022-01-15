function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    // buildBubble(firstSample)
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  // buildBubble(newSample)
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    Object.entries(result).forEach(([key, value]) => {
      d3.select('#sample-metadata');
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// // 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    console.log(samplesArray);

    var samplesMeta = data.metadata;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samplesArray.filter(sampleObj => sampleObj.id == sample);
    console.log(filteredSamples);

    // Building metadata samples 
    var filteredMeta = samplesMeta.filter(sampleObj => sampleObj.id == sample);
    console.log(filteredMeta);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filteredSamples[0];
    console.log(firstSample);

    // Metadata first sample 
    var firstMeta = filteredMeta[0];
    console.log(firstMeta);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    console.log('otuIDs',otuIds);

    var otuLabels = firstSample.otu_labels;
    console.log("otuLabels", otuLabels);

    var sampleValues = firstSample.sample_values;
    console.log(sampleValues);

    var metaFrequency = parseFloat(firstMeta.wfreq);

    // 7. Create the yticks for the bar chart.
    var newyOrder = otuIds.reverse();
    var yticks = newyOrder.slice(0,10).map(x => "OTU" + x);
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var traceBar = {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      type: 'bar',
      orientation: 'h',
      text: otuLabels.reverse(),
      hoverinfo: yticks,
      marker: {
        color: 'blue',
        opacity: 0.5, 
        line: {
          color:'blue',
          width: 3
        }
      }
    };
    var barData = [traceBar];
  Plotly.newPlot('bar', barData);
// 9. Create the layout for the bar chart. 
    var barLayout = {
      
       title: 'Top 10 Bacteria Cultures Found',
      //  margin: {t:30,l:100}
      };

 // 10. Use Plotly to plot the data with the layout. 
Plotly.newPlot('bar', barData, barLayout);

var traceBubble = {
  x: otuIds,
  y: sampleValues, 
  mode: 'markers',
  text: otuLabels,
  marker: {
    color: otuIds, 
    size: sampleValues,
  }
};

var bubbleData = [traceBubble];

// 2. Create the layout for the bubble chart.
var bubbleLayout = {
  title: 'Bacteria Cultures Per Sample',
  xaxis: {title: 'OTU ID'},
  hovermode: "closest",

};

// 3. Use Plotly to plot the data with the layout.
Plotly.newPlot('bubble', bubbleData, bubbleLayout); 

// Deliverable 3 Gauge Chart 
var traceG= {
  domain: {
    x:[0,1],
    y: [0,1]
  },
  value: metaFrequency,
  title: {text: "</br> Belly Button Washing Frequency </br> Scrubs per Week"},
  type: 'indicator',
  mode: 'gauge+number',
  gauge: {
    bar: {color: 'black'},
    axis: {range:[null,10]},
    steps: [
      {range: [0, 2], color: 'red'},
      {range: [2, 4], color: 'orange'},
      {range: [4, 6], color: 'yellow'},
      {range: [6, 8], color: 'lightgreen'},
      {range: [8,10], color: 'green'},
    ]
  }
};

var gaugeData = [traceG];

// 2. Create the layout for the bubble chart.
var gLayout = {
  xaxis: {title: 'OTU ID'},
  hovermode: "closest",
};

Plotly.newPlot('gauge', gaugeData, gLayout); 
});
};


