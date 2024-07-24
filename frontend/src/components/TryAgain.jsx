import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import Overlay from "ol/Overlay";
import View from "ol/View";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { LineString, Point, Polygon } from "ol/geom";
import { OSM, Vector as VectorSource } from "ol/source";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import Draw from "ol/interaction/Draw";
import { getArea, getLength } from "ol/sphere";
import { unByKey } from "ol/Observable";
import "./Drwa.css";
import { listen } from "ol/events";

const TLMapComponent = () => {
  const mapRef = useRef(null);
  const del = useRef(null);
  const drawRef = useRef(null);
  const [maps, setMaps] = useState();

  const vectorSourceRef = useRef(null);
  const [draw, setDraw] = useState(null);
  const vclayer = useRef();

  let measureTooltipElement;
  let measureTooltipget;

  // let measureTooltip;
  // try to get the measureTooltip into the delete function ...
  const [measureTooltip, setmeasureTooltip] = useState();

  useEffect(() => {
    const raster = new TileLayer({
      source: new OSM(),
    });

    const source = new VectorSource();
    vectorSourceRef.current = source;

    const vector = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new Stroke({
          color: "#ffcc33",
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: "#ffcc33",
          }),
        }),
      }),
    });

    let  map = new Map({
      layers: [raster, vector],
      target: mapRef.current,
      view: new View({
        center: [-11000000, 4600000],
        zoom: 15,
      }),
    });

    setMaps(map)

    let sketch;

    map.getViewport().addEventListener("mouseout", function () {
      measureTooltipElement.classList.add("hidden");
    });

    const formatLength = function (line) {
      const length = getLength(line);
      let output;
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + " " + "km";
      } else {
        output = Math.round(length * 100) / 100 + " " + "m";
      }
      return output;
    };

    const formatArea = function (polygon) {
      const area = getArea(polygon);
      let output;
      if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + " " + "km²";
      } else {
        output = Math.round(area * 100) / 100 + " " + "m²";
      }
      return output;
    };

    const style = new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.2)",
      }),
      stroke: new Stroke({
        color: "rgba(0, 0, 0, 0.5)",
        lineDash: [10, 10],
        width: 2,
      }),
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: "rgba(0, 0, 0, 0.7)",
        }),
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
      }),
    });

    const addInteraction = (type) => {
      if (draw) {
        map.removeInteraction(draw);
      }

      const newDraw = new Draw({
        source: source,
        type: "Polygon",
        style: style,

        // function (feature) {
        //   const geometryType = feature.getGeometry().getType();
        //   if (geometryType === drawType || geometryType === "Point") {
        //     return style;
        //   }
        // },
      });

      map.addInteraction(newDraw);
      // console.log( newDraw,"newDraw");
      setDraw(newDraw);

      let listener;
      newDraw.on("drawstart", function (evt) {
        

        // console.log(evt, 'evt')
        // console.log( "drwa start");
        sketch = evt.feature;

        let tooltipCoord = evt.coordinate;

        listener = sketch.getGeometry().on("change", function (evt) {
          const geom = evt.target;
          let output;
          if (geom instanceof Polygon) {
            output = formatArea(geom);
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
          } else if (geom instanceof LineString) {
            output = formatLength(geom);
            tooltipCoord = geom.getLastCoordinate();
          } else if (geom instanceof Point) {
            output = "Point";
            tooltipCoord = geom.getCoordinates();
          }
          measureTooltipElement.innerHTML = output;
          measureTooltipget.setPosition(tooltipCoord);
        });

        // console.log(evt.feature., 'evt')
      });

      newDraw.on("drawend", function (event) {
        let feature = event.feature
        measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
        measureTooltipget.setOffset([0, -7]);
        sketch = null;
        measureTooltipElement = null;
        createMeasureTooltip();
        unByKey(listener);
        console.log(feature, "feature");
      

    

        // console.log(vector.getSource().getFeatures());
        // map.getLayers().forEach((layer) => {
        //  console.log(layer.getLayers(), "layer")
        // console.log(layer.getLayers().getArray()[0].getSource(), "source")
          // const source = layer.getLayers().getArray()[0].getSource();
          // console.log('Intersecting ', feature);
          // source.removeFeature(feature);
        
      });
        // vector.getSource().addFeature(event.feature);

        // console.log( "drwa end");
        // map.removeOverlay(measureTooltipget);

        // vector.getSource().removeFeature(feature);
        // console.log(feature, ' after feature')
      
    };

    const createMeasureTooltip = () => {
      if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
      }
      measureTooltipElement = document.createElement("div");
      measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";

      measureTooltipget = new Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: "bottom-center",
        stopEvent: false,
        insertFirst: false,
      });
      setmeasureTooltip(measureTooltipget);
      map.addOverlay(measureTooltipget);

      // console.log(measureTooltipget.ol_uid, "measureTooltip value after set");
      // console.log(measureTooltip ,"measureTooltip value after set");
    };
    createMeasureTooltip();

    addInteraction("Polygon");

    // vclayer.current = measureTooltip
    // console.log(draw, "draw value after set");
  }, []);

  function deleteinteraction() {
    console.log(maps)
    maps.getLayers().forEach((layer) => {
         
      const source = layer.getLayers().getArray()[0].getSource();
      console.log('Intersecting ', feature);
      source.removeFeature(feature);
    
  });
    // console.log(measureTooltip,"deletye me vclayer")
    // map.re
    // vclayer.removeFeatures( [measureTooltip.ol_uid] );
    // vclayer.current.style.display = "none";
    // measureTooltip.style.display = "none";
    // vclayer.removeInteraction(draw);
    // map.removeInteraction(newDraw);
    // vector.getSource().clear();
    // raster.getSource().clear();
    // var interactions = vclayer.getInteractions();
    // // Iterate through the interactions to find the one you want to remove
    // interactions.forEach(function(interaction) {
    //     console.log(interaction)
    //     // Check if the interaction matches the one you want to remove
    //     // if (interaction instanceof vclayer.interaction.Draw) { // for example, if you want to remove a Draw interaction
    //         // Remove the interaction from the map
    //         vclayer.removeInteraction(interaction);
    //     // }
    // });
  }
  //   console.log(del, "deleteRef");

  return (
    <div>
      <div
        id="map"
        ref={mapRef}
        style={{
          width: "100vw",
          height: "80vh",
          border: "1px solid black",
          overflow: "hidden",
        }}
      ></div>
      <div
        id="toolbar"
        style={{
          width: "100%",
          height: "20vh",
          margin: "10px 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "20px",
            fontWeight: "500",
            marginBottom: "10px",
          }}
        >
          Select the type to draw!!
        </h1>

        <div id="btndiv">
          <button id="type" ref={drawRef}>
            Draw
          </button>
          <button ref={del} onClick={deleteinteraction}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TLMapComponent;
