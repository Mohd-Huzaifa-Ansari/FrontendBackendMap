import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM, Tile as TileLayer } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Vector as VectorSource } from 'ol/source';
import { transform } from 'ol/proj';

function App() {
  const [parcelData, setParcelData] = useState([]);

  useEffect(() => {
    axios
      .get('api/parcel')
      .then((res) => {
        console.log('Response data:', res.data);
        setParcelData(res.data);
      })
      .catch((error) => {
        console.error('Error fetching parcel data:', error);
      });
  }, []);

  useEffect(() => {
    if (parcelData.length === 0) return;

    const image = new CircleStyle({
      radius: 10,
      fill: null,
      stroke: new Stroke({ color: 'grey', width: 1 }),
    });

    const styles = {
      MultiPolygon: new Style({
        stroke: new Stroke({
          color: 'red',
          width: 1,
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 0, 0.1)',
        }),
      }),
      Polygon: new Style({
        stroke: new Stroke({
          color: 'blue',
          lineDash: [4],
          width: 3,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),
      Circle: new Style({
        stroke: new Stroke({
          color: 'green',
          width: 2,
        }),
        fill: new Fill({
          color: 'black',
        }),
      }),
    };

    const styleFunction = function (feature) {
      return styles[feature.getGeometry().getType()];
    };

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(parcelData, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
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
      target: 'map',
      view: new View({
        center: transform([-77.3065055, 38.9499497], 'EPSG:4326', 'EPSG:3857'),
        zoom: 17,
      }),
    });

    return () => {
      map.setTarget(null);
    };
  }, [parcelData]);

  return (
    <div id="map" style={{ width: '100%', height: '100vh' }} />
  );
}

export default App;
