export interface IMenuFormResolver {
  title: string;
  menuType: string;
  subMenus?: ISubMenuFormResolver[];
}

export interface ISubMenuFormResolver {
  title: string;
  }

export interface IMenu {
  _id: string;
  title: string;
  menuType: number;
  subMenus: ISubMenu[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubMenu {
  title: string;
  _id?: string;
}

export interface IMenuFormResolver {
  title: string;
  menuType: string;
  subMenus?: ISubMenuFormResolver[];
}

export interface ISubMenuFormResolver {
  title: string;
}
