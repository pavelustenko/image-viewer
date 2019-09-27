## Image Viewer Component

[![npm](https://img.shields.io/npm/v/@jimengio/image-viewer)](https://www.npmjs.com/package/@jimengio/image-viewer)

> for zooming/rotating images.

original: [meson-display](https://github.com/jimengio/meson-display)

Not yet:

- animations
- dragging

### Usage

```tsx
import { ImageViewer } from "@jimengio/image-viewer";

<ImageViewer
  visible={visible}
  imageUrl={"http://cache.house.sina.com.cn/citylifehouse/citylife/de/26/20090508_7339__.jpg"}
  onClose={() => {
    setVisible(false);
  }}
  hasLeftOne={false}
  hasRightOne={false}
  closeOnBackdrop={false}
/>;
```

### Workflow

https://github.com/jimengio/ts-workflow

### License

MIT
