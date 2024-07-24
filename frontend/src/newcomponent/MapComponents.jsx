import React, { useState, useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Draw, Modify, Select } from 'ol/interaction';
import { createBox } from 'ol/interaction/Draw';
import { Fill, Stroke, Style } from 'ol/style';
import DrawFeature from '../FeatureFunc/DrawFeature';

const MapComponents = () => {
  const [map, setMap] = useState(null);
  const [drawLayer, setDrawLayer] = useState(null);
  const [drawInteraction, setDrawInteraction] = useState(null);
  const [modifyInteraction, setModifyInteraction] = useState(null);
  const [selectInteraction, setSelectInteraction] = useState(null);

  useEffect(() => {

    const initialMap = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    const drawSource = new VectorSource();
    const drawVectorLayer = new VectorLayer({
      source: drawSource,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2,
        }),
      }),
    });

    initialMap.addLayer(drawVectorLayer);

    setMap(initialMap);
    setDrawLayer(drawVectorLayer);

    const draw = new Draw({
      source: drawSource,
      type: 'Polygon',
    });

    const modify = new Modify({ source: drawSource });

    const select = new Select();

    initialMap.addInteraction(draw);
    initialMap.addInteraction(modify);
    initialMap.addInteraction(select);

    setDrawInteraction(draw);
    setModifyInteraction(modify);
    setSelectInteraction(select);

    return () => {
      initialMap.removeLayer(drawVectorLayer);
      initialMap.removeInteraction(draw);
      initialMap.removeInteraction(modify);
      initialMap.removeInteraction(select);
    };
  }, [map]);

  const handleDrawPolygon = () => {
    if (drawInteraction) {
      map.removeInteraction(drawInteraction);
    } else {
      map.addInteraction(new Draw({ source: drawLayer.getSource(), type: 'Polygon' }));
    }
  };

  const handleDeletePolygon = () => {
    if (modifyInteraction && selectInteraction) {
      map.removeInteraction(modifyInteraction);
      map.removeInteraction(selectInteraction);
    } else {
      map.addInteraction(new Modify({ source: drawLayer.getSource() }));
      map.addInteraction(new Select());
    }
  };

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      {/* <button onClick={handleDrawPolygon}>Draw Polygon</button> */}
      <button onClick={()=>{
        DrawFeature(map)
      }}>Draw a Polygon</button>
      <button onClick={handleDeletePolygon}>Delete Polygon</button>
    </div>
  );
};

export default MapComponents;
