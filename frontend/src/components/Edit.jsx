import React, { useEffect ,useState,useRef} from 'react'
import axios from "axios";

import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import VectorLayer from 'ol/layer/Vector.js';
import { OSM } from "ol/source";

import { Tile as TileLayer } from "ol/layer";
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import "./Drwa.css";
import {
  Modify,
  Select,
  defaults as defaultInteractions,
} from 'ol/interaction.js';
import {fromLonLat} from 'ol/proj.js';
import { transform } from "ol/proj";


const Edit = () => {

//  for locally store the updated geojson
  // const[geoJSONdata,setgeoJSONdata] = useState([])
  // let GEOJSONOBJ;
  
  
  const mapRef = useRef();
    const [url, setURL] = useState([]);
    const [mapvar,setmap]= useState({})

  
  
    // setting the data center of the parcel
    //  const [centerCoor ,setCenterCoor]= useState()


    // useEffect(()=>{
    //   const geoJSONobj = localStorage.getItem('geoJSONObject');
    //   GEOJSONOBJ = JSON.parse(geoJSONobj)

    //    setgeoJSONdata(GEOJSONOBJ)
    //   console.log(geoJSONdata,"geoJSONobjjjjjjjjjjjj")
     
    // },[])



    useEffect(() => {
    
      // const value = localStorage.getItem('geoJSONObject');
      // if (value == null) {

        console.log("API calls")
        axios
          .get("api/parcel")
          .then((res) => {
           
    
            setURL(res.data);

            // storing data locally , key geoJSONObject and value is res.data 
            // localStorage.setItem('geoJSONObject', JSON.stringify(res.data));

            // but we have to use the usestate to get data for checking


            console.log("run1")
            //  localStorage.setItem('geoJSONObject', JSON.stringify(res.data));
             console.log("run2")

                
    
           
            // setCenterCoor(res.data.features[0].geometry.coordinates[0][0][14])
            // console.log(res.data.features[0].geometry.coordinates[0][0][7] , " coordinate value")
    
           
          })
          .catch((e) => {
            console.log(e);
          });

        //  }
      }, []);

      // useEffect(()=>{
      //    console.log(url,"only in  urlss ")
      //   console.log(geoJSONdata,"geoJSONdata")
      // },[url,geoJSONdata])



    useEffect(()=>{
       console.log("run")
        if (url.length === 0) return;
        //  console.log(url,"urllllllllllll")

        if (mapRef.current) {
          // console.log(url,"aaaaaaurllllllllllll")
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
        


        //  getting data from the localStorage
        // const geoJSONobj = localStorage.getItem('geoJSONObject');
        // let GEOJSON = JSON.parse(geoJSONobj)

        // console.log(geoJSONdata ,"geoJSONobkkkkkkkkkkkkkk")

        const vectorSource = new VectorSource({
            // wrapX: false,
            format: new GeoJSON(),
            features: new GeoJSON().readFeatures(url, {
              dataProjection: "EPSG:4326",
              featureProjection: "EPSG:3857",
            }),
          });
          
    
          const vector = new VectorLayer({
            source: vectorSource,
             style: styleFunction,
          });


        // const vector = new VectorLayer({
        //     background: 'white',
        //     source: new VectorSource({
        //       url: url,
        //       format: new GeoJSON(),
              
        //     }),
        //   });
          
          const select = new Select({
            wrapX: false,
          });
          
          const modify = new Modify({
            features: select.getFeatures(),
          });
          
         const  map = new Map({
            interactions: defaultInteractions().extend([select, modify]),
            layers: [new TileLayer({
                source: new OSM(),
              }),vector ],
            target: mapRef.current,
            view: new View({
              center: fromLonLat([-100, 38.5]),
              zoom: 4,
            }),
          });
          // console.log(map,"map affter edit") 
           

          setmap(map);
          console.log(mapvar,"mapvar affter edit")

          map.getView().animate(
            { zoom: 17 },
            { duration: 1000 },
            {
              center: transform(
                [-77.3065055, 38.9499497],     // [-77.3065055, 38.9499497] previous center value .... which can be get from the lat,long of data 
                "EPSG:4326",
                "EPSG:3857"
              ),
            }
          );
        }
          
        },  [url,mapRef]);

  return (
    <div id='map'  ref={mapRef}>Edit</div>
  )
}

export default Edit