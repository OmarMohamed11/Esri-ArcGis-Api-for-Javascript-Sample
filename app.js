var serverReq
var serverReq1
var DDL_state_Id = document.getElementById("stateId");
var County_NAME = document.getElementById("CountyName");
var Continent_NAME = document.getElementById("ContinentName");
var menuBtn1 = document.getElementById("btn1");
var menuBtn2 = document.getElementById("btn2");
google.charts.load("current", {packages:['corechart']});
google.charts.load("current", { packages: ["bar"] });


require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/Home",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/widgets/Sketch",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/request",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "dojo/domReady!"], function (Map, MapView, Home, FeatureLayer, Legend, Sketch, GraphicsLayer,Graphic, request, QueryTask,Query) {

        var popup = {
            title: `County Name : {name}`,
            content: `<h2 style="color:#972d23">pop = {pop_est} Capita</h2>`
        }

        var graphicLayer = new GraphicsLayer();

        var layerUrl = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Countries_Natural_Earth_1_50M/FeatureServer/0/query"

        //#region 
        // var less5000 = {
        //     type: "simple-fill",  // autocasts as new SimpleFillSymbol()
        //     color: "#f8d7d4",
        //     style: "solid",
        //     outline: {
        //         width: 0,
        //         color: [255, 255, 255, 0.5]
        //     }
        // };

        // var less50000 = {
        //     type: "simple-fill",  // autocasts as new SimpleFillSymbol()
        //     color: "#e79b94",
        //     style: "solid",
        //     outline: {
        //         width: 0,
        //         color: [255, 255, 255, 0.5]
        //     }
        // };

        // var less500000 = {
        //     type: "simple-fill",  // autocasts as new SimpleFillSymbol()
        //     color: "#d3746b",
        //     style: "solid",
        //     outline: {
        //         width: 0,
        //         color: [255, 255, 255, 0.5]
        //     }
        // };

        // var less5000000 = {
        //     type: "simple-fill",  // autocasts as new SimpleFillSymbol()
        //     color: "#be5046",
        //     style: "solid",
        //     outline: {
        //         width: 0,
        //         color: [255, 255, 255, 0.5]
        //     }
        // };

        // var less50000000 = {
        //     type: "simple-fill",  // autocasts as new SimpleFillSymbol()
        //     color: "#972d23",
        //     style: "solid",
        //     outline: {
        //         width: 0,
        //         color: [255, 255, 255, 0.5]
        //     }
        // };

        // var render = {
        //     type: "class-breaks",  // autocasts as new ClassBreaksRenderer()
        //     field: "AWATER",
        //     classBreakInfos: [{
        //         minValue: 0,
        //         maxValue: 5000,
        //         symbol: less5000,
        //         label: "< 20%"  // label for symbol in legend
        //     }, {
        //         minValue: 5001,
        //         maxValue: 30000,
        //         symbol: less50000,
        //         label: "20 - 40%"  // label for symbol in legend
        //     }, {
        //         minValue: 30001,
        //         maxValue: 100000,
        //         symbol: less500000,
        //         label: "40 - 60%"  // label for symbol in legend
        //     }, {
        //         minValue: 100001,
        //         maxValue: 6000000,
        //         symbol: less5000000,
        //         label: "60 - 80%"  // label for symbol in legend
        //     }, {
        //         minValue: 6000001,
        //         maxValue: 55000000,
        //         symbol: less5000000,
        //         label: "> 80%"  // label for symbol in legend
        //     }]
        // };

        //#endregion


        var country = new FeatureLayer({
            url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Countries_Natural_Earth_1_50M/FeatureServer/0",
            popupTemplate: popup
            // renderer: render
        })

        var city = new FeatureLayer({
            url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/World_Countries_Cities/FeatureServer/1",
            // renderer: render
        })

        var map = new Map({
            basemap: 'streets-night-vector',
            layers: [country, city] 
        });

        var view = new MapView({
            map: map,
            container: "map",
            zoom: 2,
            center: [0, 0]
        });

        var home = new Home({
            view: view
        })

        view.ui.add(home, {
            position: "top-right"
        })

        //#region 
        


        // var legend = new Legend({
        //     view: view,
        //     layerInfos: [{
        //         layer: country,
        //         title: "Water usage per country"
        //     }]
        // })
        // view.ui.add(legend, {
        //     position: "bottom-left"
        // })

        //#endregion


        // console.log(view.spatialReference);

        var layerUrl = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Countries_Natural_Earth_1_50M/FeatureServer/0/query"

        var layerUrl1 =  "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/World_Countries_Cities/FeatureServer/1/query"

        var reqOption = {
            responseType: "json",
            query: {
                where: "1=1",
                f: "json",
                outFields: "FID,name,pop_est,continent,economy,gdp_md_est "
            }
        }

        var reqOption1 = {
            responseType: "json",
            query: {
                where: "1=1",
                f: "json",
                outFields: "OBJECTID ,CITY_NAME,POP,CNTRY_NAME"
            }
        }

        request(layerUrl, reqOption).then(res => {
            console.log(res.data.features)
            serverReq = res.data;
// debugger;

            let continent_name = [];
            let country_name = [];

            for (let i = 0; i < res.data.features.length; i++) {
                if (!country_name.includes(res.data.features[i].attributes.name)) {
                    country_name.push(res.data.features[i].attributes.name)

                    let opt = document.createElement('option');
                    opt.textContent = res.data.features[i].attributes.name;
                    opt.value = res.data.features[i].attributes.name;
                    DDL_state_Id.appendChild(opt);
                }

                if (!continent_name.includes(res.data.features[i].attributes.continent)) {
                    continent_name.push(res.data.features[i].attributes.continent)

                    let opt = document.createElement('option');
                    opt.textContent = res.data.features[i].attributes.continent;
                    opt.value = res.data.features[i].attributes.continent;
                    Continent_NAME.appendChild(opt);
                }
            }

        })

        request(layerUrl1, reqOption1).then(res => {
            // console.log(res)
            serverReq1 = res.data;

            let city_name = []

            for (let i = 0; i < res.data.features.length; i++) {
                if (!city_name.includes(res.data.features[i].attributes.CITY_NAME)) {
                    city_name.push(res.data.features[i].attributes.CITY_NAME)

                    let opt = document.createElement('option');
                    opt.textContent = res.data.features[i].attributes.CITY_NAME;
                    opt.value = res.data.features[i].attributes.CITY_NAME;
                    County_NAME.appendChild(opt);
                }
            }
            


        })
        
        Continent_NAME.addEventListener("change", function () {
            drawChart1(this.value);
            drawChart2(this.value);
            drawChart3(this.value);

        })
        DDL_state_Id.addEventListener("change", function () {

            const Country = serverReq.features.filter(feature => feature.attributes.name == this.value)
            const cities = serverReq1.features.filter(feature => feature.attributes.CNTRY_NAME == this.value)

            while (County_NAME.firstChild) {
                County_NAME.removeChild(County_NAME.firstChild)
            }

            let allAdd = document.createElement('option');
            allAdd.textContent = "All"
            allAdd.value = "All"
            County_NAME.appendChild(allAdd)

            for (let i = 0; i < cities.length; i++) {

                let opt = document.createElement('option');
                opt.textContent = cities[i].attributes.CITY_NAME
                opt.value = cities[i].attributes.CITY_NAME

                County_NAME.appendChild(opt)
            }
            if (this.value != "All") {
                country.definitionExpression = "name = '" + this.value + "'";
                city.definitionExpression = "CNTRY_NAME = '"+this.value+ "'";
            }
            else {
                country.definitionExpression = "";
                city.definitionExpression = "";
            }

            // console.log(country);

            var queryRequest = new QueryTask({
                url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Countries_Natural_Earth_1_50M/FeatureServer/0/query"
            });

            var query = new Query();
            query.where = "name = '" + Country[0].attributes.name + "'"

                queryRequest.executeForExtent(query).then(function(extent){
                    console.log(extent);
                    view.goTo(extent.extent ,{ duration : 1000 })
                })

                drawChart12(this.value)

        })

        County_NAME.addEventListener("change", function () {

            const cities = serverReq1.features.filter(feature => feature.attributes.CITY_NAME == this.value)
            console.log(cities[0]);

                    view.goTo(
                        {
                            center: [cities[0].geometry.x, cities[0].geometry.y],
                            zoom: 6
        
                        }
                    ), { duration : 80000 }

                    graphicLayer.removeAll();

                    var point = {
                      type: "point", // autocasts as new Point()
                      x: cities[0].geometry.x,
                      y: cities[0].geometry.y
                    };
                
                    var markerSymbol = {
                      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                      color: [226, 119, 40]
                    };
                debugger;
                    var pointGraphic = new Graphic({
                      geometry: point,
                      symbol: markerSymbol
                    });
                
                    graphicLayer.add(pointGraphic);
                
                    map.add(graphicLayer);

        })


            function drawChart1(continent) {

                const cntry = serverReq.features.filter(feature => feature.attributes.continent == continent)

                 data1 = google.visualization.arrayToDataTable([
                            ["Name", "POP"],
                            [cntry[0].attributes.name,cntry[0].attributes.pop_est]
                            
                          ]);
            
                          for (let i = 1; i < cntry.length; i++) {
                              if (cntry[i].attributes.pop_est > 20000000 ) {
                                data1.addRows([
                                    [cntry[i].attributes.name,cntry[i].attributes.pop_est]
                                ]);
                              } 
                            }
          
                 options1 = {
                  title: "Countries Popualation",
                  width: document.getElementById("chart1").clientWidth,
                  height: document.getElementById("chart1").clientHeight,
                  bar: {groupWidth: "25%"},
                  legend: { position: "none" }
                };
                 chart1 = new google.visualization.ColumnChart(document.getElementById("chart1"));
                chart1.draw(data1, options1);
            }
            function drawChart2(continent) {

                const cntry = serverReq.features.filter(feature => feature.attributes.continent == continent)

                 data2 = google.visualization.arrayToDataTable([
                            ["Name", "GDB"],
                            [cntry[0].attributes.name,cntry[0].attributes.gdp_md_est]
                            
                          ]);
            
                          for (let i = 1; i < cntry.length; i++) {
                              if (cntry[i].attributes.gdp_md_est > 1500 ) {
                                data2.addRows([
                                    [cntry[i].attributes.name,cntry[i].attributes.gdp_md_est]
                                ]);
                              } 
                            }
          
                 options2 = {
                  title: "Countries GDB",
                  width: document.getElementById("chart1").clientWidth,
                  height: document.getElementById("chart1").clientHeight,
                  bar: {groupWidth: "25%"},
                  legend: { position: "none" }
                };
                 chart2 = new google.visualization.BarChart(document.getElementById("chart2"));
                chart2.draw(data2, options2);
            }
            function drawChart3(continent) {

                const cntry = serverReq.features.filter(feature => feature.attributes.continent == continent)

                 data3 = google.visualization.arrayToDataTable([
                    ["Name", "POP"],
                    [cntry[0].attributes.name,cntry[0].attributes.pop_est]
                    
                  ]);
    
                  for (let i = 1; i < cntry.length; i++) {
                      if (cntry[i].attributes.pop_est > 40000000 ) {
                        data3.addRows([
                            [cntry[i].attributes.name,cntry[i].attributes.pop_est]
                        ]);
                      } 
                    }
  
                 options3 = {
                  title: "Countries Popualation",
                  width: document.getElementById("chart1").clientWidth,
                  height: document.getElementById("chart1").clientHeight,
                  bar: {groupWidth: "25%"},
                  legend: { position: "top-right" }
                };
                 chart3 = new google.visualization.PieChart(document.getElementById("chart3"));
                chart3.draw(data3, options3);
            }
            function drawChart12(CNTRY) {

                const city = serverReq1.features.filter(feature => feature.attributes.CNTRY_NAME == CNTRY)

                 data4 = google.visualization.arrayToDataTable([
                    ["Name", "POP"],
                    [city[0].attributes.CITY_NAME,city[0].attributes.POP]
                    
                  ]);
    
                  for (let i = 1; i < city.length; i++) {
                    if (city[i].attributes.POP > 0 ) {

                        data4.addRows([
                           
                            [city[i].attributes.CITY_NAME,city[i].attributes.POP]

                        ]);         
                    }
                    }
  
                 options4 = {
                  title: "Citites Popualation",
                  width: document.getElementById("chart1").clientWidth,
                  height: document.getElementById("chart1").clientHeight,
                  bar: {groupWidth: "25%"},
                  legend: { position: "top-right" }
                };
                 chart4 = new google.visualization.PieChart(document.getElementById("chart1"));
                chart4.draw(data4, options4);
            }

            menuBtn2.addEventListener("click", function () {
                console.log("111");
                
                chart1.clearChart();
                chart2.clearChart();
                chart3.clearChart();
                chart4.draw(data4,options4);
                // chart5.clearChart();
                // chart6.clearChart();


            })
            menuBtn1.addEventListener("click", function () {
                chart4.clearChart();
                // chart5.clearChart();
                // chart6.clearChart();
                chart1.draw(data1,options1);
                chart2.draw(data2,options2);
                chart3.draw(data3,options3);
            })

    }); 
