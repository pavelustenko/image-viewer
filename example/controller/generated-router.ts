import queryString from "query-string";

type Id = string;

function switchPath(x: string) {
  location.hash = `#${x}`;
}

function qsStringify(queries: { [k: string]: string }) {
  return queryString.stringify(queries);
}

// generated

export let genRouter = {
  home: {
    name: "home",
    raw: "home",
    path: () => `/home`,
    go: () => switchPath(`/home`),
  },
  content: {
    name: "content",
    raw: "content",
    path: () => `/content`,
    go: () => switchPath(`/content`),
  },
  imageViewer: {
    name: "image-viewer",
    raw: "image-viewer",
    path: () => `/image-viewer`,
    go: () => switchPath(`/image-viewer`),
  },
  closeOnBackdrop: {
    name: "close-on-backdrop",
    raw: "close-on-backdrop",
    path: () => `/close-on-backdrop`,
    go: () => switchPath(`/close-on-backdrop`),
  },
  else: {
    name: "else",
    raw: "else",
    path: () => `/else`,
    go: () => switchPath(`/else`),
  },
  _: {
    name: "home",
    raw: "",
    path: () => `/`,
    go: () => switchPath(`/`),
  },
};
