
// define constant of url so I don't have to keep typing the whole thing out
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// console log data to check that it loaded in

d3.json(url).then(function(data){

    // make sure the data is able to import
    console.log(data);


})
.catch(function(error) {
    // Handle any errors that occurred during the fetch
    console.error('Error loading JSON:', error);
  });

// execute the function

init();



/////////////////////////////////////////////////////////////////
// FUNCTIONS
/////////////////////////////////////////////////////////////////

// declare initialized view, ie) default view


function init(){

    // initialize the drop down
    let dropdownMenu = d3.select("#selDataset");

    d3.json(url).then(function(data){

        // access samples property.. this can be done by doing data.property that I am trying to access.. this only works because there are actual parent directories
        let sampleNames = data.names;
 
        // bind sampleNames array to dropdown menu to create an option for each
        dropdownMenu
            .selectAll('option')
            .data(sampleNames) // the data
            .enter() // a way to talk about all data points that don't have element yet
            .append('option') // append a new element for each of my data points.. option itself is a type i.e.) <option value="example"><Example></option>
            .text(function(d){
                return d;
            });

    

        // .property is used to get the selected value from the dropdown
        
        let selectedValue = dropdownMenu.property('value'); // this returns the value of the dropdownMenu

        hbarChart(sampleNames[0]); // show a defaulted plot

        optionChanged(selectedValue); // execute any options that are changed
    

    });


};


// optionChanged function is refereced in the html.. so I'll use this name instead since it was given to me in starter code
function optionChanged(selectedSample){

    // print statement to show it is collecting correct data
    console.log('Selected Value:', selectedSample);
    // update chart here
    hbarChart(selectedSample);
    metadataChart(selectedSample);
    bubbleChart(selectedSample);


};



// create hbarchart function

function hbarChart(selectedSample){

    d3.json(url).then(function(data){

        let selSampleData = data.samples.filter(selSamp => selSamp.id == selectedSample);

        // get the OTUids, vals, and labels from the data
        let selOtuID = selSampleData.map(otuid => otuid.otu_ids);
        let selOtuVals = selSampleData.map(otuval => otuval.sample_values);
        let selLabels = selSampleData.map(otulabels => otulabels.otu_labels);


        // filter first 10 OTU IDs
        let firstTenOtuID= selOtuID[0].slice(0,10);
        let firstTenOtuVals = selOtuVals[0].slice(0,10);
        let firstTenLabels = selLabels[0].slice(0,10);

        // create bar graph trace
        let barTrace = [{
            x: firstTenOtuVals.reverse(),
            // this creates a new array of the original values + OTU... i.e.) ['OTU 1167', 'OTU 2859' etc.] this array will then match the x values
            // otherwise, this will only create a horizontal bar chart that matches ints with ints.. not string(labels) with ints
            y: firstTenOtuID.map(otu_id => 'OTU' + otu_id).reverse(),
            text: firstTenLabels.reverse(),
            type: 'bar',
            orientation: 'h'

        }];


        let layout = {
            title:"",
            xaxis: {title: 'Sample Values'},
            yaxis: {title: 'OTU ID'}
        };

        Plotly.newPlot('bar', barTrace, layout);


    });


};

// create the metadata chart

function metadataChart(selectedSample){


    d3.json(url).then(function(data){

        let metadata = data.metadata.filter(id => id.id == selectedSample)[0];

        // access id = sample-metadata
        let panel = d3.select('#sample-metadata');
        panel.html(''); // clears existing content

        // this is the same as "for key,val in metadata.items():" in python
        for ([key, val] of Object.entries(metadata)){
        panel.append('h6')
        .text(`${key}: ${val}`)

        }

    });


};

// create the bubble chart

function bubbleChart(selectedSample){

    d3.json(url).then(function(data){

        let selSampleData = data.samples.filter(selSamp => selSamp.id == selectedSample);

        // get the OTUids, vals, and labels from the data
        let selOtuID = selSampleData.map(otuid => otuid.otu_ids)[0];
        let selOtuVals = selSampleData.map(otuval => otuval.sample_values)[0];
        let selLabels = selSampleData.map(otulabels => otulabels.otu_labels)[0];


        let bubbleTrace = [{
            x: selOtuID,
            y: selOtuVals,
            text: selLabels,
            mode: 'markers',
            marker : {
                size: selOtuVals,
                color: selOtuID,
                colorscale: 'Earth'
            }

        }];

        let bubbleLayout = {
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Sample Values'}
 
        };

        Plotly.newPlot('bubble', bubbleTrace, bubbleLayout);


    });


};


