import { Box, useTheme } from "@mui/material";
import { Header } from "../../components";
import { DataGrid, GridToolbar, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { mockDataContacts } from "../../data/mockData";
import { tokens } from "../../theme";
import React, { useState, useEffect } from "react";
import axios from "axios";
const ModuleElement = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [modules, setModules] = useState([]);
    const index = 0;

    useEffect(() => {
        axios
            .get('http://localhost:8080/api/modules')
            .then((response) => {
                console.log(response.data); // Vérifiez la structure des données
                let data = response.data;
                // Si ce n'est pas un tableau, on le transforme en tableau
                if (!Array.isArray(data)) {
                    // Ici, nous enveloppons 'data' dans un tableau si ce n'est pas déjà un tableau
                    data = [data]; // Par exemple, si data est un objet, nous l'enveloppons dans un tableau
                }

                // Maintenant que 'data' est un tableau, nous pouvons le transformer
                const transformedData = data.map((module) => ({
                    id: index + 1,
                    codeModule: module.codeModule,
                    nomModule: module.nomModule,
                    filiere: module.filiere,  // suppose que 'filiere' est un objet
                    semestre: module.semestre,  // suppose que 'semestre' est un objet
                }));

                setModules(transformedData); // Mettre à jour l'état avec les modules transformés
            })
            .catch((error) => {
                console.error('Erreur lors du chargement des modules:', error);
            });
    }, []);



    const columnsModules = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'codeModule', headerName: 'Code Module', flex: 1 },
        { field: 'nomModule', headerName: 'Nom Module', flex: 1 },
        {
            field: 'filiere',
            headerName: 'Nom Filière',
            flex: 1,

        },
        {
            field: 'semestre',
            headerName: 'Nom Semestre',
            flex: 1,

        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,

        },
    ];

    // Supprimer un module
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/modules/delete/${id}`);
            setModules((prevModules) => prevModules.filter((module) => module.idModule !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };
    // Éditer un module (action future)
    const handleEdit = (module) => {
        console.log("Édition :", module);
        // Logique pour ouvrir un formulaire de modification
    };



    const ElemtAffectation = [
        { field: "idElement", headerName: "Element ID", flex: 0.5 },
        {
            field: "NomElement",
            headerName: "Element Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "coefficient",
            headerName: "coefficient",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "test",
            headerName: "Action",
            flex: 1,
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


    const mockDataContactss = [
        { id: 1, name: 'Element 1' },
        { id: 2, name: 'Element 2' },
        { id: 3, name: 'Element 3' },
        { id: 4, name: 'Element 4' },
    ];
    const elemttable = [
        { field: "id", headerName: "ID", flex: 0.5 },
        {
            field: "name",
            headerName: "Element Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
    ];


    return (
        <Box m="20px">
            <Header title="Modules :" subtitle="Ajout ou Modification d'un Module" />
            <Box
                m="20px"
                style={{
                    backgroundColor: '#f9f9f9',
                    borderRadius: '15px',
                    padding: '20px',
                    boxShadow: '2px 8px 8px rgba(26, 24, 24, 0.1)',
                }}
            >
                <Box display="flex" gap="20px" mb="20px">
                    {/* Partie Gauche */}
                    <Box flex={1} width="75%" display="flex" flexDirection="column" gap="20px">
                        <Box display="flex" gap="20px">
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="codeModule" style={labelStyle}>
                                    Code Module :
                                </label>
                                <input type="text" style={inputStyle} id="codeModule" name="codeModule" />
                            </Box>
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="nomModule" style={labelStyle}>
                                    Nom du Module :
                                </label>
                                <input type="text" style={inputStyle} id="nomModule" name="nomModule" />
                            </Box>
                        </Box>

                        <Box display="flex" gap="20px">
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="semestre" style={labelStyle}>
                                    Semestre :
                                </label>
                                <select id="semestre" style={inputStyle} name="semestre">
                                    <option value="">Sélectionner un semestre</option>
                                    {/* Options dynamiques pour les semestres */}
                                </select>
                            </Box>
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="filiere" style={labelStyle}>
                                    Filière :
                                </label>
                                <select id="filiere" style={inputStyle} name="filiere">
                                    <option value="">Sélectionner une filière</option>
                                    {/* Options dynamiques pour les filières */}
                                </select>
                            </Box>
                        </Box>
                        <Box display="flex" gap="20px">
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="nomElement" style={labelStyle}>
                                    Nom Élément :
                                </label>
                                <input type="text" style={inputStyle} id="nomElement" name="nomElement" />
                            </Box>
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="coefficient" style={labelStyle}>
                                    Coefficient de l'Élément :
                                </label>
                                <input
                                    type="number"
                                    style={inputStyle}
                                    id="coefficient"
                                    name="coefficient"
                                    min="0"
                                    step="0.1"
                                />
                            </Box>
                        </Box>


                        <Box display="flex" gap="20px" justifyContent="center" mt="20px">
                            <Box flex={1} display="flex" justifyContent="center" alignItems="center">
                                <button style={buttonStyle} type="submit">
                                    Ajouter
                                </button>
                                <button style={buttonStyle} type="submit">
                                    Modifier
                                </button>
                            </Box>
                        </Box>

                    </Box>

                    {/* Right Side  */}
                    <Box width={"25%"} height={{ xs: '80%', sm: '90%', md: '25%' }} style={{ display: 'flex', flexDirection: 'column' }}>
                        <label
                            style={{ ...labelStyle, fontWeight: 'bold', marginBottom: '2px', fontSize: '1.2rem', color: '#2196F3' }}>
                            Element List:
                        </label>
                        <DataGrid
                            rows={mockDataContactss} // Données à afficher
                            columns={[
                                { field: 'nomElement', headerName: 'Nom Élément', flex: 1 },
                                { field: 'coefficient', headerName: 'Coefficient', flex: 1 },
                            ]}
                            components={{
                                Toolbar: () => (
                                    <div style={{ padding: '0.5rem', backgroundColor: 'transparent' }}>
                                        <GridToolbarQuickFilter />
                                    </div>
                                ),
                            }}
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
                                    height: '500px', // Ajuster la hauteur
                                    overflow: 'hidden',
                                },
                                "& .MuiDataGrid-cell": {
                                    border: "none",
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                },
                                "& .name-column--cell": {
                                    color: '#4CAF50',
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
                                    backgroundColor: '#e0f7fa',
                                    overflowY: 'auto',
                                },
                                "& .MuiCheckbox-root": {
                                    color: 'black !important',
                                },
                                "& .MuiDataGrid-iconSeparator": {
                                    color: '#b2ebf2',
                                },
                                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                    color: '#ffffff !important',
                                },
                            }}
                        />
                        <br />
                        <Box flex={1} display="flex" justifyContent="center" alignItems="center">
                            <button style={{ ...buttonStyle, color: '#fff', padding: '10px 15px', fontSize: '1rem', borderRadius: '5px' }} type="submit">
                                Submit
                            </button>
                        </Box>
                    </Box>

                </Box>
            </Box>

            <Box display="flex" gap="20px" height="75vh">
                <Box flex={1} sx={{ maxWidth: "70%" }}>
                    <DataGrid
                        rows={modules}
                        columns={columnsModules}
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
                <Box flex={1} sx={{ maxWidth: "30%" }}>
                    <DataGrid
                        rows={mockDataContacts}
                        columns={ElemtAffectation}
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
                                color: colors.primary[100],
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#d8eaf4",
                                borderBottom: "none",
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                backgroundColor: colors.primary[400],
                            },
                            "& .MuiDataGrid-footerContainer": {
                                borderTop: "none",
                                backgroundColor: "#d8eaf4",
                            },
                            "& .MuiCheckbox-root": {
                                color: `${colors.greenAccent[200]} !important`,
                            },
                            "& .MuiDataGrid-iconSeparator": {
                                color: colors.primary[100],
                            },
                            "& .MuiButton-text": {
                                color: 'black',
                            },
                            "& .MuiDataGrid-toolbarContainer": {
                                color: colors.gray[100],
                            },
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default ModuleElement;
