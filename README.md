# The probability of a White Christmas as shown in heatmap using Mapbox GL JS
This project uses aggregated data from the National Centers for Environmental Information that depicts the historical probability of there being 1 inch of snow or more on the ground on a Christmas Day in the continental United States. The data is based on the [1981-2010 Climate Normals](https://www.ncdc.noaa.gov/data-access/land-based-station-data/land-based-datasets/climate-normals/1981-2010-normals-data) which is the latest three-decade averages of several climatological measurements. The data was compiled by Imke Durre and Michael F. Squires and published in the Bulletin of the American Meteorological Society in December 2015.  The data scientists work is entitled, [White Christmas? An application of NOAA's 1981-2010 Daily Normals](http://journals.ametsoc.org/doi/abs/10.1175/BAMS-D-15-00038.1).

The map represented in the project is not intended to predict a White Christmas on December 25th.  It is intended to show areas with the highest probability of snow cover based on the historical data.

Data source: https://www.ncdc.noaa.gov/sites/default/files/attachments/Christmas_Snow_Statistics_2016.xlsx


### Data Wrangling
CSV file - Rename header info to replace '>' with GT and spaces with '_'

In the original csv file 2 records with GHCN_ID's equal to USC00195984 & USW00013904 have missing lat/lon, elevation, state, and station name fields. Corrected the records with data from: https://geographic.org/global_weather/massachusetts/norton_west_984.html & https://geographic.org/global_weather/texas/austin_bergstrom_ap_904.html.

Data is converted to json from csv and processed using Node.js.  The node.js script, parse-process-csv-point-data.js, converts the csv to json, changes the probability fields from text to decimal number, removes all negative values and replaces them with 0.
