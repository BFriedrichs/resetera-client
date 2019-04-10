import { Image, ImageStore, ImageEditor } from "react-native";

const getBase64FromImageSource = src => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      src,
      (w, h) => {
        ImageEditor.cropImage(
          src,
          {
            offset: { x: 0, y: 0 },
            size: { width: w, height: h }
          },
          uri => {
            ImageStore.getBase64ForTag(
              uri,
              data => {
                resolve(data);
              },
              err => {
                reject(err);
              }
            );
          },
          err => {
            reject(err);
          }
        );
      },
      err => {
        reject(err);
      }
    );
  });
};

export default getBase64FromImageSource;
