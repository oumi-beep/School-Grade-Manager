import { Box, useTheme } from "@mui/material";
import { Header } from "../../components";
import { DataGrid, GridToolbar, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
const ModesEvaluation = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [modesList, setModesList] = useState([]);
    const [modeData, setModeData] = useState({
        nomMode: "",
        coefficient: "",
    });

    const [editingMode, setEditingMode] = useState(null); // Etat pour savoir si on modifie une ligne

    const handleChange = (e) => {
        const { name, value } = e.target;
        setModeData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const addMode = async (e) => {
        e.preventDefault();
        if (!modeData.nomMode || !modeData.coefficient) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const response = await fetch("http://localhost:8080/api/modes-evaluation/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                nomMode: modeData.nomMode,
                coefficient: modeData.coefficient,
            }),
        });

        if (response.ok) {
            alert("Modalité ajoutée avec succès.");
            const newMode = await response.json();

            setModesList((prevState) => [
                ...prevState,
                {
                    id: prevState.length + 1, // Génère un nouvel ID local
                    idModeEval: newMode.idModeEval,
                    nomMode: newMode.nomMode,
                    coefficient: newMode.coefficient,
                },
            ]);


            setModeData({
                nomMode: "",
                coefficient: "",
            });
        } else {
            alert("Échec de l'ajout de la modalité.");
        }
    };
    const handleEdit = (mode) => {
        setModeData({
            nomMode: mode.nomMode,
            coefficient: mode.coefficient,
        });
        setEditingMode(mode.idModeEval); // Enregistrer l'ID de la ligne en édition
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!modeData.nomMode || !modeData.coefficient) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const response = await fetch(`http://localhost:8080/api/modes-evaluation/update/${editingMode}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                nomMode: modeData.nomMode,
                coefficient: modeData.coefficient,
            }),
        });

        if (response.ok) {
            alert("Modalité mise à jour avec succès.");
            const updatedMode = await response.json();

            setModesList((prevState) =>
                prevState.map((mode) =>
                    mode.idModeEval === editingMode
                        ? { ...mode, nomMode: updatedMode.nomMode, coefficient: updatedMode.coefficient }
                        : mode
                )
            );

            setModeData({
                nomMode: "",
                coefficient: "",
            });
            setEditingMode(null); // Réinitialiser l'état de l'édition
        } else {
            alert("Échec de la mise à jour de la modalité.");
        }
    };
    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:8080/api/modes-evaluation/delete/${id}`)
            .then(() => {
                setModesList((prevState) => prevState.filter((mode) => mode.idModeEval !== id));
                alert("Modalité supprimée avec succès.");
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression :", error);
            });
    };

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/modes-evaluation")
            .then((response) => {
                // Transformation des données
                const transformedData = response.data.map((mode, index) => ({
                    id: index + 1, // Ajoute un ID unique basé sur l'index
                    idModeEval: mode.idModeEval, // ID réel de la modalité
                    nomMode: mode.nomMode, // Nom de la modalité
                    coefficient: mode.coefficient, // Coefficient de la modalité
                }));

                // Met à jour la liste des modalités
                setModesList(transformedData);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération :", error);
            });
    }, []);

    const columnsModes = [
        { field: "idModeEval", headerName: "ID", flex: 0.5 },
        { field: "nomMode", headerName: "Nom", flex: 1 },
        { field: "coefficient", headerName: "Coefficient", flex: 1 },
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
                        onClick={() => handleDelete(params.row.idModeEval)}
                        style={{ color: "red" }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];




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




    return (
        <Box m="20px">
            <Header title="Modalités d'Évaluation" subtitle="Gérer les modalités d'évaluation" />            <Box m="20px" style={{ backgroundColor: '#f9f9f9', borderRadius: '15px', padding: '20px', boxShadow: '2px 8px 8px rgba(26, 24, 24, 0.1)' }}>
                <Box display="flex" gap="20px" mb="20px">
                    <Box flex={1} width="75%" display="flex" flexDirection="column" gap="20px">
                        <Box display="flex" gap="20px">
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="nomMode" style={labelStyle}>Mode:</label>
                                <input
                                    type="text"
                                    style={inputStyle}
                                    id="nomMode"
                                    name="nomMode"
                                    value={modeData.nomMode}
                                    onChange={handleChange}
                                />
                            </Box>
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="coefficient" style={labelStyle}>Coefficient:</label>
                                <input
                                    type="number"
                                    style={inputStyle}
                                    id="coefficient"
                                    name="coefficient"
                                    value={modeData.coefficient}
                                    onChange={handleChange}
                                />
                            </Box>
                            <Box flex={1} display="flex" justifyContent="center" alignItems="center">
                                <button style={buttonStyle} onClick={editingMode ? handleUpdate : addMode} type="submit">
                                    {editingMode ? "Mettre à jour" : "Ajouter"}
                                </button>
                            </Box>
                        </Box>


                    </Box>



                </Box>
            </Box>
            <Box display="flex" gap="20px" height="75vh">
                <Box flex={1} sx={{ maxWidth: "70%" }}>
                    <DataGrid
                        rows={modesList}
                        columns={columnsModes}
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


            </Box>
        </Box>
    );
};

export default ModesEvaluation;
