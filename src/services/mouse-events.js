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
  const { anchors } = fish;
  for (let anchor in anchors) {
    if (!anchors.hasOwnProperty(anchor)) continue;
    const { top, left, right, bottom } = anchors[ anchor ];
    if (x > left && x < right && y > top && y < bottom) {
      return anchor;
    }
  }

  return null;
};