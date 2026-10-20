export interface DailyStats {
  fechaHoy: string;
  fechaAyer: string;
  fechaMes: string;
  totalMonitoreados: number;
  conVarDia: number;
  varDiaGeneral: number;
  varMesGeneral: number;
  subieronDia: number;
  bajaronDia: number;
  igualesDia: number;
}

export interface CategoryStat {
  categoria: string;
  totalProductos: number;
  peso: number;
  varDia: number;
  varMes: number;
  subieron: number;
  bajaron: number;
  iguales: number;
}

export interface ProductMover {
  id: string;
  nombre: string;
  categoria: string;
  url: string;
  precioHoy: number;
  precioAyer: number;
  varDia: number;
}

export interface DashboardData {
  stats: DailyStats;
  categorias: CategoryStat[];
  topSubas: ProductMover[];
  topBajas: ProductMover[];
}

export interface ProductSearchResult {
  id: string;
  nombre: string;
  categoria: string;
  url: string;
  precioActual: number;
  varDia: number | null;
  imagenUrl?: string | null;
}

export interface PricePoint {
  fecha: string;
  precio: number;
}
