export interface ContentInterface {
  _id:string,
  title?: string;
  content?: string;
  trail?: string;
  order?:Number;
  createdAt?:string;
  updatedAt?:string;
  __v?:string;
}

export class UpdateContentsOrderDto {
  contents: ContentInterface[];
}