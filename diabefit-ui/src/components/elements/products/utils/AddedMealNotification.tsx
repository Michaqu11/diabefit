import { enqueueSnackbar } from "notistack";

export const addedMealNotification = () =>
  enqueueSnackbar("The product has been added to the list!", {
    variant: "success",
  });

export const errorAddedMealNotification = () =>
  enqueueSnackbar("There was an error adding the product to the list!", {
    variant: "error",
  });

export const removeAddedMealNotification = () =>
  enqueueSnackbar(
    "The product has been successfully removed from the database!",
    {
      variant: "warning",
    },
  );
