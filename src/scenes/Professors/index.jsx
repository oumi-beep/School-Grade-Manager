import { Box, useTheme } from "@mui/material";
import { Header } from "../../components";
import { DataGrid, GridToolbar, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const Professors = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [elementsListProfID, setElementsListProfID] = useState([]);  
  const [selectedProfessorCode, setSelectedProfessorCode] = useState(null); 
  const [selectedElements, setSelectedElements] = useState([]);

  const fetchElementsForProfessor = (professorCode) => {
    if (!professorCode) return;  
     
  
  
    axios
      .get(`http://localhost:8080/api/element/elements_professors/${professorCode}`)
      .then((response) => {
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const transformedData = response.data.map((elmt) => ({
            id: elmt.ElementId, // Use ElementId from backend
            name: elmt.ElementName,
            CodeProf: elmt.CodeProf,
          }));
          setElementsListProfID(transformedData); // Update elements list
      
        } else {
          console.log('No elements found for this professor');
          setElementsListProfID([]);   
        }
      })
      .catch((error) => {
        console.error('Error fetching elements:', error);
        setElementsListProfID([]);   
      });
  };
  //For elemnts tockens affected to a professor
  useEffect(() => {
    fetchElementsForProfessor(selectedProfessorCode);
    
  }, [selectedProfessorCode]); // Re-fetch when selectedProfessorCode changes
  

    const handleFetchElements = (professorCode) => {
        console.log('Selected Professor Code:', professorCode); 
        setSelectedProfessorCode(professorCode); 
    };
    

   
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
  
    let response;
    
    if (isEditMode) {
      response = await fetch(`http://localhost:8080/api/professors/update/${editingProfessor.idUser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codeProf: professorData.professorCode,
          prenomUser: professorData.firstName,
          nomUser: professorData.lastName,
          specialite: professorData.specialty,
          email: professorData.email,
          // Add the selected elements to the update request
        }),
      });
    } else {
      response = await fetch('http://localhost:8080/api/professors/add', {
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
    }
  
    if (response.ok) {
      alert(isEditMode ? 'Professor updated successfully' : 'Professor added successfully');
      fetchProfessorsData(); // Refresh the professors list
       const newProfessor = {
        id: professorsList.length + 1,
        idUser: isEditMode ? editingProfessor.idUser : professorsList.length + 1,
        registrarId: professorData.professorCode,
        name: `${professorData.firstName} ${professorData.lastName}`,
        specialty: professorData.specialty,
        email: professorData.email,
      };
  
      setProfessorsList((prevState) =>
        isEditMode
          ? prevState.map((prof) =>
              prof.idUser === editingProfessor.idUser ? newProfessor : prof
            )
          : [...prevState, newProfessor]
      );
  
      setProfessorData({
        professorCode: '',
        firstName: '',
        lastName: '',
        specialty: '',
        email: '',
      });
      setIsEditMode(false);
      setEditingProfessor(null);
    } else {
      alert(isEditMode ? 'Failed to update professor' : 'Failed to add professor');
    }
  };
  
  const fetchProfessorsData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/professors');
      const transformedData = response.data.map((prof, index) => ({
        id: index + 1,
        idUser: prof.UserId,
        registrarId: prof.CodeProf,
        name: `${prof.FirstName} ${prof.LastName}`,
        specialty: prof.Specialite,
        email: prof.Email,
      }));
      return transformedData;
    } catch (error) {
      console.error('Error fetching professors:', error);
      return []; // Return an empty array in case of an error
    }
  };

  useEffect(() => {
    const fetchAndSetProfessors = async () => {
      const professorsData = await fetchProfessorsData();
      setProfessorsList(professorsData);
    };
    fetchAndSetProfessors();
  }, []);


  const fetchElements = () => {
    axios
      .get('http://localhost:8080/api/element')
      .then((response) => {
        const transformedData = response.data.map((elmt, index) => ({
          id: index + 1,
          ElementID: elmt.ElementID,
          name: elmt.ElementName,
        }));
        setElementsList(transformedData);
      })
      .catch((error) => {
        console.error('Error fetching elements:', error);
      });
  };

  useEffect(() => {
    fetchElements(); // Fetch elements initially
  }, []);
  
  const [data, setElementsList] = useState([]);
  const elemttable = [
      { field: "id", headerName: "ID", flex: 0.5 },
      {
        field: "ElementID", headerName: "Id Element", flex: 1,
         cellClassName: "name-column--cell",
      },
      {
        field: "name", headerName: "Element Name", flex: 1,
         cellClassName: "name-column--cell",
      },
      {
        field: "test",
        headerName: "Action",
        flex: 1,
        renderCell: (params) => {
          return (
            <div style={{ display: 'flex', gap: '10px' }}>
      
              {/* Delete Button */}
              <IconButton
                  style={{ color: 'blue' }}
                  onClick={() => handleSubmitt( )} 
                >
                <AddIcon /> 
                </IconButton>
            </div>
          );
        },
      },
  ];
  const columnsProf = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "idUser", headerName: "User id", flex: 0.5 },
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
            
            <IconButton   onClick={() => handleEdit(params.row)} style={{ color: 'blue' }}>
            <EditIcon />
            </IconButton>
            
            {/* Delete*/}
            <IconButton
              onClick={() => handleDelete(params.row.idUser)}
               style={{ color: 'red' }}
            >
              <DeleteIcon />
            </IconButton>
            {/* View */}
            <IconButton
              onClick={() => handleFetchElements(params.row.registrarId)}    
              style={{ color: "black" }}
              title="Afficher" 
            >
              <VisibilityIcon />
            </IconButton>

          
         
          </div>
        );
      },
    },
  ];



  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState(null);

  const handleEdit = (professor) => {
    handleProfessorSelect(professor.idUser);
    setEditingProfessor(professor);
    setProfessorData({
      professorCode: professor.registrarId,
      firstName: professor.name.split(' ')[0],
      lastName: professor.name.split(' ')[1],
      specialty: professor.specialty,
      email: professor.email,
    });
    setIsEditMode(true);
  };
  


  const handleDelete = (idUser) => {
    axios
      .delete(`http://localhost:8080/api/professors/delete/${idUser}`)
      .then((response) => {
        alert("Professor deleted successfully!");
      
         setProfessorsList((prevState) =>
          prevState.filter((professor) => professor.idUser !== idUser)
        );
        
      })
      .catch((error) => {
        console.error("Error deleting professor:", error);
      });
  };

  const handleRemoveProfessor = async (id) => {
    if (!window.confirm("Are you sure you want to remove the professor from this element?")) {
      return;
    }

    try {
       const response = await axios.put(`http://localhost:8080/api/element/${id}/remove-professor`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        alert('Professor removed successfully');
        // Directly update the list by filtering out the deleted element
        setElementsListProfID((prevList) =>
          prevList.filter((elmt) => elmt.id !== id)
        );
        fetchElements(); // Refresh the elements list
      }else {
        alert('Failed to remove the professor');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while trying to remove the professor.');
    }
  };

  
 
  const ElemtAffectation = [ 
    { field: "id", 
      headerName: "ID",
      flex: 0.5 },
      {
      field: "name",
      headerName: "Element Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "CodeProf",
      headerName: "Professor Code",
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
    
            {/* Delete Button */}
            <IconButton
                style={{ color: 'red' }}
                onClick={() => handleRemoveProfessor(params.row.id)} 
              >
                <DeleteIcon />
              </IconButton>
          </div>
        );
      },
    },
  ];
  const [selectedProfessorId, setSelectedProfessorId] = useState(null);

  const handleProfessorSelect = (professorId) => {
    setSelectedProfessorId(professorId);
    console.log("Selected Professor ID:", professorId); 
  };
 
  const handleRowClick = (params) => {
    const selectedRowId = params.row.ElementID; // Get the ID of the clicked row
    console.log('Selected Row ID:', selectedRowId);

    // Toggle selection and handle submission
    setSelectedElements((prevSelected) => {
        let newSelectedElements;

        if (prevSelected.includes(selectedRowId)) {
            // Remove from selected if already selected
            newSelectedElements = prevSelected.filter((ElementID) => ElementID !== selectedRowId);
        } else {
            // Add to selected if not selected
            newSelectedElements = [...prevSelected, selectedRowId];
        }

        // Submit the selected elements
        handleSubmitt(newSelectedElements);

        // Free the selected row 
        return newSelectedElements.filter((ElementID) => ElementID !== selectedRowId);
    });
};


