import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/test-page", "routes/testPage.tsx"),
] satisfies RouteConfig;
