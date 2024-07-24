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


const DrawFeature = (map) => {

 
   
  // const mapRef = useRef(null);
  // const del = useRef(null);
  // const typeSelectRef = useRef(null);
  // const vectorSourceRef = useRef(null);
  const [draw, setDraw] = useState(null);
  const vclayer = useRef();

  let measureTooltipElement;
  let measureTooltip;

  useEffect(() => {
    // const raster = new TileLayer({
    //   source: new OSM(),
    // });

    console.log(map,"map coming on click")

    // const source = new VectorSource();
    // vectorSourceRef.current = source;

    // const vector = new VectorLayer({
    //   source: source,
    //   style: new Style({
    //     fill: new Fill({
    //       color: "rgba(255, 255, 255, 0.2)",
    //     }),
    //     stroke: new Stroke({
    //       color: "#ffcc33",
    //       width: 2,
    //     }),
    //     image: new CircleStyle({
    //       radius: 7,
    //       fill: new Fill({
    //         color: "#ffcc33",
    //       }),
    //     }),
    //   }),
    // });

    //  map = new Map({
    //   layers: [raster, vector],
    //   target: mapRef.current,
    //   view: new View({
    //     center: [-11000000, 4600000],
    //     zoom: 15,
    //   }),
    // });

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

      const drawType =
        type === "polygon"
          ? "Polygon"
          : type === "point"
          ? "Point"
          : "LineString";

      const newDraw = new Draw({
        source: source,
        type: "Polygon",
        style: function (feature) {
          const geometryType = feature.getGeometry().getType();
          if (geometryType === drawType || geometryType === "Point") {
            return style;
          }
        },
      });

      map.addInteraction(newDraw);
      setDraw(newDraw);

      createMeasureTooltip();

      let listener;
      newDraw.on("drawstart", function (evt) {
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
          measureTooltip.setPosition(tooltipCoord);
        });
      });

      newDraw.on("drawend", function () {
        measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
        measureTooltip.setOffset([0, -7]);
        sketch = null;
        measureTooltipElement = null;
        createMeasureTooltip();
        unByKey(listener);
        
      });
    };

    const createMeasureTooltip = () => {
      if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
      }
      measureTooltipElement = document.createElement("div");
      measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
      measureTooltip = new Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: "bottom-center",
        stopEvent: false,
        insertFirst: false,
      });
      map.addOverlay(measureTooltip);
    };

    addInteraction("Polygon");
    vclayer.current = measureTooltip
    // console.log(draw, "draw value after set");
  }, []);

  function deleteinteraction() {
    console.log(vclayer,"deletye me vclayer")
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

 
};

export default DrawFeature;