export const queryKeys = {
  apartments: {
    all: ["apartments"] as const,
    lists: () => [...queryKeys.apartments.all, "list"] as const,
    details: (id: number) =>
      [...queryKeys.apartments.all, "detail", id] as const,
  },
  meters: {
    all: ["meters"] as const,
    byDate: (month: number, year: number) =>
      [...queryKeys.meters.all, "by-date", { month, year }] as const,
    report: (month: number, year: number) =>
      [...queryKeys.meters.all, "report", { month, year }] as const,
  },
};
