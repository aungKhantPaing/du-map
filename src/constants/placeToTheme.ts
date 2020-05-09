import place_types from './placeType';
import Theme from '@/models/theme';

// COLORS
const colors = {
  vuetifyBlue: '#1976d2',
  libraryBrown: '#795548',
  aiesecRed: '#f85a40',
  hightLightGreen: '#26a69a',
  grassGreen: '#b1c671',
  buildingGray: '#a1a5a5',
};

let kPlaceToTheme: Record<place_types, Theme> = {
  other: { icon: 'mdi-domain', color: 'grey' },

  department: { icon: 'mdi-bank', color: colors.vuetifyBlue },
  canteen: { icon: 'mdi-silverware', color: colors.aiesecRed },
  'bus stop': { icon: 'mdi-bus', color: 'yellow darken-3' },
  library: { icon: 'mdi-library', color: colors.libraryBrown },
  hostel: { icon: 'mdi-bed', color: 'pink' },
  hall: { icon: 'mdi-school', color: 'teal accent-4' },
  office: { icon: 'mdi-domain', color: 'grey' },
  copier: { icon: 'mdi-content-copy', color: 'grey' },
  station: { icon: 'mdi-train', color: 'yellow darken-3' },
  activity: { icon: 'mdi-run', color: 'grey' },
  'herbarium house': { icon: 'mdi-leaf', color: 'green darken-1' },
  atm: { icon: 'mdi-cash-usd', color: 'grey' },
  threatre: { icon: 'mdi-domain', color: 'grey' },
  stadium: { icon: 'mdi-domain', color: 'grey' },
  rc: { icon: 'mdi-domain', color: 'grey' },
  clinic: { icon: 'mdi-hospital', color: 'red' },
};

export default kPlaceToTheme;
