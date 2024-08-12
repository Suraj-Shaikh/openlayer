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
  // EPSG:3416  for Austria
  proj4.defs(
    "EPSG:3416",
    "+proj=lcc +lat_1=49 +lat_2=46 +lat_0=47.5 +lon_0=13.33333333333333 +x_0=400000 +y_0=400000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
  );
  //EPSG:277000 for the UK
  proj4.defs(
    "EPSG:27700",
    "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +nadgrids=OSTN15_NTv2_OSGBtoETRS.gsb +units=m +no_defs +type=crs"
  );

  ol.proj.proj4.register(proj4);
  // console.log(ol.porj.fromLonLat([625422.3208012241, 484928.2125922037],'EPSG:27700'))

  // Create the map Object
  var map = new ol.Map({
    view: new ol.View({
      center: [0, 0], // Center the map on specified coordinates
      // center: ol.porj.fromLonLat([625422.3208012241, 484928.2125922037],'EPSG:27700'),
      zoom: 3, // Initial zoom level
      projection: "EPSG:3416",
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
    color: [40, 119, 247, 1],
  });

  // Style for lines
  const strokeStyle = new ol.style.Stroke({
    color: [30, 30, 31, 1],
    width: 1.2,
    lineCap: "square",
    // lineJoin: 'bevel',
    // lineDash: [17, 3]
  });

  const regularShape = new ol.style.RegularShape({
    fill: new ol.style.Fill({
      color: [245, 49, 5, 1],
    }),
    stroke: strokeStyle,
    points: 5,
    radius: 15,
    radius1: 3,
    radius2: 5,
  });

  //Icon Marker Style
  const iconMarkerStyle = new ol.style.Icon({
    src: "./images/icons8-map-marker-94.png",
    size: [100, 100],
    offest: [0, 0],
    opacity: 1,
    scale: 0.5,
  });

  // Points Style
  const pointStyle = new ol.style.Style({
    image: new ol.style.Circle({
      fill: new ol.style.Fill({
        color: [245, 10, 14, 1],
      }),
      radius: 7,
      stroke: new ol.style.Stroke({
        color: [245, 10, 14, 1],
        width: 2,
      }),
    }),
  });
  // Lines Style
  const lineStringStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: [59, 59, 59, 1],
      width: 2,
    }),
  });

  // Polygon Style
  // Blue polygons
  const blueCountriesStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: [56, 41, 194, 1],
    }),
  });

  // Purple polygons
  const purpleCountriesStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: [164, 63, 204, 1],
    }),
  });

  const EUCountriesStyle = function (feature) {
    let geometryType = feature.getGeometry().getType();
    let incomeProperty = feature.get("income");

    if (geometryType === "Point") {
      feature.setStyle([pointStyle]);
    }

    if (geometryType === "LineString") {
      feature.setStyle([lineStringStyle]);
    }

    if (geometryType === "Polygon") {
      if (incomeProperty === "Blue") {
        feature.setStyle([blueCountriesStyle]);
      }
      if (incomeProperty === "Purple") {
        feature.setStyle([purpleCountriesStyle]);
      }
    }
  };

  // Austrian Cities EPSG:27700
  const AustrianCities = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: "./data/austrian_cities_EPSG_27700.geojson",
      format: new ol.format.GeoJSON({
        dataProjection: "EPSG:27700",
      }),
    }),
    visible: true,
    title: "AustrianCities",
    style: new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: [15, 15, 15, 1],
        }),
        radius: 10,
        stroke: new ol.style.Stroke({
          color: [15, , 15, 15, 1],
          width: 2,
        }),
      }),
    }),
  });
  map.addLayer(AustrianCities);

  // Central EU Countries GeoJSON VectorImage Layer
  const EUCountriesGeoJSONVectorImage = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: "./data/Central_EU_countries_GEOJSON.geojson",
      format: new ol.format.GeoJSON(),
    }),
    visible: true,
    title: "CentralEUCountriesGeoJSON",
    style: EUCountriesStyle,
    // new ol.style.Style({
    //   fill: fillStyle,
    //   stroke: strokeStyle,
    //   image: iconMarkerStyle,
    // })
  });

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
      image: iconMarkerStyle,
    }),
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
      url: "./data/onlineFBUsers.geojson",
      format: new ol.format.GeoJSON(),
    }),
    radius: 20,
    blur: 12,
    gradient: ["#DC143C", "#DC143C", "#000000", "#000000", "#000000"],
    title: "OnlineFBUsers",
    visible: false,
  });

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
      EUCountriesGeoJSONVectorImage,
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
  const overlayContainerElement = document.querySelector(".overlay-container");
  const overlayLayer = new ol.Overlay({
    element: overlayContainerElement,
  });
  map.addOverlay(overlayLayer);
  const overlayFeatureName = document.getElementById("feature-name");
  const overlayFeatureAdditionalinfo = document.getElementById(
    "feature-additional-info"
  );

  // Vector Feature Popup Logic

  map.on("click", function (e) {
    map.forEachFeatureAtPixel(
      e.pixel,
      function (feature, layer) {
        let clickedCoordinate = e.coordinate;
        // console.log(clickedCoordinate);
        let clickedFeatureName = feature.get("name");
        let clickedFeatureAdditionalinfo = feature.get("additionalinfo");
        if (clickedFeatureName && clickedFeatureAdditionalinfo != undefined) {
          overlayLayer.setPosition(clickedCoordinate);
          overlayFeatureName.innerHTML = clickedFeatureName;
          overlayFeatureAdditionalinfo.innerHTML = clickedFeatureAdditionalinfo;
        }
      },
      {
        layerFilter: function (layerCondidate) {
          return layerCondidate.get("title") === "CentralEUCountriesGeoJSON";
        },
      }
    );
  });

  //Select Interaction - for Styling Selected Points
  /*const selectInteraction = new ol.interaction.Select({
    condition: ol.events.condition.singleClick,
    layers: function(layer){
      return [layer.get('title') === 'AustrianCities', layer.get('title') === 'CentralEUCountriesGeoJSON',]
    },
    style: new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: [247, 26, 10, 1]
        }),
        radius: 12,
        stroke: new ol.style.Stroke({
          color: [247, 26, 10, 1],
          width: 3
        })
      })
    })
  })
  map.addInteraction(selectInteraction);*/

  //Select Interaction 2
  const selectInteraction2 = new ol.interaction.Select();
  map.addInteraction(selectInteraction2);
  selectInteraction2.on("select", function (e) {
    let selectedFeature = e.selected;
    if (
      selectedFeature.length > 0 &&
      selectedFeature[0].getGeometry().getType() === "Point"
    ) {
      selectedFeature[0].setStyle(
        new ol.style.Style({
          image: new ol.style.Circle({
            fill: new ol.style.Fill({
              color: [247, 26, 10, 1],
            }),
            radius: 12,
            stroke: new ol.style.Stroke({
              color: [247, 26, 10, 1],
              width: 3,
            }),
          }),
        })
      );
    }
  });
}
