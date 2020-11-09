import React, { useState } from "react";
import { css, cx } from "emotion";

import ImageViewer from "../../src/image-viewer";
import { DocDemo } from "@jimengio/doc-frame";

export default function DemoImageViewer() {
  let [visible, setVisible] = useState(false);

  return (
    <div className={styleContainer}>
      <DocDemo title="Load image" link="https://github.com/jimengio/image-viewer/blob/master/example/pages/demo-image-viewer.tsx">
        <button
          onClick={() => {
            setVisible(!visible);
          }}
        >
          Show image
        </button>
      </DocDemo>

      <ImageViewer
        visible={visible}
        // imageUrl={"http://192.168.1.180:8080/wallpaper/lamp.jpg"}
        // imageUrl={"http://fe.jimu.io/logo/jimeng-360x360.png"}
        // imageUrl={"http://img1.iyiou.com/Editor/image/20160805/1470365447135769.jpg"}
        // imageUrl={"http://localhost:8080/test.png"}
        // imageUrl={"https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Proton_Zvezda_crop.jpg/300px-Proton_Zvezda_crop.jpg"}
        imageUrl={"http://cache.house.sina.com.cn/citylifehouse/citylife/de/26/20090508_7339__.jpg"}
        onClose={() => {
          setVisible(false);
        }}
        hasLeftOne={false}
        hasRightOne={false}
      />
    </div>
  );
}

const styleContainer = css`
  padding: 16px;
`;
