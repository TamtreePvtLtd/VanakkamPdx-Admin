export interface ICateringEnquiries {
  _id: string;
  fullName: string;
  email: string;
  typeOfEvent: string;
  guestCount: number;
  mobileNumber: string;
  message: string;
  eventDate: string;
  isResponse: boolean;
}

export interface IProductPageMenuDropDown {
  _id: string;
  title: string;
  image: string;
  menuType: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  subMenus: any[];
}

export interface IProduct {
  posterURL?: string | File;
  _id?: string;
  title: string;
  itemSizeWithPrice: IItemSizeWithPrice[];
  images: Array<string | File>;
  description: string;
  netWeight: number;
  menu: IProductMenu;
  cateringMenuSizeWithPrice: ICateringMenuSizeWithPrice[];
  servingSizeDescription: string;
  ingredients: string;
  dailyMenuSizeWithPrice: IDailyMenuSizeWithPrice[];
}

export interface IProductMenu {
  _id: string;
  mainMenuIds: string[];
  subMenuIds: string[];
}

export interface IItemSizeWithPrice {
  size: string;
  price: string;
  _id?: string;
}
export interface IDailyMenuSizeWithPrice {
  size: string;
  price: string;
  _id?: string;
}

export interface ICateringMenuSizeWithPrice {
  size: string;
  price: string;
  quantity: number;
  _id?: string;
}

export enum ISize {
  LargeTray = "LargeTray",
  MediumTray = "MediumTray",
  SmallTray = "smallTray",
}

export interface ISubmenu {
  title: string;
  description: string;
  _id: string;
}

export interface IPaginationResult<T> {
  items: T[];
  pageInfo: IPageInfo;
}

export interface IPageInfo {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface IOptionTypes {
  id: string;
  label: string;
  value: string;
}

export interface IUser {
  userId: string | null;
  email: string | null;
  name: string | null;
}

export interface ILoginFormInputs {
  email: string;
  password: string;
}

export interface ILoginResponse {
  data: IUser | null;
  message: string;
  status?: boolean;
}

export interface IDinningOutMenus {
  _id: string;
  title: string;
}
export interface IProductWithMenu {
  _id: string;
  title: string;
  products: IDiningOutProduct[];
}

export interface IDiningOutProduct {
  _id: string;
  title: string;
  posterURL?: string;
}
export interface ICreateDiningOutproduct {
  _id: string;
  mainMenuId: string;
  productIds: string[];
}

export interface IDiningOutMenuData {
  _id: string;
  menu: IDiningOutMenu[];
}

export interface IDiningOutMenu {
  mainMenuId: string;
  productIds: string[];
  _id: string;
}
 export interface ISpecial {
  id: string;
   image: string;
   name: string;
   created_at: string

}
