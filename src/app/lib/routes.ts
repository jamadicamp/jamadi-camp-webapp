const routes = {
    home: {
        path: "/",
        href: "/"
    },
    whatToDo: {
        path: "/what-to-do",
        href: "/what-to-do"
    },
    cabins: {
        path: "/cabins",
        href: "/cabins"
    },
    contact: {
        path: "/contact",
        href: "/contact"
    },
    search: {
        path: "/search",
        href: (from: string, to: string) => `/search?from=${from}&to=${to}`
    }
}

export default routes;