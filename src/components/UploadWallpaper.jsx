import React, { useState } from "react";
import { ImageUpload } from "react-ipfs-uploader";

export function UploadWallpaper(props) {
  return (
    <div>
      <ImageUpload setUrl={props.setImageUrlHandler} />
    </div>
  );
};
