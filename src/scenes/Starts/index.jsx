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
import { MenuItem, DialogContentText, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';



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
  const [ModalitiesId, setModalitiesId] = useState(null);
  const [studentData, setStudentData] = useState({
    name: '',
    idEtudiant: '',
    surname: '',
    cse: '',
    evaluationMode: '',
    modality: '',
    absent: '',
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



  const calculateElementNote = async (studentId, elementId, filiereId) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/notes/calculate/${studentId}/${elementId}/${filiereId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error calculating note:", error);
      throw error;
    }
  };

  const updateStudentList = async () => {
    if (currentElement && selectedFiliereId) {
      await fetchStudents(currentElement, currentElement.idElement);
    }
  };


  //
  const handleSaveNotes = async () => {
    const notesList = modalities
      .map((modality) => ({
        studentId: studentData.idEtudiant,
        elementId: currentElement.idElement,
        modalityId: modality.idModeEval,
        note: studentData.absences?.[modality.idModeEval] ? 0 : studentData.notes?.[modality.idModeEval],
        absent: studentData.absences?.[modality.idModeEval] ?? false,
      }))
      .filter(note => note.note !== '' || note.note === 0);

    console.log("Notes List:", notesList);
    console.log("Notes List:", notesList);

    try {
      const checkResponse = await axios.get(`http://localhost:8080/api/notes/checkNotes/${studentData.idEtudiant}/${currentElement.idElement}`);

      if (checkResponse.data && checkResponse.data.exists) {
        const updateResponse = await fetch('http://localhost:8080/api/notes/updateNoteModalite', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notesList),
        });

        if (updateResponse.ok) {
          alert('Notes updated successfully');
        } else {
          const errorData = await updateResponse.json();
          alert('Failed to update notes: ' + errorData.message || 'Unknown error');
        }
      } else {
        const addResponse = await fetch('http://localhost:8080/api/notes/addnoteModalite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notesList),
        });
        if (addResponse.ok) {
          alert('Notes saved successfully');
        } else {
          const errorData = await addResponse.json();
          alert('Failed to save notes: ' + errorData.message || 'Unknown error');
        }
      }

      await calculateElementNote(
        studentData.idEtudiant,
        currentElement.idElement,
        selectedFiliereId
      );

      // Mettre à jour l'affichage du tableau
      await updateStudentList();

      alert('Notes saved and calculated successfully');
      setOpenModal(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('An error occurred while saving notes');
    }
    setOpenModal(false);
  };


  const fetchNotesForStudent = async (studentId, elementId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/notes/getNotes/${studentId}/${elementId}`);

      console.log("Raw API Response:", response.data);

      if (response.data && typeof response.data === "object") {
        const notes = Object.keys(response.data).reduce((acc, modalityId) => {
          const note = response.data[modalityId];
          const modalityIdInt = parseInt(modalityId);
          acc[modalityIdInt] = note;
          return acc;
        }, {});

        console.log("Processed Notes with idModalite as Key:", notes);

        setStudentData((prevData) => ({
          ...prevData,
          notes: notes,
        }));
      } else {
        console.log("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching notes for student:", error);
    }
  };

  const handleNoteInput = (modalityId, value) => {
    const numericValue = parseFloat(value);

    if (numericValue < 0 || numericValue > 20) {
      return;
    }
    setStudentData((prevData) => ({
      ...prevData,
      notes: {
        ...prevData.notes,
        [modalityId]: numericValue,
      },
    }));

    if (numericValue === 0 || numericValue === 20) {
      setPendingNote({ modalityId, value: numericValue });
      setConfirmOpen(true);
    } else {
      handleNoteChange(modalityId, numericValue);
    }
  };


  const handleOpenModal = async (student) => {
    if (!currentElement) {
      alert("Please select an element first");
      return;
    }

    setStudentData({
      name: student.nomEtudiant,
      idEtudiant: student.idEtudiant,
      surname: student.prenomEtudiant,
      cse: student.cneEtudiant,
      modality: '',
      note: '',
    });

    try {
      await Promise.all([
        fetchModalities(currentElement.idElement),
        fetchNotesForStudent(student.idEtudiant, currentElement.idElement),
      ]);

      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


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

        const transformedData = response.data.map(({ idModeEval, nomMode }, index) => ({
          id: index + 1,
          idModeEval,
          nomMode,
        }));

        console.log(transformedData);

        setModalities(transformedData);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des modalités :", error);
      })
      .finally(() => {
        setLoadingModalities(false);
      });
  };

  const handleAbsenceChange = (modalityId, isAbsent) => {
    setStudentData((prevData) => ({
      ...prevData,
      absences: {
        ...prevData.absences,
        [modalityId]: isAbsent,
      },
      notes: {
        ...prevData.notes,
        [modalityId]: isAbsent ? 0 : prevData.notes[modalityId],
      },
    }));
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingNote, setPendingNote] = useState(null);



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
  const fetchStudents = async (element, elementId) => {
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
                  <button onClick={() => fetchStudents(element, element.idElement)}>
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
              <div key={modality.id}>
                <TextField
                  label={`Note for ${modality.nomMode}`}
                  type="number"
                  value={studentData.notes?.[modality.idModeEval] ?? ''}
                  onChange={(e) => handleNoteInput(modality.idModeEval, e.target.value)}
                  fullWidth
                  margin="normal"
                  inputProps={{ min: 0, max: 20, step: 0.25, disabled: studentData.absences?.[modality.idModeEval] }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={studentData.absences?.[modality.idModeEval] ?? false}
                      onChange={(e) => handleAbsenceChange(modality.idModeEval, e.target.checked)}
                    />
                  }
                  label="Absent"
                />
              </div>
            ))
          ) : (
            <CircularProgress />
          )}
        </DialogContent>

        {/* Confirmation Dialog */}
        <Dialog open={confirmOpen} onClose={handleCancel}>
          <DialogTitle>Confirmation Required</DialogTitle>
          <DialogContent>
            <DialogContentText>
              A note of {pendingNote?.value} was entered. Are you sure you want to proceed?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleConfirm} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

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