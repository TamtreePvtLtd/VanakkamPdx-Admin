import { useContext } from "react";
import { useState, createContext } from "react";
import { ISnackBarContextType, ISnackbarState } from "../interface/snackBar";
import { SnackbarSeverityEnum } from "../enums/SnackbarSeverityEnums";

const SnackBarContext = createContext<ISnackBarContextType>({
  snackBarState: {
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: SnackbarSeverityEnum.SUCCESS,
  },
  updateSnackBarState: () => {},
});

function SnackBarProvider({ children }) {
  const [snackBarState, setSnackBarstate] = useState<ISnackbarState>({
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: SnackbarSeverityEnum.SUCCESS,
  });

  const updateSnackBarState = (
    isOpen: boolean,
    message: string,
    severity: string
  ) => {
    var obj = {
      snackbarOpen: isOpen,
      snackbarMessage: message,
      snackbarSeverity: severity,
    } as ISnackbarState;
    setSnackBarstate({ ...obj });
  };

  const contextValue: ISnackBarContextType = {
    snackBarState,
    updateSnackBarState,
  };

  return (
    <SnackBarContext.Provider value={contextValue}>
      {children}
    </SnackBarContext.Provider>
  );
}
export function useSnackBar() {
  const context = useContext<ISnackBarContextType>(SnackBarContext);
  return context;
}

export default SnackBarProvider;
