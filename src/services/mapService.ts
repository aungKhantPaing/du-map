/* eslint-disable no-console */
import mapboxgl from 'mapbox-gl';
import { Place } from '@/models/place';
import router from '@/router/index';

export default class MapService {
  mapbox: mapboxgl.Map;
  private _show_zoom_control: boolean;
  private _show_location_control: boolean;

  private _marker = new mapboxgl.Marker({
    color: '#F85A40', // red
  });

  constructor(
    mapbox: mapboxgl.Map,
    show_zoom_control: boolean = true,
    show_location_control: boolean = true,
  ) {
    this.mapbox = mapbox;
    this._show_zoom_control = show_zoom_control;
    this._show_location_control = show_location_control;
    this._config();
  }

  // dirty data -> filter -> sort -> clean data
  getPlaces(): Array<Place> {
    // query dirty list data from map
    let sourceFeatures = this.mapbox.querySourceFeatures('composite', {
      sourceLayer: 'DU_Places_New', // require if sourceLayer is a vector_tileset
    });

    console.log('SOURCE FEATURES');
    console.log(sourceFeatures);

    // filter duplicated data
    sourceFeatures.forEach((targetPlace) => {
      var duplicatedItems: any[] = [];
      sourceFeatures.forEach((place) => {
        if (
          JSON.stringify(targetPlace.properties) === JSON.stringify(place.properties) && // compare primitive data
          targetPlace != place // compare reference data
        ) {
          duplicatedItems.push(place); // get the duplicates
        }
      });
      // remove the duplicatedItem(s) of targetPlace
      duplicatedItems.forEach((item) => {
        var itemIndex = sourceFeatures.indexOf(item);
        sourceFeatures.splice(itemIndex, 1);
      });
    });

    // sort alphabetically
    sourceFeatures.sort(compare);
    function compare(a: any, b: any) {
      var aString = '' + a.properties.name; // cast to unicode
      var bString = '' + b.properties.name;

      if (aString < bString) return -1;
      else if (aString > bString) return 1;

      return 0;
    }

    return sourceFeatures.map((feature) => Place.parse(feature));
  }

  private _config(): void {
    //* 🎮 add controls
    // Add zoom, rotation and location controls to the map.
    const zoomControl = new mapboxgl.NavigationControl({
      visualizePitch: true,
    });
    const locationControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      fitBoundsOptions: {
        // offset: [0,-5.7], // for desktop
        offset: [0, -3.5], // for mobiles
        zoom: 15,
      },
    });
    if (this._show_zoom_control) this.mapbox.addControl(zoomControl);
    if (this._show_location_control) this.mapbox.addControl(locationControl);

    //* 📡 set cursor events
    // change the cursor to pointer 👆 when the it enters a feature in the 'symbols' layer.
    this.mapbox.on('mouseenter', 'poi-label-places', () => {
      this.mapbox.getCanvas().style.cursor = 'pointer';
    });
    // change it back to a cursor when it leaves.
    this.mapbox.on('mouseleave', 'poi-label-places', () => {
      this.mapbox.getCanvas().style.cursor = '';
    });

    //* 📡 set on-click events
    this.mapbox.on('click', (_) => {
      this._removeHighlight();
    });
    // highlight when user specifically click/tap place icon
    this.mapbox.on('click', 'poi-label-places', (e) => {
      if (e.features) {
        let place = Place.parse(e.features[0]);
        this._highlightPlace(place);
      }
    });

    this.mapbox.touchZoomRotate.enableRotation();
    this._marker.setLngLat([0, 0]).addTo(this.mapbox);
  }

  private _removeHighlight() {
    this._marker.remove();
    this.mapbox.setFilter('building-3d-highlighted', ['in', 'id', '']); // remove highlight
    if (router.currentRoute.name != 'home') router.replace('/');
  }

  private _highlightPlace(place: Place) {
    this._marker.remove(); // remove default-marker from this.mapboxbox.js
    try {
      this._marker.setLngLat(place.geometry.coordinates).addTo(this.mapbox); // pin the marker
    } catch (error) {
      console.log(place);
    }
    this.mapbox.flyTo({
      center: place.geometry.coordinates,
      zoom: 18,
    });

    // highlight the 3d structure by filtering with equal id
    this.mapbox.setFilter('building-3d-highlighted', ['in', 'id', place.properties.id]);

    router.push(`/place/${place.properties.id}`);
  }
}
