var csv2geojson = require('csv2geojson'),
    fs = require('fs');

// read file as string
fs.readFile('project-files/Christmas_Snow_Statistics_2016.csv', 'utf-8', (err, csvString) => {

    if (err) throw err;

    // console.log(csvString) // really long string

    // convert to GeoJSON
    csv2geojson.csv2geojson(csvString, {
        latfield: 'Lat',
        lonfield: 'Lon',
        delimiter: ','
    }, (err, geojson) => {

        if (err) throw err;

        var appendGeoJSON = filterFields(geojson);
        // console.log(appendGeoJSON); // this is our geojson!

        // write file
        fs.writeFile('data/xmas_snow_stats_point_data_PLUS.json', JSON.stringify(appendGeoJSON), 'utf-8', (err) => {

            if (err) throw err;

            // console.log('done writing file');
        });
    })
});

function filterFields(geojson) {
    // shorthand to our features
    var features = geojson.features,
        newFeatures = []; // empty array for new features

    // loop through all the features
    features.forEach((feature) => {

        // on each loop, create an empty object to hole a new feature - Rank
        tempProp_Rank = {};
        // on each loop, create an empty object to hold the converted Probability 
        var tempProps_Prob_Snow = {};

        // loop through each of the properties for features names that contain text with %
        // convert each field to decimal number
        for (var prop in feature.properties) {
            // if it's a match 
            if (prop === 'Probability_of_Snow_Depth_GT_0' || prop === 'Probability_of_Snowfall_GT_0'){
                // create the prop/value
                tempProps_Prob_Snow[prop] = (parseInt(feature.properties[prop]))/100;
                if (prop === 'Probability_of_Snow_Depth_GT_0') {
                //     if (tempProps_Prob_Snow[prop] >= 0)
                    // tempProps_Prob_Snow[prop] = tempProps_Prob_Snow[prop] + ',/"Probability_of_Snow_Depth_Rank/":10';
                    // console.log(tempProps_Prob_Snow[prop] + ',"Probability_of_Snow_Depth_Rank":10');
                    console.log(tempProps_Prob_Snow[prop]);
                }
            }
            else 
                // pass the other prop values
                tempProps_Prob_Snow[prop] = feature.properties[prop];



        } // end for loop feature.properties

        // now push a new feature to the newFeatures array
        // we will use the existing feature type and geometry,
        // but we can use our new properties as the "properties" value
        newFeatures.push({
            "type": feature.type,
            "geometry": feature.geometry,
            "properties": tempProps_Prob_Snow
        }); 
        // newFeatures.push({
        //     "type": feature.type,
        //     "geometry": feature.geometry,
        // //     "properties": tempProp_Rank
        //     ",": tempProp_Rank
        // });
    });
    // finally, return a GeoJSON object FeatureCollection,
    // using the new features as the "features" value
    return {
        "type": "FeatureCollection",
        "features": newFeatures
    }
}