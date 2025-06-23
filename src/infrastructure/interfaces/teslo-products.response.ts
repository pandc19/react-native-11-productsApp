export interface TesloProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: string[];
  gender: Gender;
  tags: string[];
  images: string[];
  user: TesloUser;
}

export enum Gender {
  Kid = 'kid',
  Men = 'men',
  Unisex = 'unisex',
  Women = 'women',
}

export enum Size {
  L = 'L',
  M = 'M',
  S = 'S',
  XL = 'XL',
  XXL = 'XXL',
  XXXL = 'XXXL',
}

export interface TesloUser {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
}
