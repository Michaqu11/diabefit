import React from "react";
import Button from '@mui/joy/Button';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import {
  VisibilityContext,
  slidingWindow,
  getItemsPos
} from "react-horizontal-scrolling-menu";

export function LeftArrow() {
  const {
    items,
    visibleItems,
    getItemById,
    isFirstItemVisible,
    scrollToItem,
    visibleElements,
    initComplete
  } = React.useContext(VisibilityContext);

  const [disabled, setDisabled] = React.useState(
    !initComplete || (initComplete && isFirstItemVisible)
  );
  React.useEffect(() => {
    // NOTE: detect if whole component visible
    if (visibleElements.length) {
      setDisabled(isFirstItemVisible);
    }
  }, [isFirstItemVisible, visibleElements]);

  // NOTE: for center items
  const prevGroupItems = slidingWindow(
    items.toItemsKeys(),
    visibleItems
  ).prev();
  const { center } = getItemsPos(prevGroupItems);
  const scrollPrevCentered = () =>
    scrollToItem(getItemById(center), "smooth", "center");

  return (
    <Button disabled={disabled} variant="plain" onClick={scrollPrevCentered}>
        <KeyboardArrowLeftIcon />
     </Button>
  );
}

export function RightArrow() {
  const {
    getItemById,
    isLastItemVisible,
    items,
    scrollToItem,
    visibleItems,
    visibleElements
  } = React.useContext(VisibilityContext);

  const [disabled, setDisabled] = React.useState(
    !visibleElements.length && isLastItemVisible
  );
  React.useEffect(() => {
    if (visibleElements.length) {
      setDisabled(isLastItemVisible);
    }
  }, [isLastItemVisible, visibleElements]);

  // NOTE: for center items
  const nextGroupItems = slidingWindow(
    items.toItemsKeys(),
    visibleItems
  ).next();
  const { center } = getItemsPos(nextGroupItems);
  const scrollNextCentered = () =>
    scrollToItem(getItemById(center), "smooth", "center");

  return (
    <Button disabled={disabled} variant="plain" onClick={scrollNextCentered}>
       <KeyboardArrowRightIcon />
    </Button>
  );
}
