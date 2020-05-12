function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    if(cityName=="clustermap"){
        document.getElementById("console").style.display = "block";
    }
    else{
        document.getElementById("console").style.display = "none";
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  
    
   clustermap.resize();
   rmap.resize();
   
  

}
$(document).ready(function () {
    var features = [];
    $.ajax({
        type: "GET",
        url: "https://covid19.netigma.io/data/coronawho.json",
        dataType: "json",
        ContentType: "application/json",
        success: function (result) {
            
            features = result;
            renderFeatures(features);
           
        },
        error: function (e) {
            console.log(e);
        }
    }).then(() => {
        ncdocuments('Turkey');
    });
});
function ncdocuments(country) {
    var coronawho = [];
    $.ajax({
        type: "GET",
        url: "https://covid19.netigma.io/data/coronawho.json",
        dataType: "json",
        ContentType: "application/json",
        success: function (result) {
            coronawho = result;
        },
        error: function (e) {
            console.log(e);
        }
    }).then(() => {
        var dates = [];
        $.each(coronawho.Rows, function (i, o) {
            if (o.Cells[2].Value == country) {
                dates.push(o.Cells[7].Value);
            }
        })
        var max = dates.reduce(function (a, b) { return a > b ? a : b; });

        $.each(coronawho.Rows, function (i, o) {

            if (o.Cells[2].Value == country && o.Cells[7].Value == max) {
                document.getElementById("cases").innerHTML = o.Cells[5].Value + ' Total Case';
                document.getElementById("newcases").innerHTML = o.Cells[3].Value + ' New Case';
                document.getElementById("totaldeaths").innerHTML = o.Cells[6].Value + ' Total Dead';
                document.getElementById("newdeaths").innerHTML = o.Cells[4].Value + ' New Dead';
            }
        })
    }).then(() => {
        renderchart(coronawho, country)
    })
};
function renderchart(coronawho, country) {

    $('#myChart').remove();
    var chartcontainer = $("#casechart");
    var item = $("<canvas id='myChart'  width='350'  height=350'>")
    chartcontainer.append(item);

    $('#newdeathChart').remove();
    var deathcontainer = $("#deathchart");
    var deathitem = $("<canvas id='newdeathChart'  width='350'  height=350'>")
    deathcontainer.append(deathitem);

    var labels = [];
    var labelsdate = [];
    var datasets = [];
    var deathdatasets = [];
    var caseCN = [];
    var deathCN = [];
    $.each(coronawho.Rows, function (i, o) {
        if (o.Cells[2].Value == country) {
            labels.push(o.Cells[7].Value);
        }
    })
    $.each(labels, function (i, o) {
        var currentDate = new Date(labels[i]);
        var date = currentDate.getDate();
        var month = currentDate.getMonth(); //Be careful! January is 0 not 1
        var year = currentDate.getFullYear();
        labelsdate.push(date + "-" + (month + 1) + "-" + year);
    })

    if (country != "United States" && country != "Spain" && country != "Italy" && country != "United Kingdom") {
        $.each(coronawho.Rows, function (i, o) {
            $.each(labels, function (x, y) {
                if (o.Cells[2].Value == country && o.Cells[7].Value == labels[x]) {
                    caseCN.push(o.Cells[3].Value);
                    deathCN.push(o.Cells[4].Value);

                }
            })
        })
        datasets.push({ data: caseCN, label: country, borderColor: "#c45850", fill: false })
        deathdatasets.push({ data: deathCN, label: country, borderColor: "#c45850", fill: false })
    }
    caseUS = [];
    deathUS = [];
    $.each(coronawho.Rows, function (i, o) {
        $.each(labels, function (x, y) {
            if (o.Cells[2].Value == 'United States' && o.Cells[7].Value == labels[x]) {
                caseUS.push(o.Cells[3].Value);
                deathUS.push(o.Cells[4].Value);
            }
        })
    })
    datasets.push({ data: caseUS, label: "United States", borderColor: "#3e95cd", fill: false })
    deathdatasets.push({ data: deathUS, label: "United States", borderColor: "#3e95cd", fill: false })

    caseSP = [];
    deathSP = [];
    $.each(coronawho.Rows, function (i, o) {
        $.each(labels, function (x, y) {
            if (o.Cells[2].Value == 'Spain' && o.Cells[7].Value == labels[x]) {
                caseSP.push(o.Cells[3].Value)
                deathSP.push(o.Cells[4].Value);

            }
        })
    })
    datasets.push({ data: caseSP, label: "Spain", borderColor: "#8e5ea2", fill: false })
    deathdatasets.push({ data: deathSP, label: "Spain", borderColor: "#8e5ea2", fill: false })

    caseIT = [];
    deathIT = [];
    $.each(coronawho.Rows, function (i, o) {
        $.each(labels, function (x, y) {
            if (o.Cells[2].Value == 'Italy' && o.Cells[7].Value == labels[x]) {
                caseIT.push(o.Cells[3].Value)
                deathIT.push(o.Cells[4].Value)
            }
        })
    })
    datasets.push({ data: caseIT, label: "Italy", borderColor: "#3cba9f", fill: false })
    deathdatasets.push({ data: deathIT, label: "Italy", borderColor: "#3cba9f", fill: false })

    caseUK = [];
    deathUK = [];
    $.each(coronawho.Rows, function (i, o) {
        $.each(labels, function (x, y) {
            if (o.Cells[2].Value == 'United Kingdom' && o.Cells[7].Value == labels[x]) {
                caseUK.push(o.Cells[3].Value)
                deathUK.push(o.Cells[4].Value)
            }
        })
    })
    datasets.push({ data: caseUK, label: "United Kingdom", borderColor: "#e8c3b9", fill: false })
    deathdatasets.push({ data: deathUK, label: "United Kingdom", borderColor: "#e8c3b9", fill: false })

    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsdate,
            datasets: datasets
        },
        options: {
            title: {
                display: true,
                text: 'New Cases In The World'
            },
        }
    });

    var cty = document.getElementById('newdeathChart');
    var myDeathChart = new Chart(cty, {
        type: 'line',
        data: {
            labels: labelsdate,
            datasets: deathdatasets
        },
        options: {
            title: {
                display: true,
                text: 'New Deaths In The World'
            },
        }
    });
}
function renderFeatures(document) {
    //console.log(document.Rows);
    if (document == undefined || document == null) return;
   
    var listcontainer = $(".list-group");
    var countrylist = [];
    var countrylistitems=[[]];
    var countryname = [];
    var dates=[];
    var max;
    listcontainer.html("");
    $.each(document.Rows, function (x, y) {    
            dates.push(y.Cells[7].Value);
            if(document.Rows[x].Cells[2].Value!=document.Rows[document.Rows.length-1].Cells[2].Value) {
                if(document.Rows[ x ].Cells[2].Value!=document.Rows[x + 1].Cells[2].Value){
                    countrylist.push(document.Rows[x].Cells[2].Value);  
                }
            }
           
    })
   //console.log(countrylist);
    max = dates.reduce(function (a, b) { return a > b ? a : b; });
    $.each(document.Rows, function (i, o) {
        if(o.Cells[2].Value!=document.Rows[document.Rows.length-1].Cells[2].Value){
            if (o.Cells[7].Value== max) {   
                countrylistitems.push([o.Cells[2].Value,o.Cells[5].Value]);    
        }
        }  
    })
    countrylistitems.sort(function(a, b) {
        return (b[1] > a[1] ) ? 1 : (( b[1] < a[1]) ? -1 : 0);    
    });
    $.each(countrylistitems, function (i, o) {
                if(i!='0'){
                    var item = $("<button type='button'>").addClass("list-group-item list-group-item-action ");
                    item.html(o[0] + '     ' + o[1]);
                    listcontainer.append(item);
                    item.click({ document: o }, function (e) {
                        countryname = o[0];
                        ncdocuments(countryname);
                        countrygeojson(countrylist, document, countryname);
    
                    }); 
                }
              
    })
    countrygeojson(countrylist, document, 'turkey');
}
function countrygeojson(countrylist, document, countryname) {
    geojson = [[]];
    var dates = [];
    var centerlist = [];
    var max;
    let AsyncCounter = 0;
    $.each(countrylist, function (i, o) {
        $.each(document.Rows, function (x, y) {
            if (y.Cells[2].Value == countrylist[i]) {
                dates.push(y.Cells[7].Value);
            }
        })
        max = dates.reduce(function (a, b) { return a > b ? a : b; });
        if (countrylist[i] == 'Bonaire Sint Eustatius and Saba') {
            $.each(document.Rows, function (c, d) {
                if (d.Cells[2].Value == countrylist[i] && d.Cells[7].Value == max) {
                    geojson.push([countrylist[i], [12.1684, -68.3082], d.Cells[5].Value]);
                }
            })
        }
        else if (countrylist[i] == 'International') {
        
            $.each(document.Rows, function (c, d) {
                if (d.Cells[2].Value == countrylist[i] && d.Cells[7].Value == "2020-03-10T00:00:00+03:00") {
                    geojson.push([countrylist[i], [140.13236, 36.06979], d.Cells[5].Value]);

                }
            })

        }
        else if (countrylist[i] == 'Sint Maarten (Dutch part)') {
            $.each(document.Rows, function (c, d) {
                if (d.Cells[2].Value == countrylist[i] && d.Cells[7].Value == max) {
                    geojson.push([countrylist[i], [18.0347, -63.0681], d.Cells[5].Value]);

                }
            })
        }
        else if (countrylist[i] == 'Worldwide') {
            $.each(document.Rows, function (c, d) {
                if (d.Cells[2].Value == countrylist[i] && d.Cells[7].Value == max) {
                    geojson.push([countrylist[i], [22.34637686875675, -53.90656284130574], d.Cells[5].Value]);
                }
            })
        }
        else if (countrylist[i] != 'undefined') {
            $.ajax({
                type: "GET",
                url: "https://api.mapbox.com/geocoding/v5/mapbox.places/" + countrylist[i] + ".json?types=country&access_token=pk.eyJ1IjoiYmFyaXNlbHZuIiwiYSI6ImNrOG9jc2I2bTAwYXUzb3B0OGNzZ3Z6cWQifQ.f5fjA-rvOJ19p2aWkpUIcA",
                contentType: 'application/vnd.geo+json; charset=utf-8',
                success: function (result) {
                    centerlist.push(result.features[0].center);
                    $.each(document.Rows, function (c, d) {
                        if (d.Cells[2].Value == countrylist[i] && d.Cells[7].Value == max) {

                            geojson.push([countrylist[i], result.features[0].center, d.Cells[5].Value]);

                        }
                    })
                    if (AsyncCounter == countrylist.length-4) {
                        rendermap(countryname, geojson);
                    }
                    else {
                        AsyncCounter++;
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            })
        }
    })

}
var rmap;
function rendermap(country, geojsondata) {
    if (country == undefined || country == null) return;
    var countrycenter = [];
    var myGeoJSON = {};
    myGeoJSON.type = "FeatureCollection";
    myGeoJSON.features = [];


    $.ajax({
        type: "GET",
        url: "https://api.mapbox.com/geocoding/v5/mapbox.places/" + country + ".json?types=country&access_token=pk.eyJ1IjoiYmFyaXNlbHZuIiwiYSI6ImNrOG9jc2I2bTAwYXUzb3B0OGNzZ3Z6cWQifQ.f5fjA-rvOJ19p2aWkpUIcA",
        contentType: 'application/vnd.geo+json; charset=utf-8',
        success: function (result) {

            countrycenter = result.features[0].center;

        },
        error: function (e) {
            console.log(e);
        }
    }).then(() => {
        var zoom = 5.09;
        if (country == 'Worldwide') {
            countrycenter = [27.971133056494125, 38.09942991296842];
            zoom = 1;
        };
        if (country == 'Bonaire Sint Eustatius and Saba') {
            countrycenter = [12.1684, -68.3082];

        };
        if (country == 'International') {
            countrycenter = [140.13236, 36.06979];

        };
        if (country == 'Sint Maarten (Dutch part)') {
            countrycenter = [18.0347, -63.0681];

        };

        $.each(geojsondata, function (i, o) {
            if (geojsondata[i][2] <= 500) {

                myGeoJSON.features.push({ "type": "Feature", "properties": { "dbh": 5 }, "geometry": { "type": "Point", "coordinates": geojsondata[i][1] } });

            }
            else if (geojsondata[i][2] > 500 && geojsondata[i][2] <= 5000) {

                myGeoJSON.features.push({ "type": "Feature", "properties": { "dbh": 10 }, "geometry": { "type": "Point", "coordinates": geojsondata[i][1] } });

            }
            else if (geojsondata[i][2] > 5000 && geojsondata[i][2] <= 20000) {

                myGeoJSON.features.push({ "type": "Feature", "properties": { "dbh": 20 }, "geometry": { "type": "Point", "coordinates": geojsondata[i][1] } });

            }
            else if (geojsondata[i][2] > 20000 && geojsondata[i][2] <= 50000) {

                myGeoJSON.features.push({ "type": "Feature", "properties": { "dbh": 30 }, "geometry": { "type": "Point", "coordinates": geojsondata[i][1] } });

            }
            else if (geojsondata[i][2] > 50000 && geojsondata[i][2] <= 100000) {

                myGeoJSON.features.push({ "type": "Feature", "properties": { "dbh": 40 }, "geometry": { "type": "Point", "coordinates": geojsondata[i][1] } });

            }
            else if (geojsondata[i][2] > 100000 && geojsondata[i][2] <= 250000) {

                myGeoJSON.features.push({ "type": "Feature", "properties": { "dbh": 50 }, "geometry": { "type": "Point", "coordinates": geojsondata[i][1] } });

            }
            else if (geojsondata[i][2] > 250000) {

                myGeoJSON.features.push({ "type": "Feature", "properties": { "dbh": 60 }, "geometry": { "type": "Point", "coordinates": geojsondata[i][1] } });

            }

        })
        mapboxgl.accessToken = 'pk.eyJ1IjoiYmFyaXNlbHZuIiwiYSI6ImNrOG9jc2I2bTAwYXUzb3B0OGNzZ3Z6cWQifQ.f5fjA-rvOJ19p2aWkpUIcA';
        var map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [countrycenter[0], countrycenter[1]], // starting position
            zoom: zoom, // starting zoom

        });
        map.on('load', function () { 
            map.addSource('myGeoJSON', {
                type: 'geojson',
                data: myGeoJSON,
            });
            map.addLayer({
                id: 'myGeoJSON',
                type: 'heatmap',
                source: 'myGeoJSON',
                maxzoom: 15,

                paint: {
                    //  yükseklik arttıkça ağırlığı artırın
                    'heatmap-weight': {
                        property: 'dbh',
                        type: 'exponential',
                        stops: [
                            [1, 0],
                            [62, 2]
                        ]
                    },
                    // zoom seviyesi arttıkça yoğunluğu artırın
                    'heatmap-intensity': {
                        stops: [
                            [3, 1],
                            [15, 4]
                        ]
                    },
                    /* rgb(236, 8, 38)
                       rgb(247, 243, 243)
                     rgb(71, 123, 158)*/
                    // yoğunluklara bağlı olarak noktalara renk değerleri atama
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0, 'rgba(236,222,239,0)',
                        0.2, 'rgb(71, 123, 158)',
                        0.4, 'rgb(247, 243, 243)',
                        0.6, 'rgb(103,169,207)',
                        0.8, 'rgb(236, 8, 38)',

                    ],
                    // zoom arttıkça yarıçapı artır

                    'heatmap-radius': {
                        stops: [
                            [3, 50],
                            [12, 20]
                        ]
                    },
                    // decrease opacity to transition into the circle layer
                    'heatmap-opacity': {
                        default: 1,
                        stops: [
                            [14, 1],
                            [15, 0]
                        ]
                    },
                }
            }, 'waterway-label');
            map.addLayer({
                id: 'myGeoJSON-point',
                type: 'circle',
                source: 'myGeoJSON',
                minzoom: 20,
                paint: {
                    // increase the radius of the circle as the zoom level and dbh value increases
                    'circle-radius': {
                        property: 'dbh',
                        type: 'exponential',
                        stops: [
                            [{ zoom: 5, value: 1 }, 5],
                            [{ zoom: 5, value: 62 }, 10],
                            [{ zoom: 22, value: 1 }, 20],
                            [{ zoom: 22, value: 62 }, 30],
                        ]
                    },
                    /* rgb(236, 8, 38)
                       rgb(247, 243, 243)
                     rgb(71, 123, 158)*/
                    'circle-color': {
                        property: 'dbh',
                        type: 'exponential',
                        stops: [
                            [0, 'rgba(236,222,239,0)'],
                            [10, 'rgb(236,222,239)'],
                            [20, 'rgb(208,209,230)'],
                            [30, 'rgb(166,189,219)'],
                            [40, 'rgb(103,169,207)'],
                            [50, 'rgb(28,144,153)'],
                            [60, 'rgb(236, 8, 38)']
                        ]
                    },
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 10,
                    'circle-opacity': {
                        stops: [
                            [5, 0],
                            [10, 1]
                        ]
                    }
                }
            }, 'waterway-label');

            map.on('click', 'myGeoJSON-point', function (e) {
                new mapboxgl.Popup()
                    .setLngLat(e.features[0].geometry.coordinates)
                    .setHTML('<b>DBH:</b> ' + e.features[0].properties.dbh)
                    .addTo(map);
            });
          
        });
        rmap=map;

        var coordinates = document.getElementById('coordinates');
        map.addControl(new mapboxgl.NavigationControl());

        renderclustermap(country, myGeoJSON);

    });


}
var colors = [' #66ff66', '#006600', '#4db8ff', '#4747d1', '#bf00ff', '#ff5c33', '#ff0000'];
var clustermap;
function renderclustermap(country, myGeoJSON) {
    if (country == undefined || country == null) return;
    var countrycenter = [];

    $.ajax({
        type: "GET",
        url: "https://api.mapbox.com/geocoding/v5/mapbox.places/" + country + ".json?types=country&access_token=pk.eyJ1IjoiYmFyaXNlbHZuIiwiYSI6ImNrOG9jc2I2bTAwYXUzb3B0OGNzZ3Z6cWQifQ.f5fjA-rvOJ19p2aWkpUIcA",
        contentType: 'application/vnd.geo+json; charset=utf-8',
        success: function (result) {

            countrycenter = result.features[0].center;

        },
        error: function (e) {
            console.log(e);
        }
    }).then(() => {
        var zoom = 5.09;
        if (country == 'Worldwide') {
            countrycenter = [27.971133056494125, 38.09942991296842];
            zoom = 1;
        };
        if (country == 'Bonaire Sint Eustatius and Saba') {
            countrycenter = [12.1684, -68.3082];

        };
        if (country == 'International') {
            countrycenter = [140.13236, 36.06979];

        };
        if (country == 'Sint Maarten (Dutch part)') {
            countrycenter = [18.0347, -63.0681];

        };

        mapboxgl.accessToken = 'pk.eyJ1IjoiYmFyaXNlbHZuIiwiYSI6ImNrOG9jc2I2bTAwYXUzb3B0OGNzZ3Z6cWQifQ.f5fjA-rvOJ19p2aWkpUIcA';
        var map = new mapboxgl.Map({
            container: 'clustermap', // container id
            style: 'mapbox://styles/lobenichou/cjto9zfpj00jq1fs7gajbuaas?fresh=true',
            center: [countrycenter[0], countrycenter[1]], // starting position
            zoom: zoom, // starting zoom
        });
        map.addControl(new mapboxgl.NavigationControl());

        var dbh0 = ['<=', ['get', 'dbh'], 5];
        var dbh1 = ['all', ['>', ['get', 'dbh'], 5], ['<=', ['get', 'dbh'], 10]];
        var dbh2 = ['all', ['>', ['get', 'dbh'], 10], ['<=', ['get', 'dbh'], 20]];
        var dbh3 = ['all', ['>', ['get', 'dbh'], 20], ['<=', ['get', 'dbh'], 30]];
        var dbh4 = ['all', ['>', ['get', 'dbh'], 30], ['<=', ['get', 'dbh'], 40]];
        var dbh5 = ['all', ['>', ['get', 'dbh'], 40], ['<=', ['get', 'dbh'], 50]];
        var dbh6 = ['all', ['>', ['get', 'dbh'], 50], ['<=', ['get', 'dbh'], 62]];


        var colorScale = d3.scaleOrdinal()
            .domain(["dbh0", "dbh1", "dbh2", "dbh3", "dbh4", "dbh5", "dbh6"])
            .range(colors)

        // colors to use for the categories

        
        map.on('load', function () {
           
            map.addSource('myGeoJSON', {
                'type': 'geojson',
                'data': myGeoJSON,
                'cluster': true,
                'clusterRadius': 80,
                'clusterProperties': {
                    // keep separate counts for each magnitude category in a cluster
                    'dbh0': ['+', ['case', dbh0, 5, 0]],
                    'dbh1': ['+', ['case', dbh1, 10, 0]],
                    'dbh2': ['+', ['case', dbh2, 20, 0]],
                    'dbh3': ['+', ['case', dbh3, 30, 0]],
                    'dbh4': ['+', ['case', dbh4, 40, 0]],
                    'dbh5': ['+', ['case', dbh5, 50, 0]],
                    'dbh6': ['+', ['case', dbh6, 60, 0]]
                }
            });

            map.addLayer({
                'id': 'myGeoJSON_individual_outer',
                'type': 'circle',
                'source': 'myGeoJSON',
                'filter': ['!=', ['get', 'cluster'], true],
                'paint': {
                    'circle-stroke-color': ['case',
                        dbh0, colorScale('dbh0'),
                        dbh1, colorScale('dbh1'),
                        dbh2, colorScale('dbh2'),
                        dbh3, colorScale('dbh3'),
                        dbh4, colorScale('dbh4'),
                        dbh5, colorScale('dbh5'),
                        dbh6, colorScale('dbh6'), '#ffed6f'],
                    'circle-stroke-width': 3,
                    'circle-radius': 20,
                    'circle-color': "rgba(0, 0, 0, 0)"
                }
            });



            map.addLayer({
                'id': 'myGeoJSON_label',
                'type': 'symbol',
                'source': 'myGeoJSON',
                'filter': ['!=', 'cluster', true],
                'layout': {
                    'text-field': [
                        'number-format',
                        ['get', 'dbh'],
                        { 'min-fraction-digits': 0, 'max-fraction-digits': 0 }
                    ],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-size': 10
                },
                'paint': {
                    'text-color': [
                        'case',
                        ['<', ['get', 'dbh'], 62],
                        'white',
                        'white'
                    ]
                }
            });
            var markers = {};
            var markersOnScreen = {};

            function updateMarkers() {
                var newMarkers = {};
                var features = map.querySourceFeatures('myGeoJSON');


                // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
                // and add it to the map if it's not there already
                for (var i = 0; i < features.length; i++) {
                    var coords = features[i].geometry.coordinates;
                    var props = features[i].properties;

                    if (!props.cluster) continue;
                    var id = props.cluster_id;

                    var marker = markers[id];
                    if (!marker) {

                        var el = createDonutChart(props);

                        marker = markers[id] = new mapboxgl.Marker({
                            element: el
                        }).setLngLat(coords);
                    }
                    newMarkers[id] = marker;

                    if (!markersOnScreen[id]) marker.addTo(map);

                }
                // for every marker we've added previously, remove those that are no longer visible
                for (id in markersOnScreen) {
                    if (!newMarkers[id]) markersOnScreen[id].remove();
                }
                markersOnScreen = newMarkers;
            }
            map.on('data', function (e) {
                if (e.sourceId !== 'myGeoJSON' || !e.isSourceLoaded) return;

                map.on('move', updateMarkers);
                map.on('moveend', updateMarkers);
                updateMarkers();
            });
          
        });
        clustermap=map;
    });
    function createDonutChart(props) {
        var totalx = 0;


        // console.log(o.properties);


        var offsets = [];
        var counts = [
            props.dbh0,
            props.dbh1,
            props.dbh2,
            props.dbh3,
            props.dbh4,
            props.dbh5,
            props.dbh6
        ];


        var total = 0;
        for (var i = 0; i < counts.length; i++) {
            offsets.push(total);
            total += counts[i];
            //if(counts[i]==)

        }
        
        var fontSize =
            total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
        var r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
        var r0 = Math.round(r * 0.85);
        var w = r * 2;

        var html =
            '<div><svg width="' +
            w +
            '" height="' +
            w +
            '" viewbox="0 0 ' +
            w +
            ' ' +
            w +
            '" text-anchor="middle" style="font: ' +
            fontSize +
            'px sans-serif;">';

        for (i = 0; i < counts.length; i++) {
            html += donutSegment(
                offsets[i] / total,
                (offsets[i] + counts[i]) / total,
                r,
                r0,
                colors[i]
            );
        }
        html +=
            '<circle cx="' +
            r +
            '" cy="' +
            r +
            '" r="' +
            r0 +
            '" fill="rgba(0, 0, 0, 0.7)" /><text dominant-baseline="central" transform="translate(' +
            r +
            ', ' +
            r +
            ')"fill="white">' +
            total.toLocaleString() +
            '</text></svg></div>';

        var el = document.createElement('div');
        el.innerHTML = html;
        return el.firstChild;
    }
    function donutSegment(start, end, r, r0, color) {
        if (end - start === 1) end -= 0.00001;
        var a0 = 2 * Math.PI * (start - 0.25);
        var a1 = 2 * Math.PI * (end - 0.25);
        var x0 = Math.cos(a0),
            y0 = Math.sin(a0);
        var x1 = Math.cos(a1),
            y1 = Math.sin(a1);
        var largeArc = end - start > 0.5 ? 1 : 0;

        return [
            '<path d="M',
            r + r0 * x0,
            r + r0 * y0,
            'L',
            r + r * x0,
            r + r * y0,
            'A',
            r,
            r,
            0,
            largeArc,
            1,
            r + r * x1,
            r + r * y1,
            'L',
            r + r0 * x1,
            r + r0 * y1,
            'A',
            r0,
            r0,
            0,
            largeArc,
            0,
            r + r0 * x0,
            r + r0 * y0,
            '" fill="' + color + '" />'
        ].join(' ');
    }


}
