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

  const fetchModalities = (elementId) => {
    setLoadingModalities(true);
    axios
      .get(`http://localhost:8080/api/element/modes/${elementId}`)
      .then((response) => {
        const transformedData = response.data.map((modality, index) => ({
          id: index + 1,
          ...modality,
        }));
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

  const handleSubmit = async () => {
    if (!currentElement || !studentData.modality || !studentData.note) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const noteData = {
        elementId: currentElement.idElement,
        studentId: studentData.studentId,
        professorId: professorId,
        note: parseFloat(studentData.note),
        modalityId: studentData.modality,
      };

      await axios.post('http://localhost:8080/api/notes/add', noteData);
      handleCloseModal();
      // Refresh students list
      fetchStudents();
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note");
    }
  };

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
    setLoadingElements(true);
    setSelectedFiliereId(filiereId);
    setElements([]);
    setStudents([]);
    setCurrentElement(null);

    try {
      const response = await axios.get(
        'http://localhost:8080/api/element/findByFiliereAndProfessorAsMap',
        { params: { filiereId, professorId } }
      );
      setElements(response.data);
    } catch (err) {
      console.error("Failed to fetch elements:", err);
      setError("Failed to fetch elements.");
    } finally {
      setLoadingElements(false);
    }
  };

  const fetchStudents = async (element) => {
    if (!selectedSemester || !selectedFiliereId) {
      alert("Please select both semester and filiere first");
      return;
    }

    setCurrentElement(element);
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
        {semesters.map((semester) => (
          <li key={semester.id}>
            <button onClick={() => handleSemesterSelection(semester)}>
              <strong>{semester.name}</strong>
            </button>
          </li>
        ))}

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
        <DialogTitle>Add Notes for {studentData.name} {studentData.surname}</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Modalité"
            value={studentData.modality}
            onChange={(e) => setStudentData({ ...studentData, modality: e.target.value })}
            fullWidth
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value="" disabled>
              {loadingModalities ? "Chargement..." : "Sélectionnez une modalité"}
            </option>
            {modalities.map((modality) => (
              <option key={modality.id} value={modality.id}>
                {modality.nomMode}
              </option>
            ))}
          </TextField>
          <TextField
            label="Note"
            type="number"
            value={studentData.note}
            onChange={(e) => setStudentData({ ...studentData, note: e.target.value })}
            fullWidth
            margin="normal"
            inputProps={{ min: 0, max: 20, step: 0.25 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SemestersList;