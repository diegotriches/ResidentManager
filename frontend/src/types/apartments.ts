export interface ApartmentsData {
  id?: number;
  number: number;
  ownerName: string;
}

export interface Apartment extends ApartmentsData {
  id: number;
}