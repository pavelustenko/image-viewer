import { IRouteRule } from "@jimengio/ruled-router";

export const routerRules: IRouteRule[] = [
  { path: "home" },
  {
    path: "image-viewer",
  },
  {
    path: "close-on-backdrop",
  },
  { path: "else" },
  { path: "", name: "home" },
];
