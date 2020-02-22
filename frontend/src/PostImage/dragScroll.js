export default function dragScroll(draggable, scrollable) {
  let initialScrollX;
  let initialScreenX;
  let initialScrollY;
  let initialScreenY;

  function mouseDownHandler(event) {
    initialScrollX = scrollable.scrollLeft;
    initialScreenX = event.screenX;
    initialScrollY = scrollable.scrollTop;
    initialScreenY = event.screenY;

    draggable.addEventListener('mousemove', scroll);
  }

  function mouseUpHandler() {
    draggable.removeEventListener('mousemove', scroll);
  }

  function scroll(event) {
    scrollable.scrollLeft = initialScrollX - (event.screenX - initialScreenX);
    scrollable.scrollTop = initialScrollY - (event.screenY - initialScreenY);
  }

  function stop() {
    draggable.removeEventListener('mousedown', mouseDownHandler);
    draggable.removeEventListener('mouseup', mouseUpHandler);
  }

  draggable.addEventListener('mousedown', mouseDownHandler);
  draggable.addEventListener('mouseup', mouseUpHandler);

  return {
    stop
  };
}
