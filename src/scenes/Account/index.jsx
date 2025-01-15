import { DataGrid, GridToolbar, GridToolbarQuickFilter } from "@mui/x-data-grid";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import "./index.css"

import {
    TextField,
    Button,
    MenuItem,
    Typography,
    Box,
    Grid,
    useTheme
} from "@mui/material";


const colors = {
    gray: {
        700: '#4a4a4a',
        500: '#7a7a7a',
        300: '#cccccc',
    },
    greenAccent: {
        500: '#34c759',
    },
};

const AddCompteUtilisateur = () => {
    const [formData, setFormData] = useState({
        nomUser: "",
        prenomUser: "",
        email: "",
        password: "",
        role: "Professeur",
        codeProf: "",
        specialite: "",
    });

    const [isProfesseur, setIsProfesseur] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        if (name === "role") {
            setIsProfesseur(value === "Professeur");
            setCodeProfError(""); // Réinitialiser l'erreur si le rôle change
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/compte/add", formData);
            alert("Compte utilisateur ajouté avec succès !");
            console.log(response.data);
            setFormData({
                nomUser: "",
                prenomUser: "",
                email: "",
                password: "",
                role: "",
                codeProf: "",
                specialite: "",
            });
            setIsProfesseur(false);
            fetchAccount()

        } catch (error) {
            console.error("Erreur lors de l'ajout du compte utilisateur :", error);
            alert("Erreur lors de l'ajout du compte utilisateur !");
        }
    };
    const [editingMode, setEditingMode] = useState(false);
    const handleUpdate = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/compte/update/${formData.id}`,
                formData
            );
            alert("Compte utilisateur mis à jour avec succès !");
            setIsProfesseur(false);
            fetchAccount();
        } catch (error) {
            console.error("Erreur lors de la mise à jour du compte utilisateur :", error);
            alert("Erreur lors de la mise à jour du compte utilisateur !");
        }
    };


    const [emailError, setEmailError] = useState("");
    const checkEmailExists = async (email) => {
        try {
            const response = await axios.get("http://localhost:8080/api/compte/check-email", {
                params: { email },
            });
            if (response.data) {
                setEmailError("Cet email existe déjà !");
            } else {
                setEmailError("");
            }
        } catch (error) {
            console.error("Erreur lors de la vérification de l'email :", error);
        }
    };


    const [codeProfError, setCodeProfError] = useState("");
    const checkCodeProfExists = async (codeProf) => {
        try {
            const response = await axios.get("http://localhost:8080/api/compte/check-code-prof", {
                params: { codeProf },
            });
            if (response.data) {
                setCodeProfError("Ce code professeur existe déjà !");
            } else {
                setCodeProfError("");
            }
        } catch (error) {
            console.error("Erreur lors de la vérification du code professeur :", error);
        }
    };

    const [comptes, setComptes] = useState([]);
    // Fetch data from the backend
    useEffect(() => {
        fetchAccount()
    }, []);

    const fetchAccount = () => {
        axios
            .get("http://localhost:8080/api/compte/all")
            .then((response) => {
                // Transformation des données pour ajouter un ID unique basé sur l'index
                const transformedData = response.data.map((compte, index) => ({
                    id: compte.idUser, // Assure that there is an 'id' field or fall back to index
                    nomUser: compte.nomUser,
                    prenomUser: compte.prenomUser,
                    email: compte.email,
                    password: compte.password,
                    role: compte.role,
                    codeProf: compte.codeProf,
                    specialite: compte.specialite,
                }));

                // Met à jour la liste des comptes
                setComptes(transformedData);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des comptes :", error);
            });
    }

    const columnsComptes = [
        { field: "id", headerName: "User ID", flex: 0.5 },
        { field: "nomUser", headerName: "First Name", flex: 1 },
        { field: "prenomUser", headerName: "Last Name", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "password", headerName: "Password", flex: 1 },
        {
            field: "codeProf",
            headerName: "Professor Code",
            flex: 1,
          
        },
        {
            field: "specialite",
            headerName: "Specialty",
            flex: 1,
          
        },
        { field: "role", headerName: "Role", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <>
                    <IconButton
                        onClick={() => handleEdit(params.row)}
                        style={{ color: "blue", marginRight: "10px" }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handleDelete(params.row.id)}
                        style={{ color: "red" }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    const handleEdit = (row) => {
        setFormData({
            id: row.id,
            nomUser: row.nomUser,
            prenomUser: row.prenomUser,
            email: row.email,
            password: row.password,
            role: row.role,
            codeProf: row.codeProf,
            specialite: row.specialite,
        });
        setEditingMode(true);
    };

    // Reset form data after submission
    const resetForm = () => {
        setFormData({
            id: "",
            nomUser: "",
            prenomUser: "",
            email: "",
            password: "",
            role: "Professeur",
            codeProf: "",
            specialite: "",
        });
        setEditingMode(false);
    };


    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:8080/api/compte/${id}`)
            .then(() => {
                // On success, update your state or show a success message
                setComptes((prevComptes) => prevComptes.filter(compte => compte.id !== id));
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression de l'utilisateur :", error);
            });
    };


    const buttonStyle = {
        padding: '12px 20px',
        backgroundColor: 'rgba(76, 168, 67, 0.35)',
        color: '#ffff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.2s',
        fontSize: '1rem',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    };
    return (
        <Box>
            <Box
                sx={{
                    maxWidth: "90%",
                    margin: "auto",
                    padding: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    marginBottom: "90px",
                    marginTop: "30px",
                }}
            >
                <Typography variant="h4" gutterBottom>
                    {editingMode ? "Edit User Account" : "Add User Account"}
                </Typography>
                <form onSubmit={editingMode ? handleUpdate : handleSubmit} className="formaccount">
                    <Grid container spacing={2}>
                        {/* Première ligne : Nom, Prénom, Code Professeur */}
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="nomUser"
                                value={formData.nomUser}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="prenomUser"
                                value={formData.prenomUser}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Professor Code"
                                name="codeProf"
                                value={formData.codeProf}
                                onChange={(e) => {
                                    handleChange(e);
                                    checkCodeProfExists(e.target.value);
                                }}
                                error={!!codeProfError}
                                helperText={codeProfError}
                                required
                            />
                        </Grid>

                        {/* Deuxième ligne : Email, Mot de passe, Spécialité */}
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => {
                                    handleChange(e);
                                    checkEmailExists(e.target.value);
                                }}
                                error={!!emailError}
                                helperText={emailError}
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                type="password"
                                label="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}

                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Specialty"
                                name="specialite"
                                value={formData.specialite}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Troisième ligne : Rôle */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Role"
                                name="role"
                                value="Professeur" // Valeur fixe "Professeur"
                                onChange={handleChange}
                                required
                                disabled // Empêche la modification
                            />
                        </Grid>

                        {/* Bouton d'envoi */}
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth style={buttonStyle}>
                                {editingMode ? "Update" : "Add"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>


            <Box display="flex" height="75vh" justifyContent="center" gap="20px" marginTop="40px">
                <Box flex={1} sx={{ maxWidth: "90%" }}>
                    <DataGrid
                        rows={comptes}
                        columns={columnsComptes}
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
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#d8eaf4",
                                borderBottom: "none",
                            },
                            "& .MuiDataGrid-footerContainer": {
                                borderTop: "none",
                                backgroundColor: "#d8eaf4",
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                backgroundColor: "#f5f5f5",
                            },
                            "& .MuiCheckbox-root": {
                                color: "#5c6bc0 !important",
                            },
                        }}
                    />
                </Box>
            </Box>

        </Box>


    );
};

export default AddCompteUtilisateur;
