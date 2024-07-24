// MapComponent.js
import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Draw from 'ol/interaction/Draw';
import "./Drwa.css"

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const typeSelectRef = useRef(null);
  const draw = useRef(null);
  const source = useRef(new VectorSource({ wrapX: false }));

  useEffect(() => {
    const raster = new TileLayer({
      source: new OSM(),
    });

    const vector = new VectorLayer({
      source: source.current,
    });

    const newMap = new Map({
      layers: [raster, vector],
      target: 'map',
      view: new View({
        center: [-11000000, 4600000],
        zoom: 4,
      }),
    });

    setMap(newMap);

    newMap.on('click', function (evt) {
      console.log(evt.coordinate);
    });

    draw.current = new Draw({
      source: source.current,
      type: 'Point',
    });
    newMap.addInteraction(draw.current);

    return () => {
      newMap.removeInteraction(draw.current);
    };
  }, []);

  const handleChange = () => {
    const value = typeSelectRef.current.value;
    map.removeInteraction(draw.current);
    if (value !== 'None') {
      draw.current = new Draw({
        source: source.current,
        type: value,
      });
      map.addInteraction(draw.current);
    }
  };

  const handleUndoClick = () => {
    draw.current.removeLastPoint();
  };

  return (
    <div>
      <div id="map" className="map"></div>
      <div className="row">
        <div className="col-auto">
          <span className="input-group">
            <label className="input-group-text" htmlFor="type">
              Geometry type:
            </label>
            <select
              ref={typeSelectRef}
              className="form-select"
              id="type"
              onChange={handleChange}
            >
              <option value="Point">Point</option>
              <option value="LineString">LineString</option>
              <option value="Polygon">Polygon</option>
              <option value="Circle">Circle</option>
              <option value="None">None</option>
            </select>
            <input
              className="form-control"
              type="button"
              value="Undo"
              id="undo"
              onClick={handleUndoClick}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
