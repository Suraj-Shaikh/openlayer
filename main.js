window.onload = init;

const attributionControl = new ol.control.Attribution({
  collapsible: true,
});

function init() {
  // Initialize the map controls
  // const fullScreenControl = new ol.control.FullScreen(); // Control to enable full screen mode
  // const mousePositionControl = new ol.control.MousePosition(); // Control to display mouse coordinates
  // const overViewMapControl = new ol.control.OverviewMap({ // Control to show an overview map
  //   layers: [
  //     new ol.layer.Tile({
  //       source: new ol.source.OSM() // OpenStreetMap layer for the overview map
  //     })
  //   ]
  // });
  // const scaleLineControl = new ol.control.ScaleLine(); // Control to display a scale line
  // const zoomSliderControl = new ol.control.ZoomSlider(); // Control to display a zoom slider

  // Create the map
  var map = new ol.Map({
    view: new ol.View({
      projection: "EPSG:4326",
      center: [75.10494, 19.66939], // Center the map on specified coordinates
      zoom: 8, // Initial zoom level
      rotation: 0, // Initial rotation angle
      // extent: [66.97497466187184,6.259464709193743, 98.68143920633882,38.0730477254945]
    }),
    target: "js-map", // HTML element id to render the map
    // keyboardEventTarget: document, // Enable keyboard events
    // controls: ol.control.defaults().extend([ // Add default controls and extend with additional controls
    //   fullScreenControl,
    //   mousePositionControl,
    //   overViewMapControl,
    //   scaleLineControl,
    //   zoomSliderControl
    // ])
  });

  // Base Layer
  const openstreetMapStandardLayer = new ol.layer.Tile({
    source: new ol.source.OSM(), // OpenStreetMap layer for the main map
    zIndex: 0,
    title: "stamen_watercolor",
    visible: false, // Layer visibility
  });

  // Openstreet Map Standard
  const openstreetmapHumanitarian = new ol.layer.Tile({
    source: new ol.source.OSM({
      url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    }),
    zIndex: 0,
    visible: false,
    title: "OSMHumanitarian",
  });

  //Bing Maps Basemap Layer
  const BingMaps = new ol.layer.Tile({
    source: new ol.source.BingMaps({
      key: "VGeBwM0ngFaLQXdBrvtr~BYbZ6Bd7Jw3rZ8gQHhGSBA~AmdRzEG5xXUgHgVnNyFDnY_BDK-Lvg3fF8orRTmC_jI9MkAwiQEdA8fS5roC8j6s",
      imagerySet: "AerialWithLabels", // Road, CanvasDark, canvasGray,OrdnanceSurvey
    }),
    zIndex: 0,
    visible: true,
    title: "BingMaps",
    extent: [
      66.97497466187184, 6.259464709193743, 98.68143920633882, 38.0730477254945,
    ],
  });

  // CartoDB BaseMap Layer
  const cartoDBBaseLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "http://{1-4}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png",
      attributions: "© CARTO",
    }),
    visible: false,
    title: "CartoDarkAll",
  });

  // Stamen basemap layer
  const stamenBaseLayer = new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: "terrain-labels",
      attributions:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    }),
    visible: false,
    title: "StamenTerrainWithLabels",
  });

  const StamenTerrainLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.jpg",
      // attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }),
    visible: false,
    title: "StamenTerrain",
  });

  // SISDP_P2_LULC_10K_2016_2019_MH WMS Layer
  const SISDPLULCWMSLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: "https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms",
      params: {
        LAYERS: "sisdp_phase2:SISDP_P2_LULC_10K_2016_2019_MH",
        FORMAT: "image/png",
        TRANSPARENT: false,
      },
      attributions: "<a href=https://bhuvan-vec2.nrsc.gov.in/>© bhuvan<a/>",
    }),
    visible: false,
    title: "SISDPLULCWMSLayer",
  });

  // Layer Group
  const baselayerGroup = new ol.layer.Group({
    layers: [
      openstreetMapStandardLayer,
      openstreetmapHumanitarian,
      BingMaps,
      cartoDBBaseLayer,
      stamenBaseLayer,
      StamenTerrainLayer,
      SISDPLULCWMSLayer,
    ],
  });
  map.addLayer(baselayerGroup);

  // Layer Switcher Logic for BaseLayer
  const baseLayerElements = document.querySelectorAll('.sidebar > input[type=radio]')
  for(let baseLayerElement of baseLayerElements){
    baseLayerElement.addEventListener('change',function(){
      let baseLayerElementValue = this.value;
      baselayerGroup.getLayers().forEach(function(element,index,array){
        let baseLayerName = element.get('title');
        element.setVisible(baseLayerName === baseLayerElementValue)
      })
    })
  }

  // TileDebug
  const tileDebugLayer = new ol.layer.Tile({
    source: new ol.source.TileDebug(),
    visible: false,
  });
  map.addLayer(tileDebugLayer);

  // tile ArcGIS REST API Layer
  const tileArcGISLayer = new ol.layer.Tile({
    source: new ol.source.TileArcGISRest({
      url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
    }),
    visible: false,
    title: "StamenTerrain",
  });
  map.addLayer(tileArcGISLayer);

  // console.log(ol.control.defaults()); // Log the default controls to the console

  // Popup for displaying coordinates
  const popupContainerElement = document.getElementById("popup-coordinates");

  const popup = new ol.Overlay({
    element: popupContainerElement, // HTML element for the popup
    positioning: "center-right", // Positioning of the popup
  });

  map.addOverlay(popup); // Add the popup overlay to the map

  // Event listener for map clicks
  map.on("click", function (e) {
    const clickedCoordinate = e.coordinate; // Get the clicked coordinate
    console.log(clickedCoordinate);
    popup.setPosition(undefined); // Clear the previous popup position
    popup.setPosition(clickedCoordinate); // Set the new popup position
    popupContainerElement.innerHTML = clickedCoordinate; // Display the coordinates in the popup
  });

  // // DragRotate interaction
  // const DragRotateInteraction = new ol.interaction.DragRotate({
  //   condition: ol.events.condition.altKeyOnly // Enable rotation when the Alt key is pressed
  // });
  // map.addInteraction(DragRotateInteraction); // Add the DragRotate interaction to the map

  // // Draw interaction
  // const drawInteraction = new ol.interaction.Draw({
  //   type: 'Polygon', // Type of drawing interaction (Polygon)
  //   freehand: true // Enable freehand drawing
  // });
  // map.addInteraction(drawInteraction); // Add the Draw interaction to the map

  // // Event listener for draw end
  // drawInteraction.on('drawend', function (e) {
  //   let parser = new ol.format.GeoJSON(); // Create a GeoJSON parser
  //   let drawnFeatures = parser.writeFeaturesObject([e.feature]); // Convert the drawn feature to GeoJSON
  //   console.log(drawnFeatures); // Log the drawn features to the console
  // });
}
