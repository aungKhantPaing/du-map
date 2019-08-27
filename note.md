# Mapbox
## Layers
Map is styled with _layers_. Each layer contains data retrieved from data _tilesets_. Tilesets can be easily created by converting from _datasets_.
> `datasets` > `tilesets` > `data for layers`
```javascript
// basic structure of a layer
"layers": [
  {
    "id": "water",
    "source": "mapbox-streets",
    "source-layer": "water", // tilesets name
    "type": "fill", // data type
    "paint": { // paint can be different base on the data type
      "fill-color": "#00ffff"
    }
  }
]
```
Layers also have particular data type: 
1. `fill` A filled polygon with an optional stroked border
2. `fill-extrusion` An extruded (3D) polygon
3. `line` A stroked line
4. `circle` A filled circle
5. `symbol` An icon or a text label
6. `heatmap` A heatmap

