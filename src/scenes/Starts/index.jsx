import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import './indexStart.scss';
import { Box, useTheme } from "@mui/material";
import { Header } from "../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { MenuItem, DialogContentText, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const INITIAL_STATE = {
  name: '',
  idEtudiant: '',
  surname: '',
  cse: '',
  evaluationMode: '',
  modality: '',
  absent: '',
  note: '',
  notes: {},
  absences: {}
};

const SemestersList = () => {
  // State Management
  const [semesters, setSemesters] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [elements, setElements] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedFiliereId, setSelectedFiliereId] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [currentElement, setCurrentElement] = useState(null);
  const [modalities, setModalities] = useState([]);
  const [studentData, setStudentData] = useState(INITIAL_STATE);
  const [isElementValidated, setIsElementValidated] = useState(false);
  const [average, setAverage] = useState(null);

  const fetchElementAverage = async (elementId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/element/average/${elementId}`);
      setAverage(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching element average:", error);
    }
  };
  // Loading States
  const [loading, setLoading] = useState({
    semesters: true,
    filieres: false,
    elements: false,
    students: false,
    modalities: false
  });

  // UI States
  const [openModal, setOpenModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingNote, setPendingNote] = useState(null);
  const [error, setError] = useState(null);

  const professorId = localStorage.getItem("userId");

  // API calls with error handling
  const apiCall = async (url, options = {}) => {
    try {
      const response = await axios({
        url: `http://localhost:8080/api${url}`,
        ...options
      });
      return response.data;
    } catch (error) {
      console.error(`API Error (${url}):`, error);
      setError(error.message);
      throw error;
    }
  };

  // Calculate element note
  const calculateElementNote = async (studentId, elementId, filiereId) => {
    try {
      return await apiCall(`/notes/calculate/${studentId}/${elementId}/${filiereId}`, {
        method: 'POST'
      });
    } catch (error) {
      console.error("Error calculating note:", error);
      throw error;
    }
  };

  // Update student list
  const updateStudentList = async () => {
    if (currentElement && selectedFiliereId) {
      await fetchStudents(currentElement, currentElement.idElement);
    }
  };

  // Handle save notes
  const handleSaveNotes = async () => {
    try {
      const notesList = modalities
        .map((modality) => ({
          studentId: studentData.idEtudiant,
          elementId: currentElement.idElement,
          modalityId: modality.idModeEval,
          note: studentData.absences?.[modality.idModeEval] ? 0 : studentData.notes?.[modality.idModeEval],
          absent: studentData.absences?.[modality.idModeEval] ?? false,
        }))
        .filter(note => note.note !== '' || note.note === 0);

      const checkResponse = await apiCall(`/modalite-notes/checkNotes/${studentData.idEtudiant}/${currentElement.idElement}`);

      if (checkResponse && checkResponse.exists) {
        await apiCall('/modalite-notes/updateNoteModalite', {
          method: 'PUT',
          data: notesList
        });

      } else {
        await apiCall('/modalite-notes/addnoteModalite', {
          method: 'POST',
          data: notesList
        });
      }

      await calculateElementNote(
        studentData.idEtudiant,
        currentElement.idElement,
        selectedFiliereId
      );

      await updateStudentList();
      alert('Notes saved and calculated successfully');
      fetchElementAverage(currentElement.idElement)
      setOpenModal(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('An error occurred while saving notes');
      setOpenModal(false);
    }
  };

  // Fetch notes for student
  const fetchNotesForStudent = async (studentId, elementId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/notes/getNotes/${studentId}/${elementId}`
      );

      console.log("Raw API Response:", response.data);

      if (response.data && typeof response.data === "object") {
        // Transform the data structure to match what the form expects
        const notes = {};
        const absences = {}; // Create an object to store the absence data

        Object.entries(response.data).forEach(([modalityId, noteData]) => {
          // Convert modalityId to integer and store the note value
          notes[parseInt(modalityId)] = noteData.note;

          // Also store the absence status for each modality
          absences[parseInt(modalityId)] = noteData.absent || false; // Default to false if not provided
        });

        console.log("Processed Notes:", notes);
        console.log("Processed Absences:", absences);

        // Update the studentData state
        setStudentData((prevData) => ({
          ...prevData,
          notes: notes,
          absences: absences,
        }));
      }
    } catch (error) {
      console.error("Error fetching notes for student:", error);
    }
  };


  // Handle note change
  const handleNoteChange = useCallback((modalityId, note) => {
    setStudentData((prevData) => ({
      ...prevData,
      notes: {
        ...prevData.notes,
        [modalityId]: note,
      },
    }));
  }, []);

  // Handle note input
  const handleNoteInput = useCallback((modalityId, value) => {
    const numericValue = parseFloat(value);

    if (numericValue < 0 || numericValue > 20) {
      return;
    }

    if (!studentData.absences?.[modalityId]) {
      setStudentData((prevData) => ({
        ...prevData,
        notes: {
          ...prevData.notes,
          [modalityId]: numericValue
        }
      }));
    }

    if (numericValue === 0 || numericValue === 20) {
      setPendingNote({ modalityId, value: numericValue });
      setConfirmOpen(true);
    } else {
      handleNoteChange(modalityId, numericValue);
    }
  }, [studentData.absences, handleNoteChange]);

  // Handle absence change
  const handleAbsenceChange = useCallback((modalityId, isAbsent) => {
    setStudentData((prevState) => ({
      ...prevState,
      absences: {
        ...prevState.absences,
        [modalityId]: isAbsent,
      },
      notes: {
        ...prevState.notes,
        [modalityId]: isAbsent ? 0 : prevState.notes?.[modalityId],
      },
    }));
  }, []);

  // Handle modal open
  const handleOpenModal = async (student) => {
    if (!currentElement) {
      alert("Please select an element first");
      return;
    }

    console.log("Opening modal for student:", student);
    console.log("Current element:", currentElement);

    setStudentData({
      ...INITIAL_STATE,
      name: student.nomEtudiant,
      idEtudiant: student.idEtudiant,
      surname: student.prenomEtudiant,
      cse: student.cneEtudiant,
    });

    try {
      // Fetch modalities first
      await fetchModalities(currentElement.idElement);

      // Then fetch notes
      console.log("Fetching notes for:", {
        studentId: student.idEtudiant,
        elementId: currentElement.idElement
      });

      await fetchNotesForStudent(student.idEtudiant, currentElement.idElement);

      console.log("StudentData after fetching:", studentData);

      setOpenModal(true);
    } catch (error) {
      console.error("Error in handleOpenModal:", error);
    }
  };

  const colors = {
    greenAccent: ['#28a745', '#4CAF50'],
    primary: ['#1976d2', '#1565c0'],
    gray: ['#616161', '#757575'],
  };

  // Fetch modalities
  const fetchModalities = async (elementId) => {
    setLoading(prev => ({ ...prev, modalities: true }));
    try {
      const response = await apiCall(`/element/modes/${elementId}`);
      const transformedData = response.map(({ idModeEval, nomMode }, index) => ({
        id: index + 1,
        idModeEval,
        nomMode,
      }));
      setModalities(transformedData);
    } catch (error) {
      console.error("Error fetching modalities:", error);
    } finally {
      setLoading(prev => ({ ...prev, modalities: false }));
    }
  };

  // DataGrid columns
  const columns = [
    { field: 'cneEtudiant', headerName: "CNE", width: 150 },
    { field: 'nomEtudiant', headerName: 'Last Name', width: 150 },
    { field: 'prenomEtudiant', headerName: 'First Name', width: 150 },
    { field: 'niveau', headerName: 'Level', width: 150 },
    { field: 'note', headerName: 'Note', width: 150 },
    { field: 'etatNote', headerName: 'État Note', width: 150 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <IconButton
            style={{
              color: isElementValidated ? 'gray' : 'blue'
            }}
            onClick={() => handleOpenModal(params.row)}
            disabled={isElementValidated}
          >
            <AddIcon />
          </IconButton>

        </div>
      ),
    },
  ];

  // Handle confirm/cancel for note confirmation dialog
  const handleConfirm = () => {
    if (pendingNote) {
      handleNoteChange(pendingNote.modalityId, pendingNote.value);
      setPendingNote(null);
    }
    setConfirmOpen(false);
  };

  const handleCancel = () => {
    setPendingNote(null);
    setConfirmOpen(false);
  };

  // Fetch initial data
  useEffect(() => {
    const fetchInitialSemesters = async () => {
      try {
        const response = await apiCall(`/professors/${professorId}/semesters`);
        setSemesters(response);
      } catch (error) {
        console.error("Failed to fetch semesters:", error);
      } finally {
        setLoading(prev => ({ ...prev, semesters: false }));
      }
    };
    fetchInitialSemesters();
  }, [professorId]);

  // Fetch filieres
  const fetchFilieres = async (semesterId) => {
    setLoading(prev => ({ ...prev, filieres: true }));
    setFilieres([]);
    setElements([]);
    setStudents([]);
    setCurrentElement(null);

    try {
      const response = await apiCall('/filieres/findBySemesterAndProfessor', {
        params: { semesterId, professorId }
      });
      setFilieres(response);
    } catch (error) {
      console.error("Failed to fetch filieres:", error);
    } finally {
      setLoading(prev => ({ ...prev, filieres: false }));
    }
  };

  // Fetch elements
  const fetchElements = async (filiereId) => {
    setLoading(prev => ({ ...prev, elements: true }));
    setElements([]);
    setStudents([]);
    setCurrentElement(null);
    setSelectedFiliereId(filiereId);

    try {
      const response = await apiCall('/element/elements/findByProfessorFiliereSemester', {
        params: {
          filiereId,
          professorId,
          semesterId: selectedSemester?.id,
        },
      });
      setElements(response);
    } catch (error) {
      console.error("Failed to fetch elements:", error);
    } finally {
      setLoading(prev => ({ ...prev, elements: false }));
    }
  };
  const [etat, setEtat] = useState(""); // État récupéré

  const fetchEtatElement = async (elementId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/element/etat/${elementId}`
      );
      setEtat(response.data); // Met à jour l'état
      setError(""); // Réinitialise les erreurs
      return response.data; // Retourne l'état pour utilisation ultérieure
    } catch (err) {
      setError(
        err.response?.data || "Erreur lors de la récupération de l'état."
      );
      setEtat(""); // Réinitialise l'état
      return null; // Retourne null en cas d'erreur
    }
  };
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Fetch students
  const fetchStudents = async (element, elementId) => {
    // Save the selected element
    setCurrentElement(element);
    // Récupère l'état de l'élément
    const elementEtat = await fetchEtatElement(elementId);

    // Vérifie si l'état est "Validé"
    const isValidated = elementEtat === "Validé";
    setIsElementValidated(isValidated);

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
        `http://localhost:8080/api/etudiants/StudentList/${selectedFiliereId}/${niveau}/${elementId}`
      );
      setStudents(response.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to fetch students.");
    } finally {
      setLoadingStudents(false);
    }
  };


  // Handle semester selection
  const handleSemesterSelection = (semester) => {
    setSelectedSemester(semester);
    fetchFilieres(semester.id);
  };

  // Render loading state
  if (loading.semesters) {
    return <CircularProgress />;
  }

  if (loading.semesters) return <p>Loading semesters...</p>;
  if (error) return <p>{error}</p>;
  const handleElementClick = async (element) => {
    try {
      await fetchStudents(element, element.idElement);
      // Charger les étudiants
      await fetchElementAverage(element.idElement);

    } catch (error) {
      console.error("Error handling element click:", error);
    }
  };
  const handleValidateElement = async () => {
    if (!currentElement) {
      alert("Please select an element first");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/element/valider/${currentElement.idElement}`
      );

      if (response.status === 200) {
        setIsElementValidated(true);
        setCurrentElement({
          ...currentElement,
          etatElement: "Validé"
        });
        alert("Element has been validated successfully");
      }
    } catch (error) {
      console.error("Error validating element:", error);
      alert("Failed to validate element");
    }
  };

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

        {loading.filieres && <CircularProgress />}
        {filieres.length > 0 && !loading.filieres && (
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

          {loading.elements && <p>Loading elements...</p>}
          {elements.length > 0 && !loading.elements && (
            <div className="element-container">
              <h2>Elements for Selected Filière</h2>
              <ul>
                {elements.map((element) => (
                  <li key={element.idElement}>
                    <button onClick={() => handleElementClick(element)}>
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
        {average !== null && (
          <div
            style={{
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#e8f5e9', // Vert clair pour une ambiance apaisante
              borderRadius: '8px',
              border: '1px solid #c8e6c9', // Bordure légère pour mieux délimiter
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Ombre légère pour donner de la profondeur
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#2e7d32' }}> {/* Vert plus foncé pour le titre */}
              Moyenne :{' '}
              <span style={{ color: '#388e3c', fontWeight: 'bold' }}> {/* Vert équilibré pour la valeur */}
                {average.toFixed(2)}
              </span>
            </h3>
          </div>
        )}
        {currentElement && !isElementValidated && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleValidateElement}
            style={{
              marginBottom: '20px',
              backgroundColor: '#4CAF50',
              color: 'white'
            }}
          >
            Valider l'élément
          </Button>
        )}
        <Box display="flex" justifyContent="center" alignItems="center" height="75vh">

          <Box flex={1} sx={{ maxWidth: '90%' }} height="100%">

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
                  backgroundColor: isElementValidated ? '#e8f5e9' : '#d8eaf4',
                  borderBottom: 'none',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: 'none',
                  backgroundColor: isElementValidated ? '#e8f5e9' : '#d8eaf4',
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

      {/* Note Entry Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Enter Notes for {studentData.name} {studentData.surname}
        </DialogTitle>
        <DialogContent>
          {modalities.length > 0 ? (
            modalities.map((modality) => (
              <div key={modality.id} className="modality-input-container" style={{ marginBottom: '20px' }}>
                <TextField
                  label={`Note for ${modality.nomMode}`}
                  type="number"
                  value={studentData.notes[modality.idModeEval] === 0 ? 0 : studentData.notes[modality.idModeEval] || ''}
                  onChange={(e) => handleNoteInput(modality.idModeEval, e.target.value)}
                  fullWidth
                  margin="normal"
                  inputProps={{
                    min: 0,
                    max: 20,
                    step: 0.25,
                    disabled: studentData.absences?.[modality.idModeEval]
                  }}
                  error={studentData.notes?.[modality.idModeEval] > 20 || studentData.notes?.[modality.idModeEval] < 0}
                  helperText={
                    studentData.notes?.[modality.idModeEval] > 20 ? "Note cannot exceed 20" :
                      studentData.notes?.[modality.idModeEval] < 0 ? "Note cannot be negative" : ""
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={studentData.absences?.[modality.idModeEval] ?? false}
                      onChange={(e) => handleAbsenceChange(modality.idModeEval, e.target.checked)}
                    />
                  }
                  label="Absent"
                  style={{ marginLeft: '10px' }}
                />
              </div>
            ))
          ) : (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmOpen}
          onClose={handleCancel}
        >
          <DialogTitle>Confirmation Required</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {pendingNote?.value === 0
                ? "Are you sure you want to assign a note of 0?"
                : `Are you sure you want to assign a perfect score of ${pendingNote?.value}?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleConfirm} color="primary" variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveNotes}
            color="primary"
            variant="contained"
            disabled={loading.modalities}
          >
            Save Notes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SemestersList;