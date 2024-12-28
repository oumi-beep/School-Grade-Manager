import { Box, useTheme } from "@mui/material";
import { Header } from "../../components";
import { DataGrid, GridToolbar ,GridToolbarQuickFilter} from "@mui/x-data-grid";
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

  const labelStyle = {
    color: colors.gray[700],
    fontWeight: '600',
    marginBottom: '8px',
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const inputStyle = {
    color: colors.gray[500],
    padding: '12px 15px',
    border: `1px solid ${colors.gray[300]}`,
    borderRadius: '8px',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    outline: 'none',
    fontSize: '1rem',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  };

  const buttonStyle = {
    padding: '12px 20px',
    backgroundColor: colors.greenAccent[500],
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
    fontSize: '1rem',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  };

  
    const mockDataContactss = [
    { id: 1, name: 'Element 1' },
    { id: 2, name: 'Element 2' },
    { id: 3, name: 'Element 3' },
    { id: 4, name: 'Element 4' },
  ];
    const elemttable = [
      { field: "id", headerName: "ID", flex: 0.5 },
      {
        field: "name",
        headerName: "Element Name",
        flex: 1,
         cellClassName: "name-column--cell",
      },
    ];


  return (
    <Box m="20px">
      <Header title="Professors :" subtitle="List of Professors And their affected element" />
      <Box m="20px" style={{ backgroundColor: '#f9f9f9', borderRadius: '15px', padding: '20px', boxShadow: '2px 8px 8px rgba(26, 24, 24, 0.1)' }}>
        <Box display="flex" gap="20px" mb="20px">
          {/* Left Side */}
          <Box flex={1} width="75%" display="flex" flexDirection="column" gap="20px">
            <Box display="flex" gap="20px">
              <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="professorCode" style={labelStyle}>Professor Code:</label>
                <input type="text" style={inputStyle} id="professorCode" name="professorCode" />
              </Box>
              <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="firstName" style={labelStyle}>First Name:</label>
                <input type="text" style={inputStyle} id="firstName" name="firstName" />
              </Box>
              
            </Box>
            <Box display="flex" gap="20px">
              <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="lastName" style={labelStyle}>Last Name:</label>
                <input type="text" style={inputStyle} id="lastName" name="lastName" />
              </Box>
              <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="specialty" style={labelStyle}>Specialty:</label>
                <input type="text" style={inputStyle} id="specialty" name="specialty" />
              </Box>
              
            </Box>
            <Box display="flex" gap="20px">
            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="email" style={labelStyle}>E-mail:</label>
                <input type="email" style={inputStyle} id="email" name="email" />
              </Box>
              <Box flex={1} display="flex" justifyContent="center" alignItems="center">
                <button style={buttonStyle} type="submit">Submit</button>
              </Box>
              </Box>
          </Box>

          {/* Right Side  */}
          <Box width={"25%"} height={{ xs: '80%', sm: '90%', md: '25%' }} style={{ display: 'flex', flexDirection: 'column' }}>
            <label 
              style={{ ...labelStyle, fontWeight: 'bold', marginBottom: '2px', fontSize: '1.2rem', color: '#2196F3' }}>
               Element List:
            </label>
            <DataGrid
              rows={mockDataContactss}
              columns={elemttable}
              components={{
                Toolbar: () => (
                  <div style={{ padding: '0.5rem', backgroundColor: 'transparent' }}>
                    <GridToolbarQuickFilter />
                  </div>
                ),
              }}
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
                  height: '500px', // Adjust height here
                  overflow: 'hidden',
                },
                "& .MuiDataGrid-cell": {
                  border: "none",
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                },
                "& .name-column--cell": {
                  color: '#4CAF50',
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
                  backgroundColor: '#e0f7fa',
                  overflowY: 'auto',
                },
                "& .MuiCheckbox-root": {
                  color: 'black !important',
                },
                "& .MuiDataGrid-iconSeparator": {
                  color: '#b2ebf2',
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                  color: '#ffffff !important',
                },
              }}
            />
            <br />
            <Box flex={1} display="flex" justifyContent="center" alignItems="center">
              <button style={{ ...buttonStyle, color: '#fff', padding: '10px 15px', fontSize: '1rem', borderRadius: '5px' }} type="submit">Submit</button>
            </Box>
          </Box>

        </Box>
      </Box>

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
              "& .MuiButton-text": {
                color: 'black',
              },
              "& .MuiDataGrid-toolbarContainer": {
                color: colors.gray[100],
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Professors;
