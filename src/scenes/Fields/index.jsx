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

  const [description, setDescription] = useState('');
  const [filiereToEdit, setFiliereToEdit] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch filieres from the backend

  const fetchFilieres = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch("http://localhost:8080/api/filieres/allfilieres");
      if (!response.ok) {
        throw new Error('Failed to fetch filieres');
      }
      const data = await response.json();
      setFilieres(data); // Store filieres in state
    } catch (error) {
      setError('Error fetching filieres');
      console.error(error);
    } finally {
      setLoading(false); // End loading
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

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography className="typography-title" variant="h1" gutterBottom>
        Manage Fields
      </Typography>
      <Typography className="typography-subtext">
        Easily add, update, or delete Fields with just a few clicks.
      </Typography>
      <br />

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
        <Button  type="submit" style={{ width: '30px' , color:'black',backgroundColor: 'aquamarine'}} variant="contained" color="primary">
          {filiereToEdit ? 'Update  ' : 'Create  '}
        </Button>
      </Box>
      {error && (
          <Typography variant="body2" color="error" sx={{ marginBottom: '20px' }}>
            {error}
          </Typography>
        )}
      </form>

       {/* Display filieres as cards */}
      <div className="filieres-containerr" style={{ padding: '20px' }}>
        <h2 className='h1'>Available Fields </h2>
        {filieres.length === 0 ? (
          <p className='h1'>No Fields available at the moment.</p>
        ) : (
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {filieres.map((filiere, index) => (
              <Grid  item xs={12} sm={6} md={4} key={index}>
                <Card className='filiere-itemm' >
                  <CardContent>
                  
                    <Typography className='h6' variant="h6" align="center">
                      {filiere.nomFiliere} 
                    </Typography>
                    <Typography variant="body2" align="center">
                      {filiere.description} 
                    </Typography>
                    
                    <Box className="buttons" display="flex" justifyContent="space-between">
                      <IconButton    onClick={() => handleEdit(filiere)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton   style={{ color: 'blue' }} onClick={() => handleEdit(filiere)}>
                      Student
                      </IconButton>
                      <IconButton   style={{ color: 'aqua' }} onClick={() => handleEdit(filiere)}>
                      Module
                      </IconButton>
                      <IconButton onClick={() => handleDelete(filiere.idFiliere)}>
                        <DeleteIcon />
                      </IconButton>
                  </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
      )}
    </div>
    </Box>
  );
};

export default FiliereCrud;
