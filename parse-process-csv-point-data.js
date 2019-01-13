var csv2geojson = require('csv2geojson'),
    fs = require('fs'),
    path = require('path');

// read file as string
fs.readFile(path.join(__dirname, '/project-files/') + 'Christmas_Snow_Statistics_2016.csv', 'utf-8', (err, csvString) => {

    if (err) throw err;

    //console.log(csvString) // really long string

    // convert to GeoJSON
    csv2geojson.csv2geojson(csvString, {
        latfield: 'Lat',
        lonfield: 'Lon',
        delimiter: ','
    }, (err, geojson) => {

        if (err) throw err;

        var appendGeoJSON = formatFields(geojson);
        // console.log(appendGeoJSON); // this is our geojson!

        // write file
        fs.writeFile(path.join(__dirname, '/data/') + 'xmas_snow_stats_point_data.json', JSON.stringify(appendGeoJSON), 'utf-8', (err) => {

            if (err) throw err;

            // console.log('done writing file');
        });
    })
});

function formatFields(geojson) {
    // states to exclude ['VI', 'UM', 'PW', 'PR', 'MP', 'MH', 'HI', 'GU', 'FM', 'AS', 'AK'];
    // shorthand to our features
    var features = geojson.features,
        newFeatures = []; // empty array for new features
    // loop through all the features
    features.forEach((feature) => {
        // on each loop, create an empty object
        var tempProps = {};
        // loop through each of the properties for features names that contain text with %
        // convert each field to decimal number
        for (var prop in feature.properties) {
            // change elevation from text field to integer
            if (prop === 'Elev')
                tempProps[prop] = parseFloat(feature.properties[prop]);
            // if it's a match on either probability field
            else if (prop === 'Probability_of_Snow_Depth_GT_0' || prop === 'Probability_of_Snowfall_GT_0') {

                if (feature.properties[prop] === '-9999' || feature.properties[prop] === '-6666' || feature.properties[prop] === '-5555')
                    tempProps[prop] = 0;
                else
                    tempProps[prop] = (parseInt(feature.properties[prop])) / 100;
                // if it's a match on either median field
            } else if (prop === 'Median_of_Snow_Depth_GT_0_inches' || prop === 'Median_of_Snowfall_GT_0_inches') {
                if (feature.properties[prop] === '-9999' || feature.properties[prop] === '-6666' || feature.properties[prop] === '-5555')
                    tempProps[prop] = 0;
                else
                    tempProps[prop] = parseInt(feature.properties[prop]);
                // populate the array with other property fields
            } else
                // pass the other prop values
                tempProps[prop] = feature.properties[prop];
        }
        var zone = 0;
        // Calculate the zone based on probablility of snow
        if (tempProps.Probability_of_Snow_Depth_GT_0 > .89)
            zone = 7;
        else if (tempProps.Probability_of_Snow_Depth_GT_0 > .74)
            zone = 6;
        else if (tempProps.Probability_of_Snow_Depth_GT_0 > .49)
            zone = 5;
        else if (tempProps.Probability_of_Snow_Depth_GT_0 > .29)
            zone = 4;
        else if (tempProps.Probability_of_Snow_Depth_GT_0 > .19)
            zone = 3;
        else if (tempProps.Probability_of_Snow_Depth_GT_0 > .04)
            zone = 2;
        else if (tempProps.Probability_of_Snow_Depth_GT_0 > 0)
            zone = 1;
        // Add the property zone
        tempProps.Zone = zone;
        // now push a new feature to the newFeatures array
        // we will use the existing feature type and geometry,
        // but we can use our new properties as the "properties" value
        // only include zones > 0
        if (tempProps.Zone > 0 && tempProps.Median_of_Snow_Depth_GT_0_inches > 0 && tempProps.State != 'AK') {
            newFeatures.push({
                "type": feature.type,
                "geometry": feature.geometry,
                "properties": tempProps
            });
            console.log(tempProps);
        }
    });  // features loop
    // finally, return a GeoJSON object FeatureCollection,
    // using the new features as the "features" value
    return {
        "type": "FeatureCollection",
        "features": newFeatures
    }
}
