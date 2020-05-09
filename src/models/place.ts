import place_types from '@/constants/placeType';

export class Place implements Feature {
  id: string;
  type: string = 'Feature';
  properties: Properties;
  geometry: Geometry;

  constructor({
    id = '',
    geometry = new Geometry(),
    properties = new Properties(),
    generateID = false,
  }) {
    this.id = generateID ? this.generateID() : id;
    this.properties = properties;
    this.geometry = geometry;
  }

  static parse(dynamic: any): Place {
    return new Place({
      id: dynamic.id.toString(),
      geometry: Geometry.parse(dynamic.geometry),
      properties: Properties.parse(dynamic.properties),
    });
  }

  private generateID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      })
      .replace(/-/g, '');
  }
}

export class Geometry {
  coordinates: [number, number];
  type: string = 'Point';

  constructor(coordinates: [number, number] = [0, 0]) {
    this.coordinates = coordinates;
  }

  static parse(dynamic: any): Geometry {
    return {
      coordinates: [
        Number.parseFloat(dynamic.coordinates[0]),
        Number.parseFloat(dynamic.coordinates[1]),
      ],
      type: 'Point',
    };
  }
}

export class Properties {
  id: string;
  type: place_types;
  name: string;
  name_zg: string;
  open_hours: { from: string | null; to: string | null } | null;
  population: Population | null;
  phones: string[] | null;
  note: string;
  buildings: string[];

  constructor(
    id: string = '',
    type: place_types = place_types.other,
    name: string = '',
    name_zg: string = '',
    open_hours: OpenHours | null = new OpenHours(),
    phones: string[] | null = [],
    population: Population | null = new Population(),
    note: string = '',
    building: string[] = [''],
  ) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.name_zg = name_zg;
    this.open_hours = open_hours;
    this.phones = phones;
    this.population = population;
    this.note = note;
    this.buildings = building;
  }

  static parse(dynamic: any): Properties {
    return new Properties(
      dynamic.id.toString(),
      dynamic.type.toString(),
      dynamic.name.toString(),
      dynamic.name_zg.toString(),
      dynamic.open_hours ? OpenHours.parse(JSON.parse(dynamic.open_hours)) : null,
      dynamic.phones ? dynamic.phones : null,
      dynamic.population ? Population.parse(JSON.parse(dynamic.population)) : null,
      dynamic.note || '',
      dynamic.buildings
        ? (dynamic.buildings.toString() as string).split(',').map((s) => s.trim())
        : [''],
    );
  }
}

export class Population {
  teacher: number | null;
  student: number | null;

  constructor(teacher: number | null = null, student: number | null = null) {
    this.teacher = teacher;
    this.student = student;
  }

  static parse(dynamic: any): Population {
    return {
      teacher: dynamic.teacher ? Number.parseInt(dynamic.teacher) : null,
      student: dynamic.student ? Number.parseInt(dynamic.student) : null,
    };
  }
}

export class OpenHours {
  from: string | null;
  to: string | null;

  constructor(from: string | null = null, to: string | null = null) {
    this.from = from;
    this.to = to;
  }

  static parse(dynamic: any): OpenHours {
    return {
      from: dynamic.from ? dynamic.from : null,
      to: dynamic.to ? dynamic.to : null,
    };
  }
}

// Generics
export interface Feature {
  id: string;
  type: string;
  properties: Object;
  geometry: Object;
}

export interface FeatureList {
  type: string;
  features: Feature[];
}
