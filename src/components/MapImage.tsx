import React, { useState } from 'react';

import useWindowEvent from '../hooks/useWindowEvent';
import useWindowSize from '../hooks/useWindowSize';
import { clamp } from '../utils';

const imageWidth = 3560;
const imageHeight = 7256;
const imageAspectRatio = imageWidth / imageHeight;

const MapImage = () => {
  const { width, height, aspectRatio } = useWindowSize();
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [temporaryOffsetX, setTemporaryOffsetX] = useState(0);
  const [temporaryOffsetY, setTemporaryOffsetY] = useState(0);

  let scale = zoom;
  let paddingX = 0;
  let paddingY = 0;
  if (aspectRatio > imageAspectRatio) {
    scale = (height / imageHeight) * zoom;
    const actualWidth = imageWidth * scale;
    paddingX = (width - actualWidth) / 2;
  } else {
    scale = (width / imageWidth) * zoom;
    const actualHeight = imageHeight * scale;
    paddingY = (height - actualHeight) / 2;
  }

  const [mouseDownPoint, setMouseDownPoint] = useState<
    { x: number; y: number } | undefined
  >(undefined);

  useWindowEvent(
    'wheel',
    (wheelEvent) => {
      const newScroll = clamp(zoom - wheelEvent.deltaY / 10, 1, 100);
      setZoom(newScroll);

      // TODO: make sure offset doesn't make map offscreen.
    },
    [zoom],
  );

  useWindowEvent(['mousedown', 'touchstart'], (event) => {
    event.preventDefault();

    if (event.type === 'mousedown') {
      const mouseEvent = event as MouseEvent;
      setMouseDownPoint({ x: mouseEvent.pageX, y: mouseEvent.pageY });
    }
  });

  useWindowEvent(
    ['mouseup', 'touchend'],
    (event) => {
      setMouseDownPoint(undefined);
      setOffsetX(offsetX + temporaryOffsetX);
      setTemporaryOffsetX(0);
      setOffsetY(offsetY + temporaryOffsetY);
      setTemporaryOffsetY(0);
    },
    [offsetX, offsetY, temporaryOffsetX, temporaryOffsetY],
  );

  useWindowEvent(
    ['mousemove', 'touchmove'],
    (event) => {
      if (mouseDownPoint == null) return;

      if (event.type === 'mousemove') {
        const mouseEvent = event as MouseEvent;

        // const

        const movedX = mouseEvent.pageX - mouseDownPoint.x;
        const movedY = mouseEvent.pageY - mouseDownPoint.y;

        setTemporaryOffsetX(movedX);
        setTemporaryOffsetY(movedY);
      }
    },
    [mouseDownPoint, scale],
  );
  console.log('scale', scale);
  console.log('zoom', zoom);

  // function moveMap() {
  //   if (zoom == 1)
  //   {
  //     offsetX = (tailleX - realWidth)/2;
  //     offsetY = (tailleY - realHeight)/2;
  //   }
  //   else
  //   {
  //     if (offsetX < -(screenW/2)) 	offsetX = -screenW/2;
  //     else if (offsetX > (tailleX-screenW/2)) offsetX = (tailleX-screenW/2);

  //     if (offsetY < -(screenH/2)) 	offsetY = -screenH/2;
  //     else if (offsetY > (tailleY-screenH/2)) offsetY = (tailleY-screenH/2);
  //   }

  //   $("#map").css('background-position', -offsetX+'px ' + -offsetY+'px');
  //   map.setViewBox(offsetX*ratio, offsetY*ratio, drawWidth, drawHeight, false);
  // }

  // $('#map').on('mousedown touchstart', function(e) {
  // 	e = e.originalEvent;

  // 	if (typeof (e.touches) !== 'undefined' && e.touches.length == 2)
  // 	{
  // 		oldX = Math.abs(e.touches[0].pageX - e.touches[1].pageX);
  // 		oldY = Math.abs(e.touches[0].pageY - e.touches[1].pageY);
  // 	}
  // 	else
  // 	{
  // 		if	(e.type == 'touchstart')
  // 		{
  // 			var xx = e.touches[0].pageX;
  // 			var yy = e.touches[0].pageY;
  // 		}
  // 		else
  // 		{
  // 			var xx = e.pageX;
  // 			var yy = e.pageY;
  // 		}

  // 		if (drawing == 1)
  // 		{
  // 			oldX = parseInt((offsetX + xx)*ratio);
  // 			oldY = parseInt((offsetY + yy)*ratio);
  // 			$('#txt').html(LgNextTra);
  // 			showDescr();
  // 			drawing = 2;
  // 		}
  // 		else if (drawing == 2)
  // 		{
  // 			drawLine( parseInt((offsetX + xx)*ratio), parseInt((offsetY + yy)*ratio));
  // 		}
  // 		else
  // 		{
  // 			Xclick=xx; Yclick=yy;
  // 			clickToMove = 1;
  // 		}
  // 	}
  // });

  // $('#map').on('mouseup touchend', function() {
  // 	clickToMove = 0;
  // });

  // $('#map').on('mousemove touchmove', function(e) {
  // 	e = e.originalEvent;
  // 	if (typeof (e.touches) !== 'undefined' && e.touches.length == 2)
  // 	{
  // 		Xclick = Math.abs(e.touches[0].pageX - e.touches[1].pageX);
  // 		Yclick = Math.abs(e.touches[0].pageY - e.touches[1].pageY);

  // 		var sensX = Xclick - oldX;
  // 		var sensY = Yclick - oldY;
  // 		if (sensX > 10 || sensY > 10)
  // 		{
  // 			setZoom(zoomLite);
  // 			oldX = Xclick;
  // 			oldY = Yclick;
  // 		}
  // 		else if (sensX < -10 || sensY < -10)
  // 		{
  // 			setZoom(-zoomLite);
  // 			oldX = Xclick;
  // 			oldY = Yclick;
  // 		}
  // 	}
  // 	else
  // 	{
  // 		if	(e.type == 'touchmove')
  // 		{
  // 			var xx = e.touches[0].pageX;
  // 			var yy = e.touches[0].pageY;
  // 		}
  // 		else
  // 		{
  // 			var xx = e.pageX;
  // 			var yy = e.pageY;
  // 		}
  // 		if ((clickToMove == 1) && (zoom > 1))
  // 		{
  // 			offsetX = offsetX - xx +Xclick;
  // 			offsetY = offsetY - yy +Yclick;
  // 			Xclick = xx;
  // 			Yclick = yy;
  // 			moveMap();
  // 		}
  // 	}
  // });

  const totalOffsetX = offsetX + temporaryOffsetX + paddingX;
  const totalOffsetY = offsetY + temporaryOffsetY + paddingY;

  return (
    <img
      src="/waterdeep-3560-7256.jpg"
      style={{
        transformOrigin: `top left`,
        transform: `translateX(${totalOffsetX}px) translateY(${totalOffsetY}px) scale(${scale})`,
        boxShadow: '0 0 25px rgba(0, 0, 0, 1.0)',
      }}
    />
  );
};

export default MapImage;
