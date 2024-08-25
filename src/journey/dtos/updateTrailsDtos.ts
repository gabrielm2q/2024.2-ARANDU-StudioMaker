export interface TrailInterface {
    _id: string;
    name: string;
    journey: string;
    order?: number;
}

export class UpdateTrailsDtos {
  trails: TrailInterface[];
}
