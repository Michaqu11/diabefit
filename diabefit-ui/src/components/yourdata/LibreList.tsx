import {
  FormControl,
  IconButton,
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
import { enqueueSnackbar, VariantType } from "notistack";
import { useTranslation } from "react-i18next";
import { LibreData } from "../../types/settings";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface LibreListProps {
  libreData: LibreData;
  saveData: boolean | null;
  setSaveData: (value: React.SetStateAction<boolean | null>) => void;
  saveDataMessage: (variant: VariantType) => void;
}

const LibreList: React.FC<LibreListProps> = (props) => {
  const [libreData, setLibreData] = useState<LibreData>(props.libreData);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  useEffect(() => {
    const saveToken = async () => {
      if (
        props.saveData !== null &&
        libreData.email !== "" &&
        libreData.password !== ""
      ) {
        try {
          const result = await saveLibreToken(libreData);
          if (result instanceof Error) {
            enqueueSnackbar(result.message, { variant: "error" });
          } else {
            props.saveDataMessage("success");
          }
        } catch (error) {
          if (error instanceof Error) {
            enqueueSnackbar(error.message, { variant: "error" });
          } else {
            props.saveDataMessage("error");
          }
        }
      }
      props.setSaveData(null);
    };

    saveToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.saveData]);

  return (
    <>
      <List sx={{ width: "100%" }}>
        <ListItem alignItems="flex-start">
          <FormControl variant="outlined" sx={{ width: "100%" }}>
            <InputLabel htmlFor="component-simple">
              {t("yourData.inputs.libreEmail")}
            </InputLabel>
            <OutlinedInput
              value={libreData.email}
              onChange={(e) =>
                setLibreData((data) => ({ ...data, email: e.target.value }))
              }
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
        <ListItem alignItems="flex-start">
          <FormControl variant="outlined" sx={{ width: "100%" }}>
            <InputLabel htmlFor="component-simple">
              {t("yourData.inputs.librePassword")}
            </InputLabel>
            <OutlinedInput
              value={libreData.password}
              type={showPassword ? "text" : "password"}
              onChange={(e) =>
                setLibreData((data) => ({ ...data, password: e.target.value }))
              }
              endAdornment={
                <InputAdornment position="end" style={{ marginRight: "12px" }}>
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
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
