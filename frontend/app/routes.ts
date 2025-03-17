import { type RouteConfig, index, route} from "@react-router/dev/routes";

export default 
[index("routes/home.tsx"),
 route("/auth", "routes/Auth.tsx"),
 route("/dashboard", "routes/dashboard.tsx"),
 route("/summoner", "routes/summoner.tsx")



] satisfies RouteConfig;
