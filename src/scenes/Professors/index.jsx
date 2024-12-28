import { Box, useTheme } from "@mui/material";
import { Header } from "../../components";
import { DataGrid, GridToolbar, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { mockDataContacts } from "../../data/mockData";
import { tokens } from "../../theme";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Professors = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [professorsList, setProfessorsList] = useState([]);
  const [professorData, setProfessorData] = useState({
    professorCode: '',
    firstName: '',
    lastName: '',
    specialty: '',
    email: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfessorData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const addProfessor = async (e) => {
    e.preventDefault();
    if (!professorData.professorCode || !professorData.firstName || !professorData.lastName || !professorData.specialty || !professorData.email) {
      alert('Please fill in all fields');
      return;
    }

    const response = await fetch('http://localhost:8080/api/professors/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        codeProf: professorData.professorCode,
        prenomUser: professorData.firstName,
        nomUser: professorData.lastName,
        specialite: professorData.specialty,
        email: professorData.email,
      }),
    });

    if (response.ok) {
      alert('Professor added successfully');
      const newProfessor = {
        id: professorsList.length + 1,
        registrarId: professorData.professorCode,
        name: `${professorData.firstName} ${professorData.lastName}`,
        specialty: professorData.specialty,
        email: professorData.email,
      };

      setProfessorsList((prevState) => [...prevState, newProfessor]);

      setProfessorData({
        professorCode: '',
        firstName: '',
        lastName: '',
        specialty: '',
        email: '',
      });

    } else {
      alert('Failed to add professor ');
    }
  };

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/professors')
      .then((response) => {
        const transformedData = response.data.map((prof, index) => ({
          id: index + 1,
          registrarId: prof.CodeProf,
          name: `${prof.FirstName} ${prof.LastName}`,
          specialty: prof.Specialite,
          email: prof.Email,
        }));
        setProfessorsList(transformedData);
      })
      .catch((error) => {
        console.error('Error fetching professors:', error);
      });
  }, []);
  //elements fetch
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/element')
      .then((response) => {
        const transformedData = response.data.map((elmt, index) => ({
          id: index + 1,
          name: elmt.ElementName,  
        }));
        setElementsList(transformedData);
      })
      .catch((error) => {
        console.error('Error fetching elements:', error);
      });
  }, []);
  const [data, setElementsList] = useState([]);
  const elemttable = [
      { field: "id", headerName: "ID", flex: 0.5 },
      {
        field: "name", headerName: "Element Name", flex: 1,
         cellClassName: "name-column--cell",
      },
  ];
  const columnsProf = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "registrarId", headerName: "Professor Code", flex: 1 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "specialty",
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
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Modify*/}
            <IconButton onClick={() => handleUpdate(params.row.id)} style={{ color: 'blue' }}>
            <EditIcon />
            </IconButton>
            
            {/* Delete*/}
            <IconButton
              onClick={() => handleDelete(params.row.id)}
               style={{ color: 'red' }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/professors/delete/${id}`)
      .then((response) => {
        console.log('Professor deleted successfully:', response);
        setProfessorsList((prevState) =>
          prevState.filter((professor) => professor.id !== id)
        );
      })
      .catch((error) => {
        console.error('Error deleting professor:', error);
      });
  };

  
  
  const ElemtAffectation = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "email",
      headerName: "Professor Code",
      flex: 1,
      cellClassName: "name-column--cell",
    },
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
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Modify Button (Edit Icon) */}
            <IconButton
               style={{ color: 'blue' }}
            >
              <EditIcon />
            </IconButton>
            
            {/* Delete Button (Delete Icon) */}
            <IconButton
               style={{ color: 'red' }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
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

  


  return (
    <Box m="20px">
      <Header title="Professors :" subtitle="List of Professors And their affected element" />
      <Box m="20px" style={{ backgroundColor: '#f9f9f9', borderRadius: '15px', padding: '20px', boxShadow: '2px 8px 8px rgba(26, 24, 24, 0.1)' }}>
        <Box display="flex" gap="20px" mb="20px">
          <Box flex={1} width="75%" display="flex" flexDirection="column" gap="20px">
            <Box display="flex" gap="20px">
              <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="professorCode" style={labelStyle}>Professor Code:</label>
                <input
                  type="text"
                  style={inputStyle}
                  id="professorCode"
                  name="professorCode"
                  value={professorData.professorCode}
                  onChange={handleChange}
                />
              </Box>
              <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="firstName" style={labelStyle}>First Name:</label>
                <input
                  type="text"
                  style={inputStyle}
                  id="firstName"
                  name="firstName"
                  value={professorData.firstName}
                  onChange={handleChange}
                />
              </Box>
            </Box>
            <Box display="flex" gap="20px">
              <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="lastName" style={labelStyle}>Last Name:</label>
                <input
                  type="text"
                  style={inputStyle}
                  id="lastName"
                  name="lastName"
                  value={professorData.lastName}
                  onChange={handleChange}
                />
              </Box>
              <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="specialty" style={labelStyle}>Specialty:</label>
                <input
                  type="text"
                  style={inputStyle}
                  id="specialty"
                  name="specialty"
                  value={professorData.specialty}
                  onChange={handleChange}
                />
              </Box>
            </Box>
            <Box display="flex" gap="20px">
              <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="email" style={labelStyle}>E-mail:</label>
                <input
                  type="email"
                  style={inputStyle}
                  id="email"
                  name="email"
                  value={professorData.email}
                  onChange={handleChange}
                />
              </Box>
              <Box flex={1} display="flex" justifyContent="center" alignItems="center">
                <button style={buttonStyle} onClick={addProfessor} type="submit">Submit</button>
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
                rows={data}
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
                    height: '500px',  
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
            rows={professorsList}
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
