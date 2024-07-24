import React, { useEffect, useRef, useState } from 'react'
import './Drwa.css'
import Draw from 'ol/interaction/Draw.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

const DrawFunctionality = () => {

  const del = useRef(null)
  
  const[draw,setdraw] = useState(null);

  const styles = new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.5)',
      lineDash: [10, 10],
      width: 2,
    }),
    image: new CircleStyle({
      radius: 5,
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
    }),
  });

  function addInteraction() {
          
        
    const    newdraw = new Draw({
         source: source,
         type: "Polygon",
         style: styles
       });
       return newdraw
      
     
   }
    useEffect(()=>{
        
        const raster = new TileLayer({
            source: new OSM(),
          });
          
          const source = new VectorSource({wrapX: false});
          


          const vector = new VectorLayer({
            source: source,
            style: {
              'fill-color': 'rgba(255, 255, 255, 0.2)',
              'stroke-color': '#ffcc33',
              'stroke-width': 2,
              'circle-radius': 7,
              'circle-fill-color': '#ffcc33',
            },
          });
        //   const vector = new VectorLayer({
        //     source: source,
        //   });
         
        const map = new Map(
            {
                layers: [raster, vector],
                target: 'map',
                view: new View({
                  center: [-11000000, 4600000],
                  zoom: 4,
                })
           })


        //    Drwa code
       
        

       // global so we can remove it later
          const newdraw =  addInteraction()
          map.addInteraction(newdraw);
          setdraw(newdraw)


        // function addInteraction() {
           
          
        //       draw = new Draw({
        //         source: source,
        //         type:        ,
                
        //       });
        //       map.addInteraction(draw);
            
        //   }

        //   addInteraction()


        //    const map = new Map({
        //     view: new View({
        //       center: [0, 0],
        //       zoom: 1,
        //     }),
        //     layers: [
        //       new TileLayer({
        //         source: new OSM(),
        //       }),
        //     ],
        //     target: 'map',
        //   });

    },[])

    ////////////////////////

    // const typeSelect = document.getElementById('type');

  
    
    /**
     * Handle change event.
     */
    // typeSelect.onchange = function () {
    //   map.removeInteraction(draw);
    //   addInteraction();
    // };
    
    // document.getElementById('undo').addEventListener('click', function () {
    //   draw.removeLastPoint();
    // });
    
    



////////////////////////////
   
    function draww(e){
        console.log("draw clicked")
        console.log(e.target)
        addInteraction()
        

       }
    function edit(){
        console.log("edit clicked")
       }
    function deleteFunc(){
        draw.removeLastPoint();
        console.log("delete clicked")
       }

  return (
    <>
        <div id='map' className='wrapper'>
           
        </div>
        <div id='btndiv'>
                <button onClick={draww}  >Draw</button>
                <button onClick={edit} >Edit</button>
                <button onClick={deleteFunc}  ref={del}>Delete</button>
               
               
            </div>
    </>
  )
}

export default DrawFunctionality