const handleSubmitt = (newSelectedElements) => {
    if (!selectedProfessorId) {
      alert("Please select a professor to assign the elements to.");
        console.log("No professor selected");
        return;
    }

    // Confirm the action before proceeding
    const isConfirmed = window.confirm("Are you sure you want to assign these elements to the professor?");
    if (!isConfirmed) {
        console.log("Affectation canceled.");
        return; // Stop the function if not confirmed
    }

    // Send POST request for each selected element
    newSelectedElements.forEach((elementId) => {
        const url = `http://localhost:8080/api/professors/${selectedProfessorId}/${elementId}`;
        console.log('Sending POST request to:', url);

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (response.ok) {
                console.log(`Element ${elementId} successfully added to Professor ${selectedProfessorId}`);
                fetchElements();
                fetchElementsForProfessor(selectedProfessorCode);
            } else {
                console.log(`Failed to add element ${elementId} to Professor ${selectedProfessorId}`);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
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
                  disabled={isEditMode}
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
                <button style={buttonStyle} onClick={addProfessor} type="submit"> 
                {isEditMode ? 'Update' : 'Submit'}
                </button>
              </Box>
            </Box>
          </Box>

          {/* Right Side  */}
          <Box width= "25%"  gap="20px"  height={"75vh"}  >
              <label 
                style={{ ...labelStyle, fontWeight: 'bold', marginBottom: '2px', fontSize: '1.2rem', color: '#2196F3' }}>
                Element List:
              </label>
              <DataGrid 
                rows={data}
                columns={elemttable}
                selectedProfessorId={selectedProfessorId} 
                onRowClick={handleRowClick}                 // onRowSelected not needed anymore
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
            rows={elementsListProfID}
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
