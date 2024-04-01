import Drawer from "@mui/material/Drawer";
import {
  Box,
  Typography,
  Grid,
  Container,
  IconButton,
  TextField,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller, useForm } from "react-hook-form";
import { IMenu, IMenuFormResolver, ISubMenu } from "../interface/menus";
import { MenudrawerWidth } from "../constants/Constants";
import { IOptionTypes } from "../interface/types";
import { useCreateMenu, useUpdateMenu } from "../customRQHooks/Hooks";
import imageCompression from "browser-image-compression";
import { useSnackBar } from "../context/SnackBarContext";

interface IProps {
  selectedMenu: IMenu | null;
  menuDrawerOpen: boolean;
  handleMenuDrawerclose: () => void;
}

const schema = yup.object<IMenuFormResolver>().shape({
  title: yup.string().required("Name is required"),
  menuType: yup.string().required("Menu Type is required"),
  subMenus: yup.array().of(
    yup.object().shape({
      title: yup.string().required("Title is required"),
    })
  ),
});

const defaultValues = {
  title: "",
  menuType: "",
  subMenus: [],
} as IMenuFormResolver;

const menuTypes: IOptionTypes[] = [
  { id: "1", label: "Snacks", value: "1" },
  { id: "3", label: "Drinks", value: "3" },
  { id: "2", label: "Food", value: "2" },
];

function MenuDrawer(props: IProps) {
  const { menuDrawerOpen, handleMenuDrawerclose, selectedMenu } = props;
  const [isEdit, setIsEdit] = useState(!!selectedMenu);
  const [subMenuItems, setSubMenuItems] = useState<ISubMenu[]>([]);
  const [showAddSubMenu, setShowAddSubMenu] = useState(false);
  const { updateSnackBarState } = useSnackBar();

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    getValues,
    setValue,
    control,
  } = useForm<IMenuFormResolver>({
    resolver: yupResolver(schema) as any,
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      ...defaultValues,
      subMenus: [],
    },
  });

  const formRef = useRef(null);

  const createMenuMutation = useCreateMenu();
  var menuUpdateMutation = useUpdateMenu();
  const filePosterRef = useRef<HTMLInputElement>(null);

  const handleAddSubMenu = () => {
    const subMenuValues = getValues("subMenus") || [];
    setSubMenuItems([...subMenuValues, { title: "" }]);
  };

  const onSubmit = async (data: IMenuFormResolver) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);

      formData.append("menuType", String(data.menuType));

      if (data.subMenus) {
        data.subMenus.forEach((submenu, index) => {
          formData.append(`subMenus[${index}][title]`, submenu.title);
        });
      }

      if (!isEdit) {
        await createMenuMutation.mutateAsync(formData, {
          onSuccess: () => {
            handleMenuDrawerclose();
            // resetForm();

            updateSnackBarState(true, "Menu added successfully.", "success");
            console.log("menu added successfully");
          },
          onError: (error: any) => {
            updateSnackBarState(true, error.response.data.message, "error");
          },
        });
        handleMenuDrawerclose();
      } else {
        formData.append("id", selectedMenu?._id!);
        await menuUpdateMutation.mutateAsync(formData, {
          onSuccess: () => {
            handleMenuDrawerclose();
            updateSnackBarState(true, "Menu updated successfully.", "success");
          },
          onError: (error: any) => {
            updateSnackBarState(true, error.response.data.message, "error");
          },
        });
        handleMenuDrawerclose();
      }

      setSubMenuItems(data.subMenus || []);
      reset({ ...defaultValues });
    } catch (error) {
      console.error("Error creating/updating menu:", error);
    }
  };

  const removeSubMenu = (index: number) => {
    const formValues = getValues();
    if (formValues.subMenus) {
      const _subMenus = [...formValues.subMenus];
      _subMenus.splice(index, 1);
      setValue("subMenus", _subMenus);
      setSubMenuItems([..._subMenus]);
    }
  };

  useEffect(() => {
    if (selectedMenu && selectedMenu._id) {
      setIsEdit(!!selectedMenu._id);
      setValue("title", selectedMenu.title);
      setValue("menuType", selectedMenu.menuType.toString());
      setValue("subMenus", selectedMenu.subMenus ?? []);
      setSubMenuItems([...selectedMenu.subMenus]);

      setShowAddSubMenu(
        !!(selectedMenu.subMenus && selectedMenu.subMenus.length)
      );
    }
  }, [selectedMenu]);

  const SubMenuFields = (item: ISubMenu, index: number) => (
    <Grid container p={1} xs={12} key={index}>
      <Grid item xs={5} p={1}>
        <Box>
          <Typography variant="subtitle1">Title *</Typography>
          <TextField
            {...register(`subMenus.${index}.title`)}
            variant="outlined"
            error={errors.subMenus && !!errors.subMenus[index]?.title}
            helperText={
              errors.subMenus && errors.subMenus?.[index]?.title?.message
            }
          />
        </Box>
      </Grid>
      <Grid item xs={1} mt={5}>
        <IconButton>
          <DeleteIcon
            onClick={() => {
              removeSubMenu(index);
            }}
          />
        </IconButton>
      </Grid>
    </Grid>
  );

  const drawer = (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        p={2}
      >
        <Typography variant="h6" fontWeight="700" component="div">
          {isEdit ? "Edit Menu" : "Add Menu"}
        </Typography>
        <CloseIcon
          sx={{ cursor: "pointer" }}
          onClick={() => {
            handleMenuDrawerclose();
            setIsEdit(false);
          }}
        />
      </Box>

      <Divider />
      <Container>
        <Grid container>
          <Grid item xs={12} p={2}>
            <Box py={1}>
              <Typography variant="subtitle1">Name *</Typography>
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Box>

            <Box pt={2}>
              <Typography variant="subtitle1">Menu Type *</Typography>
              <Controller
                name="menuType"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth>
                    <RadioGroup
                      {...field}
                      row
                      onChange={(e) => {
                        field.onChange(e);
                        setShowAddSubMenu(e.target.value === "1");
                      }}
                    >
                      {menuTypes.map((option) => (
                        <FormControlLabel
                          key={option.id}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                        />
                      ))}
                    </RadioGroup>
                    <FormHelperText error>
                      {fieldState.error?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Box>
          </Grid>
        </Grid>
        <Divider />

        {showAddSubMenu && (
          <Box sx={{ padding: "10px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 2,
                marginTop: 2,
                padding: 1,
              }}
            >
              <Typography variant="body1" fontWeight="bold">
                SubMenu
              </Typography>
              <Button
                variant="outlined"
                onClick={handleAddSubMenu}
                sx={{
                  color: "#038265",
                }}
              >
                <AddIcon />
                Add Submenu
              </Button>
            </Box>
            {subMenuItems &&
              subMenuItems.map((item, index) => SubMenuFields(item, index))}
          </Box>
        )}
      </Container>
    </Box>
  );

  return (
    <Drawer
      open={menuDrawerOpen}
      anchor="right"
      sx={{
        "& .MuiDrawer-paper": {
          width: MenudrawerWidth,
        },
      }}
    >
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        {drawer}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            padding: "10px",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              handleMenuDrawerclose();
            }}
            sx={{
              color: "#038265",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              "&:hover": {
                backgroundColor: "#038265",
              },
            }}
          >
            Save
          </Button>
        </Box>
      </form>
    </Drawer>
  );
}

export default MenuDrawer;
