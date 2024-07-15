window.onload = init;

function init(){
  const map = new ol.Map({
    view: new ol.View({
      projection: 'EPSG:4326', // Set the projection to EPSG:4326 (WGS 84)
      center: [78.10546919703486, 22.863113962008917], // Set the initial center of the map to longitude 0 and latitude 0
      zoom: 9, // Set the initial zoom level of the map to 6
      // extent: [66.97497466187184,6.259464709193743, 98.68143920633882,38.0730477254945], // Restrict the extent of the layer
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(), // Add a layer with OpenStreetMap tiles as the source
        zIndex: 1, // Set the z-index of the layer to 1
        visible: false, // Make the layer initially visible
        // extent: [66.97497466187184,6.259464709193743, 98.68143920633882,38.0730477254945], // Restrict the extent of the layer
        opacity: 0.4 // Optionally set the opacity of the layer
      })
    ],
    target: 'js-map' // Specify the target HTML element with the ID 'js-map' where the map should be rendered
  })


  // Layer Group
  const layerGroup = new ol.layer.Group({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM({
          url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),
        zIndex: 0,
        visible: false, 
        // extent: [66.97497466187184,6.259464709193743, 98.68143920633882,38.0730477254945],
        opacity: 0.1
      }),

      //Bing Maps Basemap Layer
      new ol.layer.Tile({
        source: new ol.source.BingMaps({
          key:"VGeBwM0ngFaLQXdBrvtr~BYbZ6Bd7Jw3rZ8gQHhGSBA~AmdRzEG5xXUgHgVnNyFDnY_BDK-Lvg3fF8orRTmC_jI9MkAwiQEdA8fS5roC8j6s",
          imagerySet:'AerialWithLabels' 
        }),
        visible:false
      })

    ]
  })
  map.addLayer(layerGroup);

  //CartoDB BaseMap Layer
const cartoDBBaseLayer = new ol.layer.Tile({
  source:new ol.source.XYZ({
    url:'https://{1-4}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{scale}.png'
  }),
  visible:true
})
map.addLayer(cartoDBBaseLayer);
  

// tile ArcGIS REST API Layer
const tileArcGISLayer = new ol.layer.Tile({
  source:new ol.source.TileArcGISRest({
    url:"https://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/WorldElevations/MapServer"
  }),
  visible:true
})
map.addLayer(tileArcGISLayer);

// NOAA WMS Layer
const NOAAWMSLayer = new ol.layer.Tile({
  source:new ol.source.TileWMS({
    url:"https://opengeo.ncep.noaa.gov/geoserver/wwa/hazards/ows?service=wms&version=1.3.0&request=GetCapabilities"
  })
})
}


