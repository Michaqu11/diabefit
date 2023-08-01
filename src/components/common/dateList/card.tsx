import React from "react";
import Button from "@mui/joy/Button";
import { VisibilityContext } from "react-horizontal-scrolling-menu";

export function Card({
  itemId,
  selected,
  onClick,
  title,
}: {
  itemId: string;
  selected: boolean;
  onClick: Function;
  title: string;
}) {
  const visibility = React.useContext(VisibilityContext);
  // const visible = visibility.isItemVisible(itemId);
  const text = title.split(" ");

  return (
    <div>
      <Button
        className="cardButton"
        variant={selected ? "soft" : "plain"}
        onClick={() => onClick(visibility)}
      >
        {text[0] + "\n" + text[1]}
      </Button>
    </div>
  );
}
