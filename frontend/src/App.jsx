import { useEffect, useState, useRef } from "react";
import axios from "axios";

////////////////// adding previous code
import "ol/ol.css";
import { transform } from "ol/proj";
import Map from "ol/Map";
import View from "ol/View";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { OSM, Vector as VectorSource } from "ol/source";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import GeoJSON from "ol/format/GeoJSON";

import "./App.css";
import MapOne from "./components/MapOne";

function App() {
  const [parcelData, setParcelData] = useState([]);
  const mapRef = useRef();

  // setting the data center of the parcel
   const [centerCoor ,setCenterCoor]= useState()

  useEffect(() => {
    axios
      .get("api/parcel")
      .then((res) => {
        // console.log(`res data ${actualdata}`)

        setParcelData(res.data);

        setCenterCoor(res.data.features[0].geometry.coordinates[0][0][14])
        console.log(res.data.features[0].geometry.coordinates[0][0][7] , " coordinate value")

       
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  /////////////////////////

  useEffect(() => {
    if (parcelData.length === 0) return; // Don't proceed if parcelData is empty
    if (mapRef.current) {
      console.log(mapRef, "ref", parcelData);

      const image = new CircleStyle({
        radius: 10,
        fill: null,
        stroke: new Stroke({ color: "grey", width: 1 }),
      });

      const styles = {
        MultiPolygon: new Style({
          stroke: new Stroke({
            color: "red",
            width: 1,
          }),
          fill: new Fill({
            color: "rgba(255, 255, 0, 0.1)",
          }),
        }),
        Polygon: new Style({
          stroke: new Stroke({
            color: "blue",
            lineDash: [4],
            width: 3,
          }),
          fill: new Fill({
            color: "rgba(0, 0, 255, 0.1)",
          }),
        }),
        Circle: new Style({
          stroke: new Stroke({
            color: "green",
            width: 2,
          }),
          fill: new Fill({
            color: "black",
          }),
        }),
      };

      const styleFunction = function (feature) {
        return styles[feature.getGeometry().getType()];
      };

      const vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(parcelData, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }),
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: styleFunction,
      });

      const map = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        target: mapRef.current,
        view: new View({
          center: [0, 0],
          zoom: 7,
        }),
      });

      // map.setTarget(mapRef.current);

      map.getView().animate(
        { zoom: 17 },
        { duration: 1000 },
        {
          center: transform(
            centerCoor,     // [-77.3065055, 38.9499497] previous center value .... which can be get from the lat,long of data 
            "EPSG:4326",
            "EPSG:3857"
          ),
        }
      );
    }

    // return () => {
    //   map.setTarget(null);
    // };
  }, [mapRef, parcelData,centerCoor]);

  ///////////////////////
  useEffect(() => {
    console.log(`saved data ${parcelData}`);
    console.log(parcelData);
      console.log(centerCoor, "center coordinate value ")
  }, [parcelData]);



  return (
    <>
      <div ref={mapRef} id="map" />

      {/* <MapOne /> */}
      {/* <h2>Parcel Data:</h2> */}
    </>
  );
}

export default App;
