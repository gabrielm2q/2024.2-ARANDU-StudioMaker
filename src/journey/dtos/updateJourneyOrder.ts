export interface JourneyInterface {
  _id:string,
  title: string;
  createdAt:string;
  updatedAt:string;
  __v:string;
  trails?:string[];
  description: string;
  user?: string;
  order:Number;
}

export class UpdateJourneysDtos {
  journeys: JourneyInterface[];
}