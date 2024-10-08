window.onload = init;

function init() {
  const austrCenterCoordinate = [15091875.539375868, -2890099.0297847847];
  const map = new ol.Map({
    view: new ol.View({
      center: austrCenterCoordinate,
      zoom: 1,
      extent: [
        11644482.371265175, -5927677.981920381, 17897308.66780227,
        423055.8371644793,
      ],
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    target: "openlayers-map",
  });
  //Australian Cities GeoJson
  const austCitiesStyle = function (feature) {
    let cityID = feature.get("ID");
    let cityIDString = cityID.toString();
    const styles = [
      new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: [77, 219, 105, 0.6],
          }),
          stroke: new ol.style.Stroke({
            color: [6, 125, 34, 1],
            width: 2,
          }),
          radius: 12,
        }),
        text: new ol.style.Text({
          text: cityIDString,
          scale: 1.5,
          fill: new ol.style.Fill({
            color: [232, 26, 26, 1],
          }),
          stroke: new ol.style.Stroke({
            color: [232, 26, 26, 1],
            width: 0.3,
          }),
        }),
      }),
    ];
    return styles;
  };

  const styleForSelect = function (feature) {
    let cityID = feature.get("ID");
    let cityIDString = cityID.toString();
    const styles = [
      new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: [247, 25, 10, 0.5],
          }),
          stroke: new ol.style.Stroke({
            color: [6, 125, 34, 1],
            width: 2,
          }),
          radius: 12,
        }),
        text: new ol.style.Text({
          text: cityIDString,
          scale: 1.5,
          fill: new ol.style.Fill({
            color: [87, 9, 9, 1],
          }),
          stroke: new ol.style.Stroke({
            color: [87, 9, 9, 1],
            width: 0.5,
          }),
        }),
      }),
    ];
    return styles;
  };

  const austCitiesLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: "./data/aust_cities.geojson",
    }),
    style: austCitiesStyle,
  });
  map.addLayer(austCitiesLayer);

  // Map Features Click Logic
  const navElements = document.querySelector(".column-navigation");
  const cityNameElement = document.getElementById("cityname");
  const cityImageElement = document.getElementById("cityimage");
  const mapView = map.getView();

  map.on("singleclick", function (evt) {
    map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
      let featureName = feature.get("Cityname");
      let navElement = navElements.children.namedItem(featureName);
      mainLogic(feature, navElement);
    });
  });

  function mainLogic(feature, clickedAnchorElement) {
    // Re-assign active class to the clicked element
    let currentActiveStyledElement = document.querySelector(".active");
    currentActiveStyledElement.className =
      currentActiveStyledElement.className.replace("active", "");
    clickedAnchorElement.className = "active";
    // Default Style for all Features
    let austCitiesFeatures = austCitiesLayer.getSource().getFeatures();
    austCitiesFeatures.forEach(function (feature) {
      feature.setStyle(austCitiesStyle);
    });

    //Home Element : Change content in the feature
    if (clickedAnchorElement.id === "Home") {
      mapView.animate({ center: austrCenterCoordinate }, { zoom: 4 });
      cityNameElement.innerHTML =
        "Welcome to Australian Capital Cities Tour Map";
      cityNameElement.setAttribute(
        "src",
        "./data/City_images/Australian_Flag.jpg"
      );
    } else {
      // change the view based on the feature
      feature.setStyle(styleForSelect);
      let featureCoordinates = feature.get("geometry").getCoordinates();
      mapView.animate({ center: featureCoordinates }, { zoom: 5 });
      //get image
      let featureName = feature.get("Cityname");
      let featureImage = feature.get("Cityimage");
      cityNameElement.innerHTML = "Name of the City: " + featureName;
      cityImageElement.setAttribute(
        "src",
        "./data/City_images/" + featureImage + ".jpg"
      );
    }
  }

  //Navigation Button Logic
  const anchorNavElements = document.querySelectorAll(".column-navigation > a");
  for (let anchorNavElement of anchorNavElements) {
    anchorNavElement.addEventListener("click", function (e) {
      let clickedAnchorElement = e.currentTarget;
      let clickedAnchorElementID = clickedAnchorElement.id;
      let austCitiesFeatures = austCitiesLayer.getSource().getFeatures();
      austCitiesFeatures.forEach(function (feature) {
        let featureCityName = feature.get("Cityname");
        if (clickedAnchorElementID === featureCityName) {
          mainLogic(feature, clickedAnchorElement);
        }
      });

      //Home Element : Navigation Case
      if (clickedAnchorElementID === "Home") {
        mainLogic(undefined, clickedAnchorElement);
      }
    });
  }
  // Feature Hover logic
  const popoverTextElement = document.getElementById("popover-text");
  const popoverTextLayer = new ol.Overlay({
    element: popoverTextElement,
    positioning: "bottom-center",
    stopEvent: false,
  });
  map.addOverlay(popoverTextLayer);

  map.on("pointermove", function (evt) {
    let isFeatureAtPixel = map.hasFeatureAtPixel(evt.pixel);
    if (isFeatureAtPixel) {
      let featureAtPixel = map.getFeaturesAtPixel(evt.pixel);
      let featureName = featureAtPixel[0].get("Cityname");
      popoverTextLayer.setPosition(evt.coordinate);
      popoverTextElement.innerHTML = featureName;
      map.getViewport().style.cursor = 'pointer';
    } else {
      popoverTextLayer.setPosition(undefined)
      map.getViewport().style.cursor = ''
    }
  });
}
