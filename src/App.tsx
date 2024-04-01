import { BrowserRouter, Route, Routes } from "react-router-dom";
import CateringEnquiries from "./pages/catering/CateringEnquiries";
import DiningOutMenu from "./pages/dinginout/DiningOutMenu";
import Layout from "./layout/Layout";
import { paths } from "./routes/Paths";
import SnackBarProvider from "./context/SnackBarContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "@mui/material";
import theme from "./theme/theme";
import Menus from "./pages/menus/Menus";
import ProductsPage from "./pages/products/ProductsPage";
import CustomSnackBar from "./common/components/CustomSnackBar";
import Login from "./pages/login/Login";
import PrivateRoute from "./common/components/PrivateRoute";
import AuthProvider from "./context/AuthContext";
import Specials from "./pages/specials/Specials";
import Signup from "./pages/login/Signup";

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <SnackBarProvider>
            <BrowserRouter>
              <Routes>
                <Route path={paths.REGISTER} element={<Signup />} />
                {/* <Route path={paths.LOGIN} element={<Login />} /> */}
                <Route path={paths.ROOT} element={<Layout />}>
                  <Route
                    index
                    element={
                      <PrivateRoute>
                        <CateringEnquiries />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={paths.CATERINGENQUIRIES}
                    element={
                      <PrivateRoute>
                        <CateringEnquiries />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={paths.PRODUCTS}
                    element={
                      <PrivateRoute>
                        <ProductsPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={paths.MENUS}
                    element={
                      <PrivateRoute>
                        <Menus />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={paths.DININGOUTMENU}
                    element={
                      <PrivateRoute>
                        <DiningOutMenu />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={paths.SPECIALS}
                    element={
                      <PrivateRoute>
                        <Specials />
                      </PrivateRoute>
                    }
                  />
                </Route>
              </Routes>
            </BrowserRouter>
            <CustomSnackBar />
          </SnackBarProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
