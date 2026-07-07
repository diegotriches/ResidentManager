export interface ApartmentsData {
  id?: number;
  apartment: string;
  ownerName: string;
}

export interface Apartment extends ApartmentsData {
  id: number;
}