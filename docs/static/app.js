// url variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// function for demo info
function populateDemographic(id) {
    d3.json(url).then(function(item) {

        // store metadata
        let metadata = item.metadata;

        // id filter from selection
        value = metadata.filter(item => item.id == id);
        let valueData = value[0];

        // select panel
        let panel = d3.select("#sample-metadata");
        panel.html("");

        // populate panel
        Object.entries(valueData).forEach(([key, value]) => {
            panel.append('div').text(`${key}: ${value}`);
        })
    })
}

// function for chart creation
function createAllCharts(id) {

    // read in json data, filter on ID
    d3.json(url).then(function(data) {
        let samples = data.samples;
        let filterArray = samples.filter(item => item.id == id);
        let valueData = filterArray[0];
        
        // store data in vars
        let ids = valueData.otu_ids;
        let labels = valueData.otu_labels;
        let values = valueData.sample_values;
        
        // bar chart
        let xValues = values.slice(0,10).reverse();
        let yValues = ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
        let textLabels = labels.slice(0,10).reverse();

        let barData = {
            x: xValues,
            y: yValues,
            text: textLabels,
            type: "bar",
            orientation: "h"
        };

        let barLayout = {
            autosize: false,
            width: 500,
            height: 780,
            margin: {
            l: 75,
            r: 50,
            b: 200,
            t: 10,
            pad: 4
            },
            barmode: 'group'
        };

        Plotly.newPlot("bar", [barData], barLayout);

        // bubble chart
        let bubbleData = {
            x: ids,
            y: values,
            text: labels,
            mode: 'markers',
            marker: {
                color: ids,
                size: values
            }
        }

        let bubbleLayout = {
            autosize: false,
            width: 1200,
            height: 500,
            margin: {
              l: 50,
              r: 50,
              b: 100,
              t: 30,
              pad: 4
            },
            showlegend: false,
        };

        Plotly.newPlot("bubble", [bubbleData], bubbleLayout);
    })
}

// initialize charts
function init() {

    // populate dropdown
    d3.json(url).then(function(data){
        let names = data.names;
        for (let i = 0; i < names.length; i++) {
            d3.select("#selDataset").append("option").text(names[i]).property("value", names[i])
        }

    // populate initial charts
        let initialID = names[0];
        createAllCharts(initialID);
        populateDemographic(initialID)
    })
}

// create dropdown function
function optionChanged(id){
    createAllCharts(id);
    populateDemographic(id);
    buildGauge(id);
};

init();