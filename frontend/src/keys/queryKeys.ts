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
  bills: {
    all: ["bills"] as const,
    byDate: (month: number, year: number) =>
      [...queryKeys.bills.all, "by-date", { month, year }] as const,
  },
  billsCategories: {
    all: ["billsCategories"] as const,
    lists: () =>
      [...queryKeys.billsCategories.all, "lists"] as const,
  },
  utilityBills: {
    all: ["utility-bills"] as const,
    byDate: (month: number, year: number) =>
      [...queryKeys.utilityBills.all, "by-date", { month, year }] as const,
  },
  vouchers: {
    all: ["vouchers"] as const,
    byDate: (month: number, year: number) => ["vouchers", month, year] as const,
  },
};
