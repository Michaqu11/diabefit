import * as React from "react";
import { useState, useEffect } from "react";
import moment from "moment";

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

function DateList() {
  type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

  const { dragStart, dragStop, dragMove, dragging } = useDrag();

  const [selected, setSelected] = React.useState<string>(
    moment().format("DD MM YYYY"),
  );

  const [deviceType, setDeviceType] = useState("");

  const date = () => {
    let result: { date: String; id: String }[] = [];
    for (var i = 15; i > 0; i--) {
      result.push({
        date: moment().subtract(i, "days").format("ddd DD"),
        id: moment().subtract(i, "days").format("DD MM YYYY"),
      });
    }
    for (i = 0; i <= 15; i++) {
      result.push({
        date: moment().add(i, "days").format("ddd DD"),
        id: moment().add(i, "days").format("DD MM YYYY"),
      });
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
    (itemId: string) =>
    ({ getItemById, scrollToItem }: scrollVisibilityApiType) => {
      if (dragging) {
        return false;
      }
      setSelected(selected !== itemId ? itemId : "");

      scrollToItem(getItemById(itemId), "smooth", "center", "nearest");
    };

  const apiRef = React.useRef({} as scrollVisibilityApiType);

  const init = () => {
    apiRef.current.scrollToItem(
      apiRef.current.getItemById(moment().format("DD MM YYYY")),
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
            onClick={handleItemClick(element.id)}
            selected={element.id === selected}
          />
        ))}
      </ScrollMenu>
    </div>
  );
}

export default DateList;
