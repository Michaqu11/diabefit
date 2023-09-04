import * as React from "react";
import { useState, useEffect } from "react";

import {
  ScrollMenu,
  VisibilityContext,
  getItemsPos,
} from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";

import { LeftArrow, RightArrow } from "./arrows";
import useDrag from "./useDrag";
import { Card } from "./card";
import "./DateList.scss";
import {
  DatesList,
  getNow,
  decodeShortDate,
  getDateSubtract,
  getDateAddition,
} from "../share/MomentFunctions";

type Props = {
  dayId: number;
  setDay: (state: number) => void;
};

const DateList: React.FC<Props> = ({ dayId, setDay }) => {
  type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

  const { dragStart, dragStop, dragMove, dragging } = useDrag();

  const [selected, setSelected] = React.useState<string>(
    getNow(decodeShortDate(dayId)),
  );

  const [deviceType, setDeviceType] = useState("");

  const date = () => {
    let result: DatesList[] = [];
    for (var i = 15; i > 0; i--) {
      result.push(getDateSubtract(i, decodeShortDate(dayId)));
    }

    for (i = 0; i <= 15; i++) {
      result.push(getDateAddition(i, decodeShortDate(dayId)));
    }

    return result;
  };

  useEffect(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(
        navigator.userAgent,
      )
    ) {
      setDeviceType("Mobile");
    } else {
      setDeviceType("Desktop");
    }
  }, []);

  const handleDrag =
    ({ scrollContainer }: scrollVisibilityApiType) =>
    (ev: React.MouseEvent) =>
      dragMove(ev, (posDiff) => {
        if (scrollContainer.current) {
          scrollContainer.current.scrollLeft += posDiff;
        }
      });

  const handleItemClick =
    (itemId: string, unix: number) =>
    ({ getItemById, scrollToItem }: scrollVisibilityApiType) => {
      if (dragging) {
        return false;
      }
      setSelected(selected !== itemId ? itemId : "");
      scrollToItem(getItemById(itemId), "smooth", "center", "nearest");
      setDay(unix);
    };

  const apiRef = React.useRef({} as scrollVisibilityApiType);

  const init = () => {
    apiRef.current.scrollToItem(
      apiRef.current.getItemById(getNow(decodeShortDate(dayId))),
      "auto",
      "center",
    );
  };

  return (
    <div onMouseLeave={dragStop}>
      <ScrollMenu
        apiRef={apiRef}
        LeftArrow={deviceType === "Desktop" && LeftArrow}
        RightArrow={deviceType === "Desktop" && RightArrow}
        onMouseDown={() => dragStart}
        onMouseUp={({
            getItemById,
            scrollToItem,
            visibleItems,
          }: scrollVisibilityApiType) =>
          () => {
            // NOTE: for center items
            dragStop();
            const { center } = getItemsPos(visibleItems);
            scrollToItem(getItemById(center), "smooth", "center");
          }}
        options={{ throttle: 0 }} // NOTE: for center items
        onMouseMove={handleDrag}
        onInit={init}
      >
        {date().map((element: any) => (
          <Card
            title={element.date}
            itemId={element.id}
            key={element.id}
            onClick={handleItemClick(element.id, element.unix)}
            selected={element.id === selected}
          />
        ))}
      </ScrollMenu>
    </div>
  );
};

export default DateList;
