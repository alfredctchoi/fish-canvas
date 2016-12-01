export const createImage = ({ src, cb }) => {
  const image = new Image();
  image.addEventListener('load', function () {
    cb(image);
  });
  image.src = src;
};

export const readAsDataUrl = ({ file, cb }) => {
  const reader = new FileReader();
  reader.addEventListener('load', function () {
    cb(reader.result)
  });
  reader.readAsDataURL(file);
};