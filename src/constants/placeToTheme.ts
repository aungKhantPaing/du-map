import place_types from './placeType';
import Theme from '@/models/theme';

// COLORS
const colors = {
  vuetifyBlue: '#1976d2',
  libBrown: '#795548',
  aiesecRed: '#f85a40',
};

let kPlaceToTheme: Record<place_types, Theme> = {
  other: { icon: 'mdi-domain', color: 'grey' },

  department: { icon: 'mdi-bank', color: colors.vuetifyBlue },
  canteen: { icon: 'mdi-silverware', color: colors.aiesecRed },
  'bus stop': { icon: 'mdi-bus', color: 'yellow darken-3' },
  library: { icon: 'mdi-library', color: colors.libBrown },
  hostel: { icon: 'mdi-hotel', color: 'pink' },
  hall: { icon: 'mdi-school', color: 'teal accent-4' },
  office: { icon: 'mdi-domain', color: 'grey' },
  copier: { icon: 'mdi-content-copy', color: null },
  station: { icon: 'mdi-train', color: 'yellow darken-3' },
  activity: { icon: 'mdi-run', color: null },
  'herbarium house': { icon: 'mdi-leaf', color: 'green darken-1' },
  atm: { icon: 'mdi-cash-usd', color: 'grey' },
  threatre: { icon: 'mdi-domain', color: 'grey' },
  stadium: { icon: 'mdi-domain', color: 'grey' },
  rc: { icon: 'mdi-domain', color: 'grey' },
};

export default kPlaceToTheme;
