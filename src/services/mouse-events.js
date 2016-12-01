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