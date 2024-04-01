export interface ISnackBarContextType {
  snackBarState: ISnackbarState;
  updateSnackBarState: (
    isOpen: boolean,
    message: any,
    severity: string
  ) => void;
}

export interface ISnackbarState {
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: string;
}
