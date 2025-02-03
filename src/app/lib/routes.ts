const routes = {
  home: {
    path: "/",
    href: "/",
  },
  faq: {
    path: "#faq",
    href: "#faq",
  },
  cabins: {
    path: "/#cabins",
    href: "/#cabins",
  },
  contact: {
    path: "/contact",
    href: "/contact",
  },
  search: {
    path: "/search",
    href: (from: string, to: string) => `/search?from=${from}&to=${to}`,
  },
  cabin: {
    path: "/cabins/:id",
    href: (id: number, from?: string, to?: string, guests?: string) =>
      `/cabins/${id}${from ? `?from=${from}&to=${to}&guests=${guests}` : ""}`,
  },
};

export default routes;
