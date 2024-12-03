import React from "react";
import Button from "@mui/joy/Button";
import { VisibilityContext } from "react-horizontal-scrolling-menu";
import i18n from "i18next";

const translateDates = (text: string) => {
  const isPolish = i18n.language === "pl";
  if (!isPolish) {
    return text;
  }

  switch (text) {
    case "Mon":
      return "Pon";
    case "Tue":
      return "Wto";
    case "Wed":
      return "Śro";
    case "Thu":
      return "Czw";
    case "Fri":
      return "Pią";
    case "Sat":
      return "Sob";
    case "Sun":
      return "Nie";
    default:
      return text; // Jeśli nie jest to żaden ze znanych skrótów
  }
};

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
        {translateDates(text[0]) + "\n" + text[1]}
      </Button>
    </div>
  );
}
