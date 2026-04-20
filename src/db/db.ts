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
  createdAt: number;
}

export interface Settings {
  id?: number;
  key: string;
  value: any;
}

export class MyDatabase extends Dexie {
  orders!: Table<Order>;
  settings!: Table<Settings>;

  constructor() {
    super('ProfitMasterDB');
    this.version(1).stores({
      orders: '++id, personName, productName, createdAt',
      settings: '++id, key'
    });
  }
}

export const db = new MyDatabase();
