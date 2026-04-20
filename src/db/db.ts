import Dexie, { type Table } from 'dexie';

export interface Order {
  id?: number;
  personName: string;
  productName: string;
  quantity: number;
  costPrice: number;
  salePrice: number;
  logisticsCost: number;
  totalSalePrice: number;
  netProfit: number;
  notes?: string; // 자유로운 메모 필드 추가
  createdAt: number;
}

export interface Product {
  id?: number;
  name: string;
  image?: string; // base64
  costPrice: number;
  salePrice: number;
  logisticsCost: number;
  additionalCost: number;
  quantity: number;
  createdAt: number;
}

export interface Settings {
  id?: number;
  key: string;
  value: any;
}

export class MyDatabase extends Dexie {
  orders!: Table<Order>;
  products!: Table<Product>;
  settings!: Table<Settings>;

  constructor() {
    super('ProfitMasterDB');
    this.version(3).stores({
      orders: '++id, personName, productName, createdAt',
      products: '++id, name, createdAt',
      settings: '++id, key'
    });
  }
}

export const db = new MyDatabase();
