## Image Viewer Component

> for zooming/rotating images.

Not yet:

- animations
- dragging

### Usage

```tsx
import { ImageViewer } from "@jimengio/meson-display";

<ImageViewer
  visible={visible}
  imageUrl={"http://cache.house.sina.com.cn/citylifehouse/citylife/de/26/20090508_7339__.jpg"}
  onClose={() => {
    setVisible(false);
  }}
  hasLeftOne={false}
  hasRightOne={false}
/>;
```

### Workflow

https://github.com/jimengio/ts-workflow

### License

MIT
