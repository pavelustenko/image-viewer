import React from "react";
import { css } from "emotion";
import { genRouter } from "controller/generated-router";
import { HashLink } from "@jimengio/ruled-router/lib/dom";
import { DocBlock } from "@jimengio/doc-frame";

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <h3>Doc site for image viewer</h3>
        <DocBlock embed content="Find more on [GitHub](https://github.com/jimengio/image-viewer)." />
      </div>
    );
  }
}
