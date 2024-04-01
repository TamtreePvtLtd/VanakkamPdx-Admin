import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Pagination,
  Button,
} from "@mui/material";
import { IPageInfo } from "../../interface/types";
import { useTheme } from "@mui/material/styles";

interface IProps {
  onRowsPerPageChange(rowsCount: number): void;
  onPageChange(currentPage: number): void;
  pagetitle: string;
  onAddClick?(): void;
  addButtonText?: string;
  pageInfo: IPageInfo | undefined;
}

function PaginatedHeader(props: IProps) {
  const theme = useTheme();

  return (
    <Box sx={{ marginLeft: "25px" }}>
      <Grid
        alignItems={"center"}
        display={"flex"}
        my={2}
        justifyContent={"space-between"}
        alignContent={"center"}
      >
        <Grid item xs={12} md={4}>
          <Box>
            <Typography sx={{
              fontSize: '1.3rem',
              borderRadius: "60px",
              fontWeight: 800,
              padding: '10px'

            }}  >
              {props.pagetitle}&nbsp;

              <Box
                sx={{
                  fontSize: '1.3rem',
                  borderRadius: "60px",
                  fontWeight: 800,
                  }}
                component={"span"}
              >
                ({props.pageInfo?.totalItems})
              </Box>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box display="flex" alignItems="center" >
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="take-count-label">Page Count</InputLabel>
              <Select
                labelId="Page Count"
                id="Page Count"
                value={props.pageInfo?.pageSize ?? 10}
                label="Page Count"
                onChange={(_e) => {
                  props.onRowsPerPageChange(Number(_e.target.value));
                  props.onPageChange(1);
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
              </Select>
            </FormControl>
            <Pagination
              count={props.pageInfo?.totalPages}
              variant="outlined"
              onChange={(_e, page) => props.onPageChange(page)}
              sx={{
                "& .MuiPaginationItem-page.Mui-selected": {
                  backgroundColor: "#038265",
                  color: "#FFFFFF",
                },
              }}
            />
          </Box>
        </Grid>
        {props.addButtonText && (
          <Grid>
            {!!props.addButtonText && (
              <Button
                variant="contained"
                size="small"
                onClick={props.onAddClick}
                sx={{
                  height: "36px",
                  width: "130px",
                  marginRight: theme.spacing(5),
                }}
              >
                {props.addButtonText}
              </Button>
            )}
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default PaginatedHeader;
