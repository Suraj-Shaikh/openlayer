window.onload = init

function init() {

  //Controls
  const fullScreenControl = new ol.control.FullScreen();
  const mousePositionControl = new ol.control.MousePosition();
  const overViewMapControl = new ol.control.OverviewMap({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
        
      })
    ]
  })

  const scaleLineControl = new ol.control.ScaleLine();
  const zoomSliderControl = new ol.control.ZoomSlider();

  var map = new ol.Map({
    view: new ol.View({
      center: ol.proj.fromLonLat([75.10494, 19.66939]),
      zoom: 8,
      rotation: 0,
    }),

    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
        title: 'Open Street Map',
        visible: true,
      })
    ],
    target: 'js-map',
    keyboardEventTarget: document,
    
    controls: ol.control.defaults().extend([
      fullScreenControl,
      mousePositionControl,
      overViewMapControl,
      scaleLineControl,
      zoomSliderControl
    ])
    // view: mapView
  })
  console.log( ol.control.defaults())

  const popupContainerElement = document.getElementById('popup-coordinates');

  const popup = new ol.Overlay({
    element: popupContainerElement,
    positioning: 'center-right'
  })

  map.addOverlay(popup);

  map.on('click', function (e) {
    const clickedCoordinate = e.coordinate;
    popup.setPosition(undefined);
    popup.setPosition(clickedCoordinate);
    popupContainerElement.innerHTML = clickedCoordinate;
  })

  //DragRotate Interaction
  const DragRotateInteraction = new ol.interaction.DragRotate({
    condition: ol.events.condition.altKeyOnly
  })
  map.addInteraction(DragRotateInteraction)

  // Drow Interaction
  const drawInteraction = new ol.interaction.Draw({
    type: 'Polygon',
    freehand: true
  })
  map.addInteraction(drawInteraction);

  drawInteraction.on('drawend', function (e) {
    let parser = new ol.format.GeoJSON();
    let drawnFeatures = parser.writeFeaturesObject([e.feature]);
    console.log(drawnFeatures);
  })

};



