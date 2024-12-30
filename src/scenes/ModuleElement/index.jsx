import { Box, useTheme, IconButton } from "@mui/material";
import { Header } from "../../components";
import { DataGrid, GridToolbar, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { mockDataContacts } from "../../data/mockData";
import { tokens } from "../../theme";
import React, { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
const ModuleElement = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [modulesList, setModulesList] = useState([]);
    const [moduleData, setModuleData] = useState({
        codeModule: "",
        nomModule: "",
        nomSemestre: "",
        nomFiliere: "",
        elementsNom: "",
        elementsCoeff: "",
    });




    const [editingModule, setEditingModule] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setModuleData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const addModule = async (e) => {
        e.preventDefault();
        const { codeModule, nomModule, nomSemestre, nomFiliere, elementsNom, elementsCoeff } = moduleData;

        if (!codeModule || !nomModule || !nomSemestre || !nomFiliere || !elementsNom || !elementsCoeff) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const elementsNomArray = elementsNom.split(",").map((nom) => nom.trim());
        const elementsCoeffArray = elementsCoeff.split(",").map((coeff) => parseFloat(coeff.trim()));

        if (elementsNomArray.length !== elementsCoeffArray.length) {
            alert("Le nombre d'éléments ne correspond pas au nombre de coefficients.");
            return;
        }

        // Construction des paramètres pour l'envoi correct au backend
        const urlSearchParams = new URLSearchParams({
            codeModule,
            nomModule,
            nomSemestre,
            nomFiliere,
        });

        elementsNomArray.forEach((nom) => {
            urlSearchParams.append("elementsNom", nom);
        });

        elementsCoeffArray.forEach((coeff) => {
            urlSearchParams.append("elementsCoeff", coeff);
        });

        try {
            const response = await fetch("http://localhost:8080/api/modules/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: urlSearchParams.toString(),
            });

            if (response.ok) {
                alert("Module ajouté avec succès.");
                const newModule = await response.json();
                setModulesList((prevState) => [
                    ...prevState,
                    { id: prevState.length + 1, ...newModule },
                ]);
                setModuleData({
                    codeModule: "",
                    nomModule: "",
                    nomSemestre: "",
                    nomFiliere: "",
                    elementsNom: "",
                    elementsCoeff: "",
                });
            } else {
                alert("Échec de l'ajout du module.");
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout du module:", error);
        }
    };



    const handleEdit = (module) => {
        setModuleData({
            codeModule: module.codeModule,
            nomModule: module.nomModule,
            nomFiliere: module.nomFiliere,
            nomSemestre: module.nomSemestre,
        });
        setEditingModule(module.idModule);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!moduleData.codeModule || !moduleData.nomModule || !moduleData.nomFiliere || !moduleData.nomSemestre) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const response = await fetch(`http://localhost:8080/api/modules/update/${editingModule}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                codeModule: moduleData.codeModule,
                nomModule: moduleData.nomModule,
                filiere: moduleData.nomFiliere,
                semestre: moduleData.nomSemestre,
            }),
        });

        if (response.ok) {
            alert("Module mis à jour avec succès.");
            const updatedModule = await response.json();
            setModulesList((prevState) =>
                prevState.map((module) =>
                    module.idModule === editingModule ? { ...module, ...updatedModule } : module
                )
            );
            setModuleData({ codeModule: "", nomModule: "", nomFiliere: "", nomSemestre: "" });
            setEditingModule(null);
        } else {
            alert("Échec de la mise à jour du module.");
        }
    };

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:8080/api/modules/delete/${id}`)
            .then(() => {
                setModulesList((prevState) =>
                    prevState.filter((module) => module.idModule !== id)
                );
                alert("Module supprimé avec succès.");
            })
            .catch((error) => console.error("Erreur lors de la suppression :", error));
    };
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/modules")
            .then((response) => {
                const transformedData = response.data.map((module, index) => ({
                    id: index + 1,
                    ...module,
                }));
                setModulesList(transformedData);
            })
            .catch((error) => console.error("Erreur lors de la récupération :", error));
    }, []);



    const columnsModules = [
        { field: "idModule", headerName: "ID", flex: 0.5 },
        { field: "codeModule", headerName: "Code", flex: 1 },
        { field: "nomModule", headerName: "Nom", flex: 1 },
        { field: "nomSemestre", headerName: "Semestre", flex: 1 },
        { field: "nomFiliere", headerName: "Filière", flex: 1 },
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
                        onClick={() => handleDelete(params.row.idModule)}
                        style={{ color: "red" }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];



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
            field: "etatElement",
            headerName: "Etat ",
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
                    {/* right part */}
                    <Box flex={1} width="75%" display="flex" flexDirection="column" gap="20px">
                        <Box display="flex" gap="20px">
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="codeModule" style={labelStyle}>
                                    Code Module :
                                </label>
                                <input
                                    type="text"
                                    style={inputStyle}
                                    id="codeModule"
                                    name="codeModule"
                                    value={moduleData.codeModule}
                                    onChange={handleChange} />
                            </Box>
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="nomModule" style={labelStyle}>
                                    Nom du Module :
                                </label>
                                <input type="text" style={inputStyle}
                                    id="nomModule"
                                    name="nomModule"
                                    value={moduleData.nomModule}
                                    onChange={handleChange} />
                            </Box>
                        </Box>

                        <Box display="flex" gap="20px">
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="nomSemestre" style={labelStyle}>
                                    Semestre :
                                </label>
                                <input
                                    id="nomSemestre"
                                    style={inputStyle}
                                    name="nomSemestre"
                                    value={moduleData.nomSemestre}
                                    onChange={handleChange}
                                >                                </input>
                            </Box>
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="nomFiliere" style={labelStyle}>
                                    Filière :
                                </label>
                                <input
                                    id="nomFiliere"
                                    style={inputStyle}
                                    name="nomFiliere"
                                    value={moduleData.nomFiliere}
                                    onChange={handleChange}
                                >
                                </input>
                            </Box>
                        </Box>

                        <Box display="flex" gap="20px">
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="elementsNom" style={labelStyle}>
                                    Noms des Élément (séparés par des virgules) :
                                </label>
                                <input
                                    type="text"
                                    id="elementsNom"
                                    name="elementsNom"
                                    value={moduleData.elementsNom}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </Box>
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="elementsCoeff" style={labelStyle}>
                                    Coefficients des Élément (séparés par des virgules) :
                                </label>
                                <input
                                    type="text"
                                    id="elementsCoeff"
                                    name="elementsCoeff"
                                    value={moduleData.elementsCoeff}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </Box>
                        </Box>


                        <Box display="flex" gap="20px" justifyContent="center" mt="20px">
                            <Box flex={1} display="flex" justifyContent="center" alignItems="center">
                                <button onClick={editingModule ? handleUpdate : addModule}>
                                    {editingModule ? "Mettre à jour" : "Ajouter"}
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
                            rows={mockDataContacts} // Données à afficher
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
                        rows={modulesList}
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
