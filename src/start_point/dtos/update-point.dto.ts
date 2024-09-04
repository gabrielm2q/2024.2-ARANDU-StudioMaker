export interface UpdatePointInterface {
    _id: string;
    name: string;
    description?: string;
    user?: string;
    journeys?: string[];
    order: Number;
    createdAt: string;
    __v: number;
    updatedAt: string;
    journey?: string;
    
  }

export class UpdatePointOrderDto {
    points: UpdatePointInterface[]
}