import { enqueueSnackbar } from "notistack";

export const addedMealNotification = (t: any) =>
  enqueueSnackbar(t("addProduct.notifications.add"), {
    variant: "success",
    autoHideDuration: 3000,
  });

export const errorAddedMealNotification = (t: any) =>
  enqueueSnackbar(t("addProduct.notifications.error"), {
    variant: "error",
    autoHideDuration: 3000,
  });

export const removeAddedMealNotification = (t: any) =>
  enqueueSnackbar(t("addProduct.notifications.remove"), {
    variant: "warning",
    autoHideDuration: 3000,
  });
