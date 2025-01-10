import React, { useState, useEffect } from "react";
import axios from "axios";
import './indexStart.scss';
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { 
  IconButton, Dialog, DialogActions, DialogContent, DialogTitle, 
  TextField, Button, CircularProgress, Alert 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

const API_BASE_URL = 'http://localhost:8080/api';

const SemestersList = () => {
  // State Management
  const [state, setState] = useState({
    semesters: [],
    filieres: [],
    elements: [],
    students: [],
    modalities: [],
    selectedFiliereId: null,
    selectedSemester: null,
    currentElement: null,
    error: null
  });

  const [loading, setLoading] = useState({
    semesters: true,
    filieres: false,
    elements: false,
    students: false,
    modalities: false
  });

  const [modal, setModal] = useState({
    open: false,
    studentData: {
      name: '',
      surname: '',
      cse: '',
      modality: '',
      note: ''
    }
  });

  const professorId = localStorage.getItem("userId");

  // API Calls
  const api = {
    async get(endpoint, params) {
      try {
        const response = await axios.get(`${API_BASE_URL}/${endpoint}`, { params });
        return response.data;
      } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw new Error(error.response?.data?.message || 'An error occurred');
      }
    },

    async post(endpoint, data) {
      try {
        const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data);
        return response.data;
      } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw new Error(error.response?.data?.message || 'An error occurred');
      }
    }
  };

  // Data Fetching Functions
  const fetchSemesters = async () => {
    setLoading(prev => ({ ...prev, semesters: true }));
    try {
      const data = await api.get(`professors/${professorId}/semesters`);
      setState(prev => ({ ...prev, semesters: data }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, semesters: false }));
    }
  };

  const fetchFilieres = async (semesterId) => {
    setLoading(prev => ({ ...prev, filieres: true }));
    setState(prev => ({ ...prev, filieres: [], elements: [], students: [], currentElement: null }));
    
    try {
      const data = await api.get('filieres/findBySemesterAndProfessor', { 
        semesterId, 
        professorId 
      });
      setState(prev => ({ ...prev, filieres: data }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, filieres: false }));
    }
  };

  const fetchElements = async (filiereId) => {
    setLoading(prev => ({ ...prev, elements: true }));
    setState(prev => ({ 
      ...prev, 
      selectedFiliereId: filiereId,
      elements: [],
      students: [],
      currentElement: null 
    }));

    try {
      const data = await api.get('element/findByFiliereAndProfessorAsMap', {
        filiereId,
        professorId
      });
      setState(prev => ({ ...prev, elements: data }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, elements: false }));
    }
  };

  const fetchModalities = async (elementId) => {
    setLoading(prev => ({ ...prev, modalities: true }));
    try {
      const data = await api.get(`element/modes/${elementId}`);
      const transformedData = data.map((modality, index) => ({
        id: index + 1,
        ...modality
      }));
      setState(prev => ({ ...prev, modalities: transformedData }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, modalities: false }));
    }
  };

  const fetchStudents = async (element) => {
    if (!state.selectedSemester || !state.selectedFiliereId) {
      setState(prev => ({ 
        ...prev, 
        error: "Please select both semester and filiere first" 
      }));
      return;
    }

    const getNiveau = (semesterName) => {
      if (["S1", "S2"].includes(semesterName)) return "1ère année";
      if (["S3", "S4"].includes(semesterName)) return "2ème année";
      if (semesterName === "S5") return "3ème année";
      throw new Error("Invalid semester name");
    };

    setLoading(prev => ({ ...prev, students: true }));
    setState(prev => ({ ...prev, currentElement: element }));

    try {
      const niveau = getNiveau(state.selectedSemester.name);
      const data = await api.get(
        `etudiants/StudentList/${state.selectedFiliereId}/${niveau}`
      );
      setState(prev => ({ ...prev, students: data }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  // Event Handlers
  const handleOpenModal = async (student) => {
    if (!state.currentElement) {
      setState(prev => ({ ...prev, error: "Please select an element first" }));
      return;
    }

    setModal(prev => ({
      ...prev,
      open: true,
      studentData: {
        name: student.nomEtudiant,
        surname: student.prenomEtudiant,
        cse: student.cneEtudiant,
        studentId: student.idEtudiant,
        modality: '',
        note: ''
      }
    }));

    await fetchModalities(state.currentElement.idElement);
  };

  const handleSubmit = async () => {
    const { currentElement } = state;
    const { modality, note, studentId } = modal.studentData;

    if (!currentElement || !modality || !note) {
      setState(prev => ({ ...prev, error: "Please fill all required fields" }));
      return;
    }

    try {
      await api.post('notes/add', {
        elementId: currentElement.idElement,
        studentId,
        professorId,
        note: parseFloat(note),
        modalityId: modality
      });
      
      setModal(prev => ({ ...prev, open: false }));
      await fetchStudents(currentElement);
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
    }
  };

  // Initial Load
  useEffect(() => {
    fetchSemesters();
  }, [professorId]);

  // DataGrid Configuration
  const columns = [
    { field: 'cneEtudiant', headerName: 'CNE', width: 150 },
    { field: 'nomEtudiant', headerName: 'Last Name', width: 150 },
    { field: 'prenomEtudiant', headerName: 'First Name', width: 150 },
    { field: 'niveau', headerName: 'Level', width: 150 },
    { field: 'note', headerName: 'Note', width: 150 },
    { field: 'etatNote', headerName: 'Etat Note', width: 150 },
    { field: 'absent', headerName: 'Absent', width: 150 },
    {
      field:'test',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '10px' }}>
    
            {/* Add Button */}
            <IconButton
                style={{ color: 'blue' }}
                onClick={() => handleOpenModal(params.row)}
              >
              <AddIcon /> 
              </IconButton>
       
            <IconButton
                style={{ color: 'blue' }}
              >
              <VisibilityIcon/>
              </IconButton>
          </div>
        );
      }
    }     
  ];

  return (
    <div className="semesterss-container">
    <h1>Semesters Assigned</h1>
    {loading.semesters ? (
      <p className="loadingg">Loading semesters...</p>
    ) : state.error ? (
      <p className="errorr">{state.error}</p>
    ) : (
      <ul>
        {state.semesters.map((semester) => (
          <li key={semester.semesterId}>
            <button onClick={() => handleSemesterSelection(semester)}>
              <strong>{semester.name}</strong>
            </button>
          </li>
        ))}
      </ul>
    )}
  
    {/* Filières Section */}
    {loading.filieres ? (
      <CircularProgress />
    ) : (
      state.filieres.length > 0 && (
        <div className="filiere-container mt-8">
          <h2 className="text-xl font-bold mb-4">Filières</h2>
          <div className="flex gap-4">
            {state.filieres.map((filiere) => (
              <button
                key={filiere.filiereId}
                onClick={() => fetchElements(filiere.filiereId)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {filiere.filiereName}
              </button>
            ))}
          </div>
        </div>
      )
    )}
  
    {/* Elements Section */}
    {loading.elements ? (
      <CircularProgress />
    ) : (
      state.elements.length > 0 && (
        <div className="element-container mt-8">
          <h2 className="text-xl font-bold mb-4">Elements</h2>
          <div className="grid grid-cols-3 gap-4">
            {state.elements.map((element) => (
              <div
                key={element.idElement}
                className="p-4 border rounded-lg shadow-sm"
              >
                <button
                  onClick={() => fetchStudents(element)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {element.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )
    )}
 
      {/* Students DataGrid */}
      {state.students.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Students</h2>
          <Box height="75vh">
            <DataGrid
              rows={state.students}
              columns={columns}
              getRowId={(row) => row.idEtudiant}
              components={{ Toolbar: GridToolbar }}
              checkboxSelection
              className="bg-white"
            />
          </Box>
        </div>
      )}

      {/* Add Notes Modal */}
      <Dialog 
        open={modal.open} 
        onClose={() => setModal(prev => ({ ...prev, open: false }))}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Add Notes for {modal.studentData.name} {modal.studentData.surname}
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Modalité"
            value={modal.studentData.modality}
            onChange={(e) => setModal(prev => ({
              ...prev,
              studentData: { ...prev.studentData, modality: e.target.value }
            }))}
            fullWidth
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value="" disabled>
              {loading.modalities ? "Loading..." : "Select a modality"}
            </option>
            {state.modalities.map((modality) => (
              <option key={modality.id} value={modality.id}>
                {modality.nomMode}
              </option>
            ))}
          </TextField>
          <TextField
            label="Note"
            type="number"
            value={modal.studentData.note}
            onChange={(e) => setModal(prev => ({
              ...prev,
              studentData: { ...prev.studentData, note: e.target.value }
            }))}
            fullWidth
            margin="normal"
            inputProps={{ min: 0, max: 20, step: 0.25 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModal(prev => ({ ...prev, open: false }))}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SemestersList;