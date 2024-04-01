import useAxiosLoader, {
  axiosInstanceWithCredential,
  axiosInstanceWithMultipartFormData,
  axiosInstanceWithOutCredential,
} from "../../services/http";
import { Box } from "@mui/material";

const Spinner = () => <div className="spinner"></div>;

function Loader() {
  const [axiosWithCredentialLoading] = useAxiosLoader(
    axiosInstanceWithCredential
  );
  const [axiosWithOutCredentialLoading] = useAxiosLoader(
    axiosInstanceWithOutCredential
  );
  const [axiosWithMultiPartheaderLoading] = useAxiosLoader(
    axiosInstanceWithMultipartFormData
  );

  const showLoading =
    axiosWithCredentialLoading ||
    axiosWithOutCredentialLoading ||
    axiosWithMultiPartheaderLoading;

  return (
    <>
      {showLoading && (
        <Box className="overlay">
          <Spinner />
          <img
            style={{
              borderRadius: "50%",
              backgroundColor: "white",
            }}
            className="spinner-image"
            src="\assets\images\sindhus-logo.png"
            alt=""
          />
        </Box>
      )}
    </>
  );
}

export default Loader;
