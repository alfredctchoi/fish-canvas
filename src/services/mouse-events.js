export const getCanvasMousePosition = ({ clientX, clientY, canvas }) => {
  const { offsetLeft, offsetTop } = canvas;
  return {
    x: clientX - offsetLeft,
    y: clientY - offsetTop
  }
};

export const isFishClicked = ({ x, y, fish }) => {
  return x > fish.x &&
    x < fish.x + fish.width &&
    y > fish.y &&
    y < fish.y + fish.height;
};

export const getResizeProp = ({ x, y, fish }) => {
  const { resizeAnchors } = fish;
  for (let anchor in resizeAnchors) {
    if (!resizeAnchors.hasOwnProperty(anchor)) continue;
    const { top, left, right, bottom } = resizeAnchors[ anchor ];
    if (x > left && x < right && y > top && y < bottom) {
      return anchor;
    }
  }

  return null;
};

export const isRotateClicked = ({ x, y, fish }) => {
  const { rotateAnchors } = fish;
  for (let anchor in rotateAnchors) {
    if (!rotateAnchors.hasOwnProperty(anchor)) continue;
    const { top, left, right, bottom } = rotateAnchors[ anchor ];
    if (x > left && x < right && y > top && y < bottom) {
      return true;
    }
  }

  return false;
};