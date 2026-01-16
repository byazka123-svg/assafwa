
export interface StrapiImage {
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface Category {
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  documentId?: string;
  name: string;
  description: string;
  price: number;
  image?: StrapiImage;
  category?: Category;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  cartKey?: string;
}

export interface StrapiResponse<T> {
  data: T[];
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
