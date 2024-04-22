// const express = require('express')
import express from 'express'
const app = express()




app.get('/api/parcel',(req,res)=>{
    const parceldata =
           
         
    {
        "type": "FeatureCollection",
        "crs": {
          "type": "name",
          "properties": {
            "name": "EPSG:3857"
          }
        },
        "features": [
          
          {
            "type": "Feature",
            "geometry": {
              "type": "MultiPolygon",
              
    
              "coordinates": 
              [
                [
                    [
                        [
                            -77.304556,
                            38.94870800000001
                        ],
                        [
                            -77.30523,
                            38.94873899999999
                        ],
                        [
                            -77.305222,
                            38.948893
                        ],
                        [
                            -77.305751,
                            38.948908000000046
                        ],
                        [
                            -77.30595100000001,
                            38.94900799999999
                        ],
                        [
                            -77.306057,
                            38.948879999999974
                        ],
                        [
                            -77.306063,
                            38.94875999999999
                        ],
                        [
                            -77.306684,
                            38.948756
                        ],
                        [
                            -77.306824,
                            38.94880599999996
                        ],
                        [
                            -77.307412,
                            38.948792999999995
                        ],
                        [
                            -77.308165,
                            38.948826000000025
                        ],
                        [
                            -77.30832,
                            38.94885099999999
                        ],
                        [
                            -77.308461,
                            38.948835
                        ],
                        [
                            -77.308399,
                            38.95064099999999
                        ],
                        [
                            -77.307205,
                            38.950563999999986
                        ],
                        [
                            -77.307108,
                            38.951628
                        ],
                        [
                            -77.305287,
                            38.951584999999994
                        ],
                        [
                            -77.305273,
                            38.951536000000004
                        ],
                        [
                            -77.304556,
                            38.94870800000001
                        ]
                    ]
                ]
            ]
              
            }
          }
        ]
      }
    
    
    
    
    

    res.send(parceldata)
})

app.get('/', function (req, res) {
  res.send('server running')
  console.log("server start")
})

app.listen(3000,()=>{ console.log("server ruuning on this 3000")})