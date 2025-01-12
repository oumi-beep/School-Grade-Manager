import React, { useState, useEffect } from "react";
import axios from "axios";
import './indexStart.scss';
import { Box, useTheme } from "@mui/material";
import { Header } from "../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';


const SemestersList = () => {
  const [semesters, setSemesters] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [elements, setElements] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedFiliereId, setSelectedFiliereId] = useState(null);
  const [loadingSemesters, setLoadingSemesters] = useState(true);
  const [loadingFilieres, setLoadingFilieres] = useState(false);
  const [loadingElements, setLoadingElements] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [error, setError] = useState(null);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [ModalitiesId, setModalitiesId] = useState([]);
  const [studentData, setStudentData] = useState({
    name: '',
    surname: '',
    cse: '',
    evaluationMode: '',
    modality: '',
    note: '',
  });

  const [modalities, setModalities] = useState([]);
  const [loadingModalities, setLoadingModalities] = useState(false);
  const [currentElement, setCurrentElement] = useState(null);

  const professorId = localStorage.getItem("userId");

  const colors = {
    greenAccent: ['#28a745', '#4CAF50'],
    primary: ['#1976d2', '#1565c0'],
    gray: ['#616161', '#757575'],
  };


  //
  const handleSaveNotes = async () => {
    // Create a List of Maps where each map contains key-value pairs
    const notesList = modalities.map((modality) => ({
      studentId: studentData.cse,  // Student ID
      elementId: currentElement.idElement,  // Element ID
      modalityId: modality.idModeEval,  // Modality ID
      note: studentData.notes?.[modality.id] || '',  // The note entered for this modality
    }));

    console.log(notesList);

    try {
      // Send the notesList (List of Maps) to the backend
      const response = await fetch('http://localhost:8080/api/notes/addnoteModalite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notesList),  // Sending the List<Map>
      });

      // Handle response from the backend
      if (response.ok) {
        alert('Notes saved successfully');
      } else {
        alert('Failed to save notes');
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('An error occurred while saving notes');
    }

    // Close the modal after saving
    setOpenModal(false);
  };



  // Handle note change for each modality
  const handleNoteChange = (modalityId, note) => {
    setStudentData((prevData) => ({
      ...prevData,
      notes: {
        ...prevData.notes,
        [modalityId]: note,
      },
    }));
  };

  const fetchModalities = (elementId) => {
    setLoadingModalities(true);
    axios
      .get(`http://localhost:8080/api/element/modes/${elementId}`)
      .then((response) => {

        const transformedData = response.data.map((modality, index) => ({
          id: index + 1,
          ...modality,
        }));

        const modalityIds = transformedData.map(modality => modality.idmodalite);
        setModalitiesId(modalityIds); // Store all idmodalite values

        setModalities(transformedData);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des modalités :", error);
      })
      .finally(() => {
        setLoadingModalities(false);
      });
  };

  const handleOpenModal = (student) => {
    if (!currentElement) {
      alert("Please select an element first");
      return;
    }

    setStudentData({
      name: student.nomEtudiant,
      surname: student.prenomEtudiant,
      cse: student.cneEtudiant,
      modality: '',
      note: '',
    });

    fetchModalities(currentElement.idElement);
    setOpenModal(true);
  };


  const columns = [
    { field: 'cneEtudiant', headerName: "CNE", width: 150 },
    { field: 'nomEtudiant', headerName: 'Last Name', width: 150 },
    { field: 'prenomEtudiant', headerName: 'First Name', width: 150 },
    { field: 'niveau', headerName: 'Level', width: 150 },
    { field: 'note', headerName: 'Note', width: 150 },
    { field: 'etatNote', headerName: 'État Note', width: 150 },
    { field: 'absent', headerName: 'Absent', width: 150 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <IconButton
            style={{ color: 'blue' }}
            onClick={() => handleOpenModal(params.row)}
          >
            <AddIcon />
          </IconButton>
          <IconButton style={{ color: 'blue' }}>
            <VisibilityIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleCloseModal = () => setOpenModal(false);


  // Fetch Semesters
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/professors/${professorId}/semesters`
        );
        setSemesters(response.data);
      } catch (err) {
        console.error("Failed to fetch semesters:", err);
        setError("Failed to fetch semesters.");
      } finally {
        setLoadingSemesters(false);
      }
    };

    fetchSemesters();
  }, [professorId]);

  const fetchFilieres = async (semesterId) => {
    setLoadingFilieres(true);
    setFilieres([]);
    setElements([]);
    setStudents([]);
    setCurrentElement(null);

    try {
      const response = await axios.get(
        'http://localhost:8080/api/filieres/findBySemesterAndProfessor',
        { params: { semesterId, professorId } }
      );
      setFilieres(response.data);
    } catch (err) {
      console.error("Failed to fetch filieres:", err);
      setError("Failed to fetch filieres.");
    } finally {
      setLoadingFilieres(false);
    }
  };

  const fetchElements = async (filiereId) => {
    setLoadingElements(true); // Start loading state
    setElements([]); // Reset elements
    setStudents([]); // Reset students
    setCurrentElement(null); // Reset current element
    setSelectedFiliereId(filiereId);

    try {
      const response = await axios.get(
        'http://localhost:8080/api/element/elements/findByProfessorFiliereSemester',
        {
          params: {
            filiereId,
            professorId,
            semesterId: selectedSemester?.id, // Ensure semesterId is passed
          },
        }
      );
      setElements(response.data);
    } catch (error) {
      console.error("Failed to fetch elements:", error);
      setError("Failed to fetch elements."); // Handle error
    } finally {
      setLoadingElements(false); // End loading state
    }
  };

  //fetch studets
  const fetchStudents = async (element) => {
    // Save the selected element
    setCurrentElement(element);
    if (!selectedSemester) {
      alert("Please select a semester.");
      return;
    }

    if (!selectedFiliereId) {
      alert("Please select a Filiere.");
      return;
    }

    let niveau;
    if (["S1", "S2"].includes(selectedSemester.name)) {
      niveau = "1ère année";
    } else if (["S3", "S4"].includes(selectedSemester.name)) {
      niveau = "2ème année";
    } else if (selectedSemester.name === "S5") {
      niveau = "3ème année";
    } else {
      alert("Invalid semester name.");
      return;
    }

    setLoadingStudents(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/etudiants/StudentList/${selectedFiliereId}/${niveau}`
      );
      setStudents(response.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to fetch students.");
    } finally {
      setLoadingStudents(false);
    }
  };


  const handleSemesterSelection = (semester) => {
    setSelectedSemester(semester);
    fetchFilieres(semester.id);
  };

  if (loadingSemesters) return <p>Loading semesters...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="semesterss-container">
        <h1>Semesters Assigned</h1>
        <ul>
          {semesters.map((semester) => (
            <li key={semester.id}>
              <button onClick={() => handleSemesterSelection(semester)}>
                <strong>{semester.name}</strong>
              </button>
            </li>
          ))}
        </ul>

        {loadingFilieres && <p>Loading filières...</p>}
        {filieres.length > 0 && !loadingFilieres && (
          <div className="filiere-container">
            <h2>Filières for Selected Semester</h2>
            <ul>
              {filieres.map((filiere) => (
                <li key={filiere.filiereId}>
                  <button onClick={() => fetchElements(filiere.filiereId)}>
                    <strong>{filiere.filiereName}</strong>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {loadingElements && <p>Loading elements...</p>}
        {elements.length > 0 && !loadingElements && (
          <div className="element-container">
            <h2>Elements for Selected Filière</h2>
            <ul>
              {elements.map((element) => (
                <li key={element.idElement}>
                  <button onClick={() => fetchStudents(element)}>
                    <strong>{element.nomElement}</strong>
                  </button>
                  <p>Coefficient: {element.coefficient}</p>
                  <p>Module: {element.module.nomModule}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="student-container">
        <h2>Students for Selected Element</h2>
        <Box display="flex" gap="20px" height="75vh">
          <Box flex={1} sx={{ maxWidth: '100%' }}>
            <DataGrid
              rows={students}
              columns={columns}
              getRowId={(row) => row.idEtudiant}
              components={{ Toolbar: GridToolbar }}
              checkboxSelection
              sx={{
                '& .MuiDataGrid-root': { border: 'none' },
                '& .MuiDataGrid-cell': { border: 'none' },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#d8eaf4',
                  borderBottom: 'none',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: 'none',
                  backgroundColor: '#d8eaf4',
                },
                '& .MuiDataGrid-virtualScroller': {
                  backgroundColor: colors.primary[400],
                },
                '& .MuiCheckbox-root': {
                  color: `${colors.greenAccent[200]} !important`,
                },
                '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
                  color: `${colors.gray[100]} !important`,
                },
              }}
            />
          </Box>
        </Box>
      </div>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Enter Notes for {studentData.name} {studentData.surname}</DialogTitle>
        <DialogContent>
          {modalities.length > 0 ? (
            modalities.map((modality) => (
              <TextField
                key={modality.id}
                label={`Note for ${modality.nomMode}`}
                type="number"
                value={studentData.notes?.[modality.id] || ''}
                onChange={(e) => handleNoteChange(modality.id, e.target.value)}
                fullWidth
                margin="normal"
                inputProps={{ min: 0, max: 20, step: 0.25 }}
              />
            ))
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveNotes} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default SemestersList;