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
      // projection: "EPSG:4326",
      center: [75.10494, 19.66939], // Center the map on specified coordinates
      zoom: 3, // Initial zoom level
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
    visible: false,
    title: "BingMaps",
    // extent: [
    //   66.97497466187184, 6.259464709193743, 98.68143920633882, 38.0730477254945,
    // ],
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

  // Base Vector Layers
  // Vector Tile Layer OpenstreetMap
  const openstreetMapVectorTile = new ol.layer.VectorTile({
    source: new ol.source.VectorTile({
      url: "https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=9rMhqeEevzAPoehEWAa3",
      format: new ol.format.MVT(),
      attributions:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
    }),
    visible: false,
    title: "VectorTileLayerOpenstreetMap",
  });
  const openstreetMapVectorTileStyles =
    "https://api.maptiler.com/maps/openstreetmap/style.json?key=9rMhqeEevzAPoehEWAa3";
  fetch(openstreetMapVectorTileStyles).then(function (response) {
    // console.log(response)
    response.json().then(function (glStyle) {
      // console.log(glStyle)
      // stylefunction(openstreetMapVectorTile, glStyle, '07f17c14-e35d-4da0-b5ff-747ee19b19b2');
    });
  });

  // Base Layer Group
  const baselayerGroup = new ol.layer.Group({
    layers: [
      openstreetMapStandardLayer,
      openstreetmapHumanitarian,
      BingMaps,
      cartoDBBaseLayer,
      stamenBaseLayer,
      StamenTerrainLayer,
      openstreetMapVectorTile,
    ],
  });
  map.addLayer(baselayerGroup);

  // Layer Switcher Logic for Base Layer
  const baseLayerElements = document.querySelectorAll(
    ".sidebar > input[type=radio]"
  );
  for (let baseLayerElement of baseLayerElements) {
    baseLayerElement.addEventListener("change", function () {
      let baseLayerElementValue = this.value;
      baselayerGroup.getLayers().forEach(function (element, index, array) {
        let baseLayerName = element.get("title");
        element.setVisible(baseLayerName === baseLayerElementValue);
      });
    });
  }

  //Raster Layers
  // TileDebug
  const tileDebugLayer = new ol.layer.Tile({
    source: new ol.source.TileDebug(),
    visible: false,
    title: "TileDebugLayer",
  });

  // tile ArcGIS REST API Layer
  const tileArcGISLayer = new ol.layer.Tile({
    source: new ol.source.TileArcGISRest({
      url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
    }),
    visible: false,
    title: "TileArcGISLayer",
  });

  // SISDP_P2_LULC_10K_2016_20title: "TileArcGISLayer"19_MH WMS Layer
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

  // static image

  const openstreetmapHumanitarianStatic = new ol.layer.Image({
    source: new ol.source.ImageStatic({
      url: "./data/imagestatic.png",
      imageExtent: [
        73.12740093750001, 21.097612656250003, 74.53365093750001,
        22.503862656250003,
      ],
      attributions: "@ Humanitarian OSM Tags",
    }),
    title: "openstreetmapHumanitarianStatic",
  });
  // Vector Layers
  // Styling of vector features
  const fillStyle = new ol.style.Fill({
    color: [40, 119, 247, 1]
  })

  // Style for lines
  const strokeStyle = new ol.style.Stroke({
    color: [30, 30, 31, 1],
    width: 1.2,
    lineCap: 'square',
    lineJoin: 'bevel',
    lineDash: [3, 3]
  }) 
 
  // Central EU Countries GeoJSON VectorImage Layer
  const EUCountriesGeoJSONVectorImage = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: './data/Central_EU_countries_GEOJSON.geojson',
      format: new ol.format.GeoJSON()
    }),
    visible: true,
    title: 'CentralEUCountriesGeoJSON' ,
    style: new ol.style.Style({
      fill: fillStyle,
      stroke: strokeStyle,
    })
  })

  //Central India State GeoJSON Vector Layer
  const IndianStateGeoJSON = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: "./data/map.geojson",
      format: new ol.format.GeoJSON(),
    }),
    visible: true,
    title: "IndianStateGeoJSON",
    style: new ol.style.Style({
      fill: fillStyle,
      stroke: strokeStyle,
    })
  });

  //Central India State GeoJSON VectorImage Layer
  const IndianStateGeoJSONVectorImage = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: "./data/map.geojson",
      format: new ol.format.GeoJSON(),
    }),
    visible: true,
  });

  // Central EU Countries KML
  const EUCountriesKML = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: "./data/Central_EU_countries_KML.kml",
      format: new ol.format.KML(),
    }),
    visible: false,
    title: "CentralEUCountriesKML",
  });

  // HeatMap
  const heatMapOnlineFBUsers = new ol.layer.Heatmap({
    source: new ol.source.Vector({
      url: './data/onlineFBUsers.geojson',
      format: new ol.format.GeoJSON()
    }),
    radius: 20,
    blur: 12,
    gradient: ['#DC143C', '#DC143C', '#000000', '#000000', '#000000'],
    title: 'OnlineFBUsers',
    visible: false
  })

  // Raster Tile Layer Group
  const rasterTileLayerGroup = new ol.layer.Group({
    layers: [
      SISDPLULCWMSLayer,
      tileArcGISLayer,
      tileDebugLayer,
      openstreetmapHumanitarianStatic,
      IndianStateGeoJSON,
      EUCountriesKML,
      heatMapOnlineFBUsers,
      EUCountriesGeoJSONVectorImage
    ],
  });
  map.addLayer(rasterTileLayerGroup);

  //Layer Switcher Logic for Raster Tile Layer
  const tileRasterLayerElements = document.querySelectorAll(
    ".sidebar > input[type=checkbox]"
  );
  for (let tileRasterLayerElement of tileRasterLayerElements) {
    tileRasterLayerElement.addEventListener("change", function () {
      let tileRasterLayerElementValue = this.value;
      let tilerasterLayer;

      rasterTileLayerGroup
        .getLayers()
        .forEach(function (element, index, array) {
          if (tileRasterLayerElementValue === element.get("title")) {
            tilerasterLayer = element;
            // console.log(rasterLayerName.title)
          }
        });
      this.checked
        ? tilerasterLayer.setVisible(true)
        : tilerasterLayer.setVisible(false);
    });
  }

  // Vector Feature Popup Information
  const overlayContainerElement = document.querySelector('.overlay-container')
  const overlayLayer = new ol.Overlay({
    element:overlayContainerElement
  })
  map.addOverlay(overlayLayer);
  const overlayFeatureName = document.getElementById('feature-name')
  const overlayFeatureAdditionalinfo = document.getElementById('feature-additional-info')
  
  // Vector Feature Popup Logic

  map.on('click',function(e){
    map.forEachFeatureAtPixel(e.pixel,function(feature,layer){
      let clickedCoordinate = e.coordinate;
      let clickedFeatureName = feature.get(('District'));
      let clickedFeatureAdditionalinfo = feature.get(('additionalinfo'));
      if(clickedFeatureName && clickedFeatureAdditionalinfo != undefined){
        overlayLayer.setPosition(clickedCoordinate);
        overlayFeatureName.innerHTML = clickedFeatureName;
        overlayFeatureAdditionalinfo.innerHTML = clickedFeatureAdditionalinfo;
      }
    })
  })

}
