import { IRouteRule } from "@jimengio/ruled-router";

export const routerRules: IRouteRule[] = [
  { path: "home" },
  { path: "content" },
  {
    path: "image-viewer",
  },
  { path: "else" },
  { path: "", name: "home" },
];
