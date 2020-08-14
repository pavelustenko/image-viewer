import React, { SFC, MouseEvent } from "react";
import { css, cx } from "emotion";
import { immerHelpers, ImmerStateFunc, MergeStateFunc } from "./immer-helper";
import { fullscreen, column, flex, center, rowCenter } from "@jimengio/flex-styles";
import JimoIcon, { EJimoIcon } from "@jimengio/jimo-icons";
import urlParse from "url-parse";

import { CSSTransition, TransitionGroup } from "react-transition-group";
import FaIcon from "@jimengio/fa-icons";
import { EFaIcon } from "@jimengio/fa-icons";

/** no real md5 at current */
let md5 = (x: string) => `${x}`;

enum EOrientation {
  r0 = 0,
  r90 = 1,
  r180 = 2,
  r270 = 3,
}

interface IProps {
  visible: boolean;
  imageUrl: string;
  imageDownloadUrl?: string;
  forcedAutoOrient?: boolean;
  onClose: () => void;

  hasRightOne?: boolean;
  hasLeftOne?: boolean;
  onViewLeft?: () => void;
  onViewRight?: () => void;

  localeEmpty?: string;
  localeFailed?: string;

  closeOnBackdrop?: boolean;

  /** handle download outside */
  onDownloadRequest?: (previewUrl: string) => void;

  /** defaults to 40 */
  imageMinWidth?: number;
  /** defaults to 4000 */
  imageMaxWidth?: number;
}

interface IState {
  isLoading: boolean;
  errorText: string;

  originalWidth: number;
  originalHeight: number;
  width: number;
  height: number;
  rotationCaches: { [urlMd5: string]: EOrientation };
}

export let imageViewMines = ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/webp"];

