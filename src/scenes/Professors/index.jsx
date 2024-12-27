import { Box, useTheme  } from "@mui/material";
import { Header } from "../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { mockDataContacts } from "../../data/mockData";
import { tokens } from "../../theme";

const Professors = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columnsProf = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "registrarId", headerName: "Professor Code" },
    {
      field: "name",
      headerName: "First Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Last Name",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Specialty",
      flex: 1,
    },
    {
      field: "email",
      headerName: "E-mail",
      flex: 1,
    },
    {
      field: "text",
      headerName: "Action",
      flex: 1,
    },
  ];

  const ElemtAffectation = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Element Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "test",
      headerName: "Action",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="Professors :" subtitle="List of Professors And their affected element" />

      <Box display="flex" gap="20px" height="75vh">
        <Box flex={1} sx={{ maxWidth: "70%" }}>
          <DataGrid
            rows={mockDataContacts}
            columns={columnsProf}
            components={{ Toolbar: GridToolbar }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            checkboxSelection
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                border: "none",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#d8eaf4",
                borderBottom: "none",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: "#d8eaf4",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
             
                        "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                        },
                      
                          "& .MuiDataGrid-iconSeparator": {
                        color: colors.primary[100],
                        },
                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.gray[100]} !important`,
                        },
                      }}
                      />
                    </Box>
                    <Box flex={1} sx={{ maxWidth: "30%" }}>
                      <DataGrid
                      rows={mockDataContacts}
                      columns={ElemtAffectation}
                      components={{ Toolbar: GridToolbar }}
                      initialState={{
                        pagination: {
                        paginationModel: {
                          pageSize: 10,
                        },
                        },
                      }}
                      checkboxSelection
                      sx={{
                        "& .MuiDataGrid-root": {
                        border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                        border: "none",
                        },
                        "& .name-column--cell": {
                          color: colors.primary[100],
                        },
                        "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#d8eaf4", 
                        borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: "#d8eaf4",
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
              "& .MuiDataGrid-iconSeparator": {
                color: colors.primary[100],
              },
              "& .MuiButton-text" :{
                color:'black',
              },
              "& .MuiDataGrid-toolbarContainer ": {
                color: 'colors.gray[100]',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Professors;
