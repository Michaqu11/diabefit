import { enqueueSnackbar } from "notistack";

export const addedMealNotification = () =>
  enqueueSnackbar("The product has been added to the list!", {
    variant: "success",
  });
