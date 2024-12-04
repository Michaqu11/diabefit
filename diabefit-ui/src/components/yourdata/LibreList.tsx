import {
  FormControl,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  OutlinedInput,
} from "@mui/material";
import ClickTooltip from "../common/tooltip/ClickTooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useEffect, useState } from "react";
import "./SettingsList.scss";
import { saveLibreToken } from "../../api/save-libre-token";
import { VariantType } from "notistack";
import { useTranslation } from "react-i18next";

interface LibreListProps {
  libreAPI: string;
  saveData: boolean | null;
  setSaveData: (value: React.SetStateAction<boolean | null>) => void;
  saveDataMessage: (variant: VariantType) => void;
}

const LibreList: React.FC<LibreListProps> = (props) => {
  const [libreToken, setLibreToken] = useState<string>(props.libreAPI);
  const { t } = useTranslation();
  useEffect(() => {
    if (props.saveData != null && libreToken !== "") {
      saveLibreToken(libreToken);
      props.saveDataMessage("success");
    } else if (props.saveData !== null) {
      props.saveDataMessage("error");
    }
    props.setSaveData(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.saveData]);

  return (
    <>
      <List sx={{ width: "100%" }}>
        <ListItem alignItems="flex-start">
          <FormControl variant="outlined" sx={{ width: "100%" }}>
            <InputLabel htmlFor="component-simple">
              {t("yourData.inputs.libreLabel")}
            </InputLabel>
            <OutlinedInput
              value={libreToken}
              onChange={(e) => setLibreToken(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <ClickTooltip
                    icon={InfoOutlinedIcon}
                    title={t("yourData.inputs.libreInformation")}
                  />
                </InputAdornment>
              }
              label={t("yourData.inputs.libreLabel")}
            />
          </FormControl>
        </ListItem>
      </List>
    </>
  );
};
export default LibreList;
