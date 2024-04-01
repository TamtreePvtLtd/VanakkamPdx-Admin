import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Loader from "./common/components/Loader.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Loader />
  </>
);
