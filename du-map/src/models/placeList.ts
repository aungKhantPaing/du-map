import Place from './place';

export class PlaceList {
  readonly type: PlaceType;
  placeList: Place[] = [];

  constructor(type: PlaceType) {
    this.type = type;
  }
}

export class DepartmentList extends PlaceList {
  constructor() {
    super(PlaceType.Department);
  }
}

export class BusStopList extends PlaceList {
  constructor() {
    super(PlaceType.BusStop);
  }
}

export class CanteenList extends PlaceList {
  constructor() {
    super(PlaceType.Canteen);
  }
}

export class CopierList extends PlaceList {
  constructor() {
    super(PlaceType.Copier);
  }
}

export class ActivityList extends PlaceList {
  constructor() {
    super(PlaceType.Activity);
  }
}

export class HostelList extends PlaceList {
  constructor() {
    super(PlaceType.Hostel);
  }
}

export class OtherPlaceList extends PlaceList {
  constructor() {
    super(PlaceType.Other);
  }
}

enum PlaceType {
  Department,
  Canteen,
  BusStop,
  Copier,
  Activity,
  Hostel,
  Other,
}
