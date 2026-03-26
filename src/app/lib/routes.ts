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
    path: "#contact",
    href: "#contact",
  },
  reservas: {
    path: "/#search",
    href: "/#search",
  },
  search: {
    path: "/search",
    href: (from: string, to: string) => `/search?from=${from}&to=${to}`,
  },
  cabin: {
    path: "/cabins/:id",
    href: (id: string | number, from?: string, to?: string, guests?: string) =>
      `/cabins/${id}${from ? `?from=${from}&to=${to}&guests=${guests}` : ""}`,
  },
  campamentos: {
    path: "/campamentos",
    href: "/campamentos",
  },
  camp: {
    path: "/campamentos/camp",
    href: "/campamentos/camp",
  },
  camping: {
    path: "/campamentos/camping",
    href: "/campamentos/camping",
  },
  sanJose: {
    path: "/campamentos/san-jose",
    href: "/campamentos/san-jose",
  },
  organico: {
    path: "/organico",
    href: "/organico",
  },
  celebracion: {
    path: "/celebracion",
    href: "/celebracion",
  },
  empresarial: {
    path: "/empresarial",
    href: "/empresarial",
  },
  natura: {
    path: "/natura",
    href: "/natura",
  },
  kids: {
    path: "/kids",
    href: "/kids",
  },
  experiencias: {
    path: "/experiencias",
    href: "/experiencias",
  },
  bienesRaices: {
    path: "/bienes-raices",
    href: "/bienes-raices",
  },
};

export default routes;
