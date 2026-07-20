// src/keys/apartmentKeys.ts
export const apartmentKeys = {
  all: ['apartments'] as const,
  lists: () => [...apartmentKeys.all, 'list'] as const,
  details: (id: number) => [...apartmentKeys.all, 'detail', id] as const,
};