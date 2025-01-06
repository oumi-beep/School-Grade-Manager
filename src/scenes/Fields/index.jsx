import React, { useState, useEffect } from 'react';
import { Button, TextField, IconButton, Card, CardContent, Grid, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { colors } from '@mui/material';
import './index.css';

const FiliereCrud = () => {
  const [filieres, setFilieres] = useState([]);
  const [nomFiliere, setNomFiliere] = useState('');
  const [semestres, setSemestres] = useState([]);
  const [modules, setModules] = useState([]);
  const [description, setDescription] = useState('');
  const [filiereToEdit, setFiliereToEdit] = useState(null);
  const [error, setError] = useState('');
  const [students,setStudents]=useState([])
  const [loading, setLoading] = useState(true);
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [selectedView, setSelectedView] = useState(null); // Tracks the active view
  const [selectedFiliereId, setSelectedFiliereId] = useState(null);
   // Fetch filieres from the backend
  const fetchFilieres = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/filieres/allfilieres");
      if (!response.ok) {
        throw new Error("Failed to fetch filieres");
      }
      const data = await response.json();
      setFilieres(data);
    } catch (err) {
      setError("Error fetching filieres");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilieres();
  }, []);

  // Validate form input
  const validateForm = () => {
    if (!nomFiliere || !description) {
      setError('All fields are required!');
      return false;
    }
    setError('');
    return true;
  };

  // Handle form submit for creating or updating a Filiere
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newFiliere = { nomFiliere, description };

    if (filiereToEdit) {
      // Update existing Filiere
      axios.put(`http://localhost:8080/api/filieres/updates/${filiereToEdit.idFiliere}`, newFiliere)
        .then(response => {
          const updatedFilieres = filieres.map((filiere) =>
            filiere.idFiliere === filiereToEdit.idFiliere
              ? { ...filiere, nomFiliere, description }
              : filiere
          );
          setFilieres(updatedFilieres);
          setFiliereToEdit(null);
          resetForm();
        })
        .catch(error => {
          setError('Error updating Filiere');
          console.error('Error updating filiere:', error);
        });
    } else {
      // Create new Filiere
      axios.post('http://localhost:8080/api/filieres/creates', newFiliere)
        .then(response => {
          const newFiliereObj = { idFiliere: response.data.idFiliere, nomFiliere, description };
          setFilieres([...filieres, newFiliereObj]);
          resetForm();
        })
        .catch(error => {
          setError('Error creating Filiere');
          console.error('Error creating filiere:', error);
        });
    }
  };

  // Handle editing a Filiere
  const handleEdit = (filiere) => {
    setFiliereToEdit(filiere);
    setNomFiliere(filiere.nomFiliere);
    setDescription(filiere.description);
  };

  // Handle deleting a Filiere
  const handleDelete = (id) => {
    if (!id) {
      console.error('Invalid ID:', id);
      setError('Failed to delete: Invalid ID.');
      return;
    }

    axios
      .delete(`http://localhost:8080/api/filieres/deletes/${id}`)
      .then((response) => {
        const updatedFilieres = filieres.filter((filiere) => filiere.idFiliere !== id);
        setFilieres(updatedFilieres);
      })
      .catch((error) => {
        setError('Error deleting Filiere');
        console.error('Error deleting filiere:', error);
      });
  };

  // Reset form fields
  const resetForm = () => {
    setNomFiliere('');
    setDescription('');
  };

  // Fetch Semestres and Modules

  const fetchSemestres = async (idFiliere) => {
    console.log(`Fetching semesters for filiere ID: ${idFiliere}`);
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/semestres/semestre`);
      const fetchedSemestres = response.data;
        const semestresWithFiliere = fetchedSemestres.map((semestre) => ({
        ...semestre,
        idFiliere: idFiliere, 
      }));
      setSemestres(semestresWithFiliere); 
      setModules([]);
  
      console.log('Semestres with associated filiere ID:', semestresWithFiliere);  
    } catch (err) {
      console.error('Failed to fetch semestres:', err);
      setError('Failed to fetch semestres');
    } finally {
      setLoading(false);
    }
  };
  const fetchModules = async (idFiliere, idSemestre) => {
    console.log(`Fetching modules for filiere ID: ${idFiliere} and semestre ID: ${idSemestre}`); 
    setLoading(true); 
    try {
      const response = await axios.get(
        `http://localhost:8080/api/modules/getModulsSF/${idFiliere}/${idSemestre}`
      );
      setModules(response.data); 
      console.log('Fetched Modules:', response.data);  
    } catch (err) {
      console.error('Failed to fetch modules:', err);
      setError('Failed to fetch modules');
    } finally {
      setLoading(false);  
    }
  };
  const handleSelectFiliere = (filiereId) => {
    setSelectedFiliereId(filiereId);  
    setSelectedNiveau(""); 
    setStudents([]); 
   };
  
  // Function to handle selecting a niveau and fetching students
  const handleSelectNiveau = (niveau) => {
    setSelectedNiveau(niveau);  
    fetchStudents(selectedFiliereId, niveau);  
  };
  
  // Function to fetch students
  const fetchStudents = async (idFiliere, niveau) => {
    console.log(`Fetching students for filiere ID: ${idFiliere}, niveau: ${niveau}`);
    try {
      const response = await fetch(
        `http://localhost:8080/api/etudiants/StudentList/${idFiliere}/${niveau}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      setStudents(data);
      console.log("Fetched Students:", data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  }; 

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography className='typography-title' variant="h1" gutterBottom>
        Manage Fields
      </Typography>

      {/* Filiere form (Create/Update) */}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nom Filiere"
          variant="outlined"
          value={nomFiliere}
          onChange={(e) => setNomFiliere(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: '20px' }}
        />
      
        <TextField
          label="Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
          multiline
          rows={4}
          sx={{ marginBottom: '20px' }}
        />
      
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Button type="submit" style={{ color:'black',backgroundColor:'aquamarine'}}  variant="contained" color="primary" sx={{ width: '30%' }}>
            {filiereToEdit ? 'Update' : 'Create'}
          </Button>
        </Box>

        {error && (
          <Typography variant="body2" color="error" sx={{ marginBottom: '20px' }}>
            {error}
          </Typography>
        )}
      </form>

      {/* Display filieres as cards */}
      <div className='filieres-containerr' style={{ padding: '20px' }}>
        <h2 className='typography-title'>Available Fields</h2>
        {filieres.length === 0 ? (
          <p>No Fields available at the moment.</p>
        ) : (
          <Grid className='filieres-containerr' container spacing={3}>
            {filieres.map((filiere, index) => (
              <Grid className='filieres-listt' item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" align="center">{filiere.nomFiliere}</Typography>
                    <Typography variant="body2" align="center">{filiere.description}</Typography>

                    <Box display="flex" justifyContent="space-between">
                      <IconButton onClick={() => handleEdit(filiere)}  style={{ color: 'blue' }}><EditIcon /></IconButton>
                      <IconButton onClick={() =>{ fetchSemestres(filiere.idFiliere) ;setSelectedView("module");} }style={{ color: 'aqua' }}>Module</IconButton>
                      <IconButton  onClick={() => handleSelectFiliere(filiere.idFiliere)} style={{ color: 'aqua' }}>Students</IconButton>
                      <IconButton onClick={() => handleDelete(filiere.idFiliere)}  style={{ color: 'red' }}><DeleteIcon /></IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
      <article className="main-article">
  {/* Aside for Semestres and Modules */}
  <aside className="aside-section">
    {/* Display semestres */}
    {semestres.length > 0 && (
      <div className="containerr">
        <h3>Semestres:</h3>
        <ul>
          {semestres.map((semestre) => (
            <button
              key={semestre.idSemestre}
              onClick={() =>
                fetchModules(semestre.idFiliere, semestre.idSemestre)
              }
            >
              {semestre.nomSemestre}
            </button>
          ))}
        </ul>
      </div>
    )}

    {/* Display modules */}
    {modules.length > 0 && (
      <div className="containerr">
        <h3>Modules:</h3>
        <table>
          <thead>
            <tr>
              <th>Module Name</th>
              <th>Module Code</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module.idModule}>
                <td>{module.nomModule}</td>
                <td>{module.codeModule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </aside>

  {/* Main section for Students and Niveau Selection */}
  <div className="main-section">
    {/* Niveau Selection */}
    {selectedFiliereId && (
      <div className="containerr">
        <h3>Select Niveau:</h3>
        <div>
          {["1ère Année", "2ème Année", "3ème Année"].map((niveau) => (
            <Button
              key={niveau}
              variant="contained"
              color="primary"
              style={{ margin: "10px" }}
              onClick={() => handleSelectNiveau(niveau)}
            >
              {niveau}
            </Button>
          ))}
        </div>
      </div>
    )}

    {/* Students */}
    {students.length > 0 && (
      <div className="containerr">
        <h3>Students:</h3>
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>CNE</th>
              <th>Niveau</th>
            </tr>
          </thead>
          <tbody className="tbody">
            {students.map((student) => (
              <tr key={student.idEtudiant}>
                <td>{student.idEtudiant}</td>
                <td>{student.nomEtudiant}</td>
                <td>{student.prenomEtudiant}</td>
                <td>{student.cneEtudiant}</td>
                <td>{student.niveau}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</article>



      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Box>
  );
};

export default FiliereCrud;