export default class ImageViewer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isLoading: true,
      errorText: undefined,
      originalWidth: 0,
      originalHeight: 0,
      width: 0,
      height: 0,
      rotationCaches: {},
    };
  }

  immerState = immerHelpers.immerState as ImmerStateFunc<IState>;
  mergeState = immerHelpers.mergeState as MergeStateFunc<IState>;

  componentDidMount() {
    if (this.props.visible) {
      this.loadImage();
    }

    window.addEventListener("keydown", this.onWindowKeydown);
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    let turnedVisible = this.props.visible && !prevProps.visible;
    let changedUrl = this.props.imageUrl !== prevProps.imageUrl;
    if (turnedVisible || changedUrl) {
      // during close animations
      if (this.props.imageUrl != null) {
        this.loadImage();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onWindowKeydown);
  }

  render() {
    // styles defined in global.css
    return (
      <TransitionGroup className={styleAnimations}>
        {this.props.visible ? (
          <CSSTransition classNames="fading-viewer" timeout={{ enter: 240, exit: 240 }}>
            {this.renderPopup()}
          </CSSTransition>
        ) : null}
      </TransitionGroup>
    );
  }

  renderPopup() {
    let currentRotation = this.state.rotationCaches[md5(this.props.imageUrl)] || 0;

    let r90 = currentRotation === EOrientation.r90 || currentRotation === EOrientation.r270;
    let { width, height } = this.state;

    return (
      <div
        className={cx(fullscreen, column, styleContainer)}
        onClick={() => {
          if (this.props.closeOnBackdrop) {
            this.props.onClose();
          }
        }}
      >
        <div className={cx(flex, stylePreviewArea)}>
          {this.state.isLoading ? (
            this.renderLoading()
          ) : this.state.errorText != null ? (
            this.renderError()
          ) : (
            <div className={styleImageContainer}>
              <div style={{ width: r90 ? height : width, height: r90 ? width : height, overflow: "hidden" }} onClick={this.stopPropagation}>
                <img
                  src={this.getImageUrl()}
                  className={styleImage}
                  style={{
                    transformOrigin: "center",
                    // translate to get a correct rotation origin, which the center of image
                    transform: `${r90 ? `translate(${(height - width) / 2}px, ${(width - height) / 2}px) ` : ""}rotate(${currentRotation * 90}deg)`,
                  }}
                  width={this.state.width}
                  height={this.state.height}
                />
              </div>
            </div>
          )}
          {this.props.hasLeftOne ? this.renderLeftIcon() : null}
          {this.props.hasRightOne ? this.renderRightIcon() : null}
        </div>
        {/* TODO space */}

        <div className={cx(center, styleFooterArea)}>
          <div className={cx(rowCenter, styleToolbar)} onClick={this.stopPropagation}>
            <JimoIcon
              className={styleIcon}
              name={EJimoIcon.zoomIn}
              onClick={() => {
                this.scaleImageResize(1.41);
              }}
            />
            <JimoIcon
              className={styleIcon}
              name={EJimoIcon.zoomOut}
              onClick={() => {
                this.scaleImageResize(0.71);
              }}
            />
            <JimoIcon
              className={styleIcon}
              name={EJimoIcon.fullscreen}
              onClick={() => {
                window.open(this.getImageUrl());
              }}
            />
            <FaIcon className={styleIcon} name={EFaIcon.RotateRight} onClick={this.rotate} />
            <JimoIcon
              className={styleIcon}
              name={EJimoIcon.download}
              onClick={(event) => {
                if (this.props.onDownloadRequest != null) {
                  this.props.onDownloadRequest(this.props.imageDownloadUrl || this.getImageUrl());
                } else {
                  downloadFile(this.props.imageDownloadUrl || this.getImageUrl(), this.props.localeEmpty || "Empty");
                }
              }}
            />
          </div>
        </div>

        {this.props.closeOnBackdrop ? null : <JimoIcon name={EJimoIcon.slimCross} className={styleClose} onClick={this.props.onClose} />}
      </div>
    );
  }

  renderLoading() {
    return <JimoIcon name={EJimoIcon.loading} className={styleLoading} />;
  }

  renderError() {
    return <div className={styleError}>{this.state.errorText}</div>;
  }

  renderLeftIcon() {
    return (
      <div
        className={styleArrowIcon}
        onClick={(event) => {
          event.stopPropagation();
          this.props.onViewLeft;
        }}
      >
        <FaIcon name={EFaIcon.ArrowCircleLeft} />
      </div>
    );
  }

  renderRightIcon() {
    return (
      <div
        className={cx(styleArrowIcon, styleArrowRight)}
        onClick={(event) => {
          event.stopPropagation();
          this.props.onViewRight();
        }}
      >
        <FaIcon name={EFaIcon.ArrowCircleRight} />
      </div>
    );
  }

  getImageUrl() {
    if (this.props.forcedAutoOrient) {
      let urlObj = urlParse(this.props.imageUrl, true);
      urlObj.query["x-process"] = "image/auto-orient,1";
      return urlObj.toString();
    } else {
      return this.props.imageUrl;
    }
  }

  loadImage() {
    this.mergeState({ isLoading: true });
    let img = new Image();
    img.src = this.getImageUrl();
    img.onerror = (error: ErrorEvent) => {
      console.error(error);
      this.mergeState({
        isLoading: false,
        errorText: this.props.localeFailed || "Failed",
      });
    };

    img.onload = async () => {
      // if the images has size rotation, calculate differently
      let currentRotation = this.state.rotationCaches[md5(this.props.imageUrl)] || 0;
      let whSwapped = this.isWhSwapped(currentRotation);
      let initialSizes = this.initialImageResize(img.width, img.height, whSwapped);

      this.mergeState({
        isLoading: false,
        errorText: null,
        width: initialSizes.width,
        originalWidth: img.width,
        height: initialSizes.height,
        originalHeight: img.height,
      });
    };
  }

  isWhSwapped(r: EOrientation) {
    return r === EOrientation.r90 || r === EOrientation.r270;
  }

  initialImageResize(originalWidth: number, originalHeight: number, whSwapped: boolean) {
    let fullWidth = window.innerWidth - 80; // some paddings
    let fullHeight = window.innerHeight - 80; // has toolbar at bottom

    if (whSwapped) {
      [originalWidth, originalHeight] = [originalHeight, originalWidth];
    }

    let ret = {
      width: undefined as number,
      height: undefined as number,
    };

    if (originalWidth > fullWidth || originalHeight > fullHeight) {
      if (originalWidth / originalHeight > fullWidth / fullHeight) {
        ret = {
          width: fullWidth,
          height: (fullWidth / originalWidth) * originalHeight,
        };
      } else {
        ret = {
          width: (fullHeight / originalHeight) * originalWidth,
          height: fullHeight,
        };
      }
    } else {
      ret = {
        width: originalWidth,
        height: originalHeight,
      };
    }

    if (whSwapped) {
      return {
        width: ret.height,
        height: ret.width,
      };
    } else {
      return ret;
    }
  }

  scaleImageResize(ratio: number) {
    // limit width to amoung 40~4000 roughly
    if (ratio > 1) {
      if (this.state.width > (this.props.imageMinWidth ?? 4000)) {
        return;
      }
    } else if (ratio < 1) {
      if (this.state.width < (this.props.imageMaxWidth ?? 40)) {
        return;
      }
    }
    this.mergeState({
      width: this.state.width * ratio,
      height: this.state.height * ratio,
    });
  }

  onWindowKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        this.props.onClose();
        break;
      case "ArrowLeft":
        if (this.props.hasLeftOne) {
          this.props.onViewLeft();
        }
        break;
      case "ArrowRight":
        if (this.props.hasRightOne) {
          this.props.onViewRight();
        }
        break;
      default:
      // console.log(event.key);
    }
  };

  rotate = () => {
    let k = md5(this.props.imageUrl);
    let currentRotation = this.state.rotationCaches[k] || 0;

    let nextRotation = this.addToRotation(currentRotation);

    let whSwapped = this.isWhSwapped(nextRotation);
    let initialSizes = this.initialImageResize(this.state.originalWidth, this.state.originalHeight, whSwapped);

    this.immerState((state) => {
      state.rotationCaches[k] = nextRotation;
      state.width = initialSizes.width;
      state.height = initialSizes.height;
    });
  };

  addToRotation(x: EOrientation): EOrientation {
    if (x === EOrientation.r270) {
      return EOrientation.r0;
    } else {
      return x + 1;
    }
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }
}

