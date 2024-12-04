import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation, useParams } from "react-router-dom";
import "./Page.scss";
import SearchInput from "../components/elements/products/search/SearchInput";
import ProductsList from "../components/elements/products/productsList/ProductsList";
import Divider from "@mui/material/Divider";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { EDays } from "../types/days";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddIcon from "@mui/icons-material/Add";
import { CustomProductCard } from "../components/elements/products/custom/CustomProductCard";
import { IMealElement } from "../types/meal";
import { saveMeal } from "../store/mealsStorage";
import CloseIcon from "@mui/icons-material/Close";
import { getOwnProduct } from "../api/get-own-product";
import OwnProductsList from "../components/elements/products/productsList/OwnProductsList";
import CustomMealDialog from "../components/elements/products/utils/CustomMealDialog";
import { QuickAdd } from "../components/elements/products/custom/QuickAdd";
import { addTemporaryMeals } from "../store/customMealsStorage";
import { useTranslation } from "react-i18next";
import { getTranslatedDay } from "../config/translation/daysTranslated";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

const AddProduct: React.FC = () => {
  const { t } = useTranslation();

  let { id, meal } = useParams();
  const Mobile = useMediaQuery("(min-width:700px)");

  const [mealName, setMealName] = useState<String>(
    Object.values(EDays)[Number(meal) - 1],
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchKey, setSearchKey] = useState<string>("");

  const [isFavoriteSelected, setIsFavoriteSelected] = useState(0);

  const [dayID, eDayID] = window.location.pathname.slice(5).split("/");
  const open = Boolean(anchorEl);

  const [ownProducts, setOwnProducts] = useState<IMealElement[]>([]);
  const [openCustomizeMealDialog, setOpenCustomizeMealDialog] = useState<
    IMealElement | undefined
  >(undefined);

  const navigate = useNavigate();
  const location = useLocation();

  const isNewEntry = location.pathname.includes("entry");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const close = (e: String) => {
    setMealName(e);
    setAnchorEl(null);
    navigate(
      `..${isNewEntry ? "entry/" : ""}/add/${id}/${
        Object.values(EDays).indexOf(e as unknown as EDays) + 1
      }`,
      { replace: true },
    );
  };

  const getProducts = useCallback(async () => {
    const products = await getOwnProduct();
    setOwnProducts(products);
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openDialogProduct, setOpenDialogProduct] = useState(false);
  const [openDialogQuickAdd, setOpenDialogQuickAdd] = useState(false);

  const handleCloseDialogQuickAdd = () => {
    setOpenDialogQuickAdd(false);
  };

  const handleCloseDialogProduct = () => {
    setOpenDialogProduct(false);
  };

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const targetPath = isNewEntry
    ? `/${pathSegments.slice(0, -3).join("/")}`
    : "/";

  return (
    <>
      <Paper elevation={0} sx={{ margin: "5px" }}>
        <Grid container justifyContent="flex-start">
          <Grid>
            <IconButton
              color="primary"
              component={Link}
              to={targetPath}
              state={{
                id: id,
              }}
              aria-label="back"
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          </Grid>
          <Grid sx={{ marginTop: "2px" }}>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              disabled={isNewEntry}
              color="primary"
            >
              {getTranslatedDay(mealName, t)}
            </Button>
          </Grid>
        </Grid>
        <div className={!Mobile ? "container-mobile" : "container-desktop"}>
          <SearchInput searchKey={searchKey} setSearchKey={setSearchKey}>
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={() =>
                setIsFavoriteSelected((isFavoriteSelected) =>
                  isFavoriteSelected === 0 ? 1 : 0,
                )
              }
              color="primary"
            >
              {isFavoriteSelected === 0 ? (
                <FavoriteBorderIcon />
              ) : (
                <FavoriteIcon />
              )}
            </IconButton>
          </SearchInput>
          <Divider sx={{ marginTop: "10px" }} />
          <CustomTabPanel value={isFavoriteSelected} index={0}>
            <ProductsList
              searchKey={searchKey}
              dayID={dayID}
              eDayID={eDayID}
              isNewEntry={isNewEntry}
            />
          </CustomTabPanel>
          <CustomTabPanel value={isFavoriteSelected} index={1}>
            <OwnProductsList
              ownProducts={ownProducts}
              getProducts={getProducts}
              searchKey={searchKey}
              dayID={dayID}
              eDayID={eDayID}
              isNewEntry={isNewEntry}
            />
          </CustomTabPanel>
        </div>
      </Paper>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {Object.values(EDays)
          .filter((e: String) => e !== mealName)
          .map((e: String, index: number) => (
            <div key={index}>
              <MenuItem onClick={() => close(e)}>
                {getTranslatedDay(e, t)}
              </MenuItem>
            </div>
          ))}
      </Menu>
      <Dialog onClose={handleCloseDialogProduct} open={openDialogProduct}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {t("addProduct.title")}
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleCloseDialogProduct}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 13,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <CustomProductCard
            setProduct={(meal: IMealElement) => {
              handleCloseDialogProduct();
              setOpenCustomizeMealDialog(meal);
            }}
            getProducts={getProducts}
          />
        </DialogContent>
      </Dialog>

      <Dialog onClose={handleCloseDialogQuickAdd} open={openDialogQuickAdd}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {t("addProduct.bottomNavigation.quick")}
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleCloseDialogQuickAdd}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 13,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <QuickAdd
            setProduct={(meal: IMealElement) => {
              isNewEntry
                ? addTemporaryMeals(meal)
                : saveMeal(meal, dayID, eDayID);
              handleCloseDialogQuickAdd();
            }}
          />
        </DialogContent>
      </Dialog>

      <Container
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          width: "100%",
          p: "0 !important",
        }}
      >
        <Paper
          sx={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
            padding: "8px",
          }}
          elevation={3}
        >
          <Button
            variant="text"
            size="small"
            onClick={() => setOpenDialogProduct(true)}
            startIcon={<AddIcon />}
          >
            {t("addProduct.bottomNavigation.product")}
          </Button>

          <Button
            variant="text"
            size="small"
            onClick={() => setOpenDialogQuickAdd(true)}
            startIcon={<AddIcon />}
          >
            {t("addProduct.bottomNavigation.quick")}
          </Button>
        </Paper>
      </Container>
      <CustomMealDialog
        meal={openCustomizeMealDialog}
        setMeal={setOpenCustomizeMealDialog}
        open={openCustomizeMealDialog !== undefined}
        setOpen={() => setOpenCustomizeMealDialog(undefined)}
        saveMeal={(meal: IMealElement) =>
          isNewEntry ? addTemporaryMeals(meal) : saveMeal(meal, dayID, eDayID)
        }
      />
    </>
  );
};

export default AddProduct;
