import place_types from '@/constants/placeType';
import { Place } from '@/models/place';

export default class PlaceGroup {
  readonly name: string;
  readonly types: place_types[];
  readonly icon: string;
  placeList: Place[] = [];

  constructor(name: string, types: place_types[] = [], icon: string = '') {
    this.name = name;
    this.types = types;
    this.icon = icon;
  }
}