export let ImageViewerList: SFC<{
  viewIdx: number;
  visible: boolean;
  images: { url: string; downloadUrl: string }[];
  forcedAutoOrient?: boolean;
  onChange: (x: number) => void;
}> = (props) => {
  let idx = props.viewIdx;
  let image = props.images[idx];

  return (
    <ImageViewer
      imageUrl={image?.url}
      imageDownloadUrl={image?.downloadUrl}
      visible={props.visible}
      onClose={() => {
        props.onChange(null);
      }}
      hasLeftOne={idx > 0}
      hasRightOne={idx + 1 < props.images.length}
      onViewLeft={() => {
        let newIdx = idx - 1;
        props.onChange(newIdx);
      }}
      onViewRight={() => {
        let newIdx = idx + 1;
        props.onChange(newIdx);
      }}
    />
  );
};

export function downloadFile(assetUrl: string, emptyLocale: string, fileName?: string) {
  const link = document.createElement("a");
  if (fileName == null) {
    let resource = urlParse(assetUrl);
    let xs = resource.pathname.split("/");
    fileName = xs[xs.length - 1]; // try last piece of url
  }
  link.setAttribute("download", fileName || emptyLocale);
  link.setAttribute("href", assetUrl);
  link.setAttribute("target", "_blank");
  document.body.appendChild(link);
  console.info("Downloading file", fileName || emptyLocale);
  link.click(); // downloads file with same origin, but opens new window for others
  document.body.removeChild(link);
}

const styleContainer = css`
  z-index: 1000;
  background-color: hsl(0, 0%, 0%, 0.7);
  position: fixed;
`;

const styleImageContainer = css`
  padding: 24px;
  margin: auto;
`;

const styleImage = css`
  user-select: none;
`;

const stylePreviewArea = css`
  display: flex;
  overflow: auto;
`;

const styleToolbar = css`
  height: 40px;
  color: white;
  background-color: hsla(0, 0%, 74%, 0.5);
  margin: 60px auto;
  padding: 0 8px;
  border-radius: 3px;
`;

const styleIcon = css`
  font-size: 20px;
  color: white;
  padding: 0 4px;
  margin: 0 12px;
  cursor: pointer;
`;

const styleClose = css`
  position: absolute;
  top: 32px;
  right: 32px;
  font-size: 32px;
  color: hsla(0, 0%, 74%, 1);
  cursor: pointer;
`;

const styleFooterArea = css`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 160px;
  width: 100%;
`;

const styleLoading = css`
  font-size: 32px;
  color: #bdbdbd;
  margin: auto;
  animation: rotation 2s infinite linear;
`;

const styleError = css`
  color: red;
  font-size: 18px;
  margin: auto;
`;

const styleAnimations = css`
  .fading-viewer-enter {
    opacity: 0.01;
  }

  .fading-viewer-enter.fading-viewer-enter-active {
    opacity: 1;
    transition: 240ms;
  }

  .fading-viewer-exit {
    opacity: 1;
  }

  .fading-viewer-exit.fading-viewer-exit-active {
    opacity: 0.01;
    transition: 240ms;
  }
`;

let styleArrowIcon = css`
  position: absolute;
  top: 50%;
  left: 16px;
  z-index: 700;
  color: white;
  font-size: 72px;
  opacity: 0.4;
  cursor: pointer;
  transform: translate(0, -50%);

  &:hover {
    opacity: 0.8;
  }
`;

let styleArrowRight = css`
  right: 16px;
  left: auto;
`;
