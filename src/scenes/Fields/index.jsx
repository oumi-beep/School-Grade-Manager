import React, { useState, useEffect } from 'react';
import { Button, TextField, IconButton, Card, CardContent, Grid, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const FiliereCrud = () => {
  const [filieres, setFilieres] = useState([]);
  const [nomFiliere, setNomFiliere] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [filiereToEdit, setFiliereToEdit] = useState(null);

  // Mock data for filieres
  useEffect(() => {
    const mockFilieres = [
      { idFiliere: 1, nomFiliere: 'Informatique', imageUrl: 'https://via.placeholder.com/150' },
      { idFiliere: 2, nomFiliere: 'Mathematiques', imageUrl: 'https://via.placeholder.com/150' },
    ];
    setFilieres(mockFilieres);
  }, []);

  // Handle form submit for creating or updating a Filiere
  const handleSubmit = (e) => {
    e.preventDefault();

    const newFiliere = { nomFiliere, imageUrl };

    if (filiereToEdit) {
      // Update existing Filiere
      const updatedFilieres = filieres.map((filiere) =>
        filiere.idFiliere === filiereToEdit.idFiliere
          ? { ...filiere, nomFiliere: newFiliere.nomFiliere, imageUrl: newFiliere.imageUrl }
          : filiere
      );
      setFilieres(updatedFilieres);
    } else {
      // Create new Filiere
      const newFiliereObj = { idFiliere: Date.now(), ...newFiliere };
      setFilieres([...filieres, newFiliereObj]);
    }

    setNomFiliere('');
    setImageUrl('');
    setFiliereToEdit(null);
  };

  // Handle editing a Filiere
  const handleEdit = (filiere) => {
    setFiliereToEdit(filiere);
    setNomFiliere(filiere.nomFiliere);
    setImageUrl(filiere.imageUrl);
  };

  // Handle deleting a Filiere
  const handleDelete = (id) => {
    const updatedFilieres = filieres.filter((filiere) => filiere.idFiliere !== id);
    setFilieres(updatedFilieres);
  };

  return (
    <div>
      <h1>Filiere CRUD with Cards</h1>

      {/* Filiere form (Create/Update) */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <TextField
          label="Nom Filiere"
          variant="outlined"
          value={nomFiliere}
          onChange={(e) => setNomFiliere(e.target.value)}
          fullWidth
          required
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Image URL"
          variant="outlined"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          fullWidth
          required
          style={{ marginBottom: '10px' }}
        />
        <Button type="submit" variant="contained" color="primary">
          {filiereToEdit ? 'Update Filiere' : 'Create Filiere'}
        </Button>
      </form>

      {/* Grid for displaying filieres as cards */}
      <Grid container spacing={3}>
        {filieres.map((filiere) => (
          <Grid item xs={12} sm={6} md={4} key={filiere.idFiliere}>
            <Card>
              <CardContent>
                {/* Display image */}
                <img
                  src={filiere.imageUrl}
                  alt={filiere.nomFiliere}
                  style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
                />
                <Typography variant="h6">{filiere.nomFiliere}</Typography>

                <div style={{ marginTop: '10px' }}>
                  <IconButton color="primary" onClick={() => handleEdit(filiere)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(filiere.idFiliere)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default FiliereCrud;
