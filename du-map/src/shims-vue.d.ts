declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module '*.js';

declare module 'mapbox-gl' {
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
  export default mapboxgl;
}
