import { Box, useTheme, IconButton } from "@mui/material";
import { Header } from "../../components";
import { DataGrid, GridToolbar, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { mockDataContacts } from "../../data/mockData";
import { tokens } from "../../theme";
import React, { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import '../../assets/columns.css';
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


    // LES DONNEES SEMESTRE ET FILIERE 
    const [semestres, setSemestres] = useState([]);
    const [filieres, setFilieres] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Récupération des semestres
                const semestresResponse = await fetch('http://localhost:8080/api/semestres');
                const semestresData = await semestresResponse.json();
                setSemestres(semestresData);

                // Récupération des filières
                const filieresResponse = await fetch('http://localhost:8080/api/filieres');
                const filieresData = await filieresResponse.json();
                setFilieres(filieresData);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        };

        fetchData();
    }, []);

    const [elementsListModuleID, setElementsListModuleID] = useState([]);
    const [selectedModuleCode, setSelectedModuleCode] = useState(null);
    // Fonction pour récupérer les éléments d'un module
    useEffect(() => {
        if (!selectedModuleCode) return; // Skip if no module is selected

        axios
            .get(`http://localhost:8080/api/element/modules/${selectedModuleCode}`)
            .then((response) => {
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    const transformedData = response.data.map((elmt) => ({
                        id: elmt.ElementId,          // Use ElementId from backend
                        name: elmt.ElementName,      // Use ElementName from backend
                        codeModule: elmt.CodeModule, // Assuming CodeModule is part of the data
                        coefficient: elmt.Coefficient, // Add Coefficient to the transformed data
                        etatElement: elmt.EtatElement, // Add EtatElement to the transformed data
                        nomProfesseur: elmt.NomProfesseur
                    }));
                    setElementsListModuleID(transformedData); // Update elements list for modules
                } else {
                    console.log('No elements found for this module');
                    setElementsListModuleID([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching elements for module:', error);
                setElementsListModuleID([]);
            });
    }, [selectedModuleCode]); // Re-fetch when selectedModuleCode changes
    // Re-fetch when selectedModuleCode changes

    const handleFetchElements = (moduleCode) => {
        console.log('Selected Module Code:', moduleCode);
        setSelectedModuleCode(moduleCode);  // Set selected module code to trigger useEffect
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setModuleData((prevData) => ({
            ...prevData,
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
                fetchAffi()
                // Ajout du module à la liste existante dans l'état sans faire de nouvelle requête GET

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

    const [editingModule, setEditingModule] = useState(false);
    const handleEdit = async (module) => {
        setEditingModule(true);

        // Initialiser le formulaire avec les données du module de base
        setModuleData({
            idModule: module.idModule,
            codeModule: module.codeModule,
            nomModule: module.nomModule,
            nomSemestre: module.nomSemestre,
            nomFiliere: module.nomFiliere,
            elementsNom: "", // Temporarily empty
            elementsCoeff: "", // Temporarily empty
        });

        try {
            // Récupérer les éléments associés à ce module depuis l'API
            const response = await fetch(`http://localhost:8080/api/element/modules/${module.codeModule}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                // Remplir les données des éléments
                setModuleData((prevData) => ({
                    ...prevData,
                    elementsNom: data.map((e) => e.ElementName).join(","),
                    elementsCoeff: data.map((e) => e.Coefficient).join(","),
                }));
            } else {
                console.error("Aucun élément trouvé pour ce module.");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des éléments :", error);
        }
    };


    const handleUpdate = async () => {
        try {
            const elementsNomArray = moduleData.elementsNom.split(',');
            const elementsCoeffArray = moduleData.elementsCoeff.split(',').map(Number);

            const response = await fetch(`http://localhost:8080/api/modules/update/${moduleData.idModule}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    codeModule: moduleData.codeModule,
                    nomModule: moduleData.nomModule,
                    nomSemestre: moduleData.nomSemestre,
                    nomFiliere: moduleData.nomFiliere,
                    elementsNom: elementsNomArray,
                    elementsCoeff: elementsCoeffArray,
                }),
            });

            if (response.status === 200) {
                alert("Modalité mise à jour avec succès.");
                // Réinitialiser le formulaire et recharger les modules
                setEditingModule(false);
                setModuleData({
                    idModule: '',
                    codeModule: '',
                    nomModule: '',
                    nomSemestre: '',
                    nomFiliere: '',
                    elementsNom: '',
                    elementsCoeff: '',
                });
                fetchAffi()
            } else {
                console.error('Erreur lors de la mise à jour du module :', response);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du module :', error);
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
    const fetchAffi = () => {
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
    };

    useEffect(() => {
        fetchAffi(); // Appel de la fonction
    }, []);



    const columnsModules = [
        { field: "idModule", headerName: "ID", flex: 0.1 },
        {
            field: "codeModule", headerName: "Code", flex: 0.5, cellClassName: "multilineCell"
        },
        { field: "nomModule", headerName: "Nom", flex: 0.5, cellClassName: "multilineCell" },
        { field: "nomSemestre", headerName: "Semestre", flex: 0.3 },
        { field: "nomFiliere", headerName: "Filière", flex: 0.3 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.5,
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


                    <IconButton
                        onClick={() => handleFetchElements(params.row.codeModule)}
                        style={{ color: "black" }}
                        title="Afficher"
                    >
                        <VisibilityIcon />
                    </IconButton>

                </>
            ),
        },
    ];



    const Elementcolumns = [
        { field: "id", headerName: "ID", flex: 0.08 },
        {
            field: "name",
            headerName: "Name",
            flex: 0.6,
            cellClassName: "multilineCell"
        },
        {
            field: "nomProfesseur",
            headerName: "Professeur",
            flex: 0.6,
            cellClassName: "multilineCell"
        },
        {
            field: "coefficient",
            headerName: "coefficient",
            flex: 0.4,
            cellClassName: "name-column--cell",
        },
        {
            field: "etatElement",
            headerName: "Etat ",
            flex: 0.5,
            cellClassName: "multilineCell"
        },
        {
            field: "Actions",
            headerName: "Action",
            flex: 0.9,
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


                    <IconButton
                        onClick={() => handleFetchElements(params.row.codeModule)}
                        style={{ color: "black" }}
                        title="Afficher"
                    >
                        <VisibilityIcon />
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
        width: '80%',
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
                    display: 'flex', // Alignement horizontal
                }}
            >
                <Box
                    m="20px"
                    style={{
                        backgroundColor: '#f9f9f9',
                        borderRadius: '15px',
                        padding: '20px',
                        boxShadow: '2px 8px 8px rgba(26, 24, 24, 0.1)',
                        maxWidth: '800px', // Réduire la largeur
                        margin: '20px',    // Centrer la boîtes

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
                                    <select
                                        id="nomSemestre"
                                        style={inputStyle}
                                        name="nomSemestre"
                                        value={moduleData.nomSemestre}
                                        onChange={handleChange}
                                    >
                                        <option value="">Sélectionner un semestre</option>
                                        {semestres.map((semestre, index) => (
                                            <option key={index} value={semestre.id}>{semestre.nomSemestre}</option>
                                        ))}
                                    </select>
                                </Box>
                                <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label htmlFor="nomFiliere" style={labelStyle}>
                                        Filière :
                                    </label>
                                    <select
                                        id="nomFiliere"
                                        style={inputStyle}
                                        name="nomFiliere"
                                        value={moduleData.nomFiliere}
                                        onChange={handleChange}
                                    >
                                        <option value="">Sélectionner une filière</option>
                                        {filieres.map((filiere, index) => (
                                            <option key={index} value={filiere.id}>{filiere.nomFiliere}</option>
                                        ))}
                                    </select>
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


                    </Box>
                </Box>
                <Box
                    flex={1}
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        padding: '20px',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Box display="flex" flexDirection="column" gap="20px">
                        <Box display="flex" gap="20px">
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="nomElement" style={labelStyle}>
                                    Nom Élément :
                                </label>
                                <input
                                    type="text"
                                    id="nomElement"
                                    name="nomElement"

                                    style={inputStyle}
                                />
                            </Box>
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="coefficient" style={labelStyle}>
                                    Coefficient :
                                </label>
                                <input
                                    type="text"
                                    id="coefficient"
                                    name="coefficient"

                                    style={inputStyle}
                                />
                            </Box>
                        </Box>

                        <Box display="flex" gap="20px">
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="etatElement" style={labelStyle}>
                                    État Élément :
                                </label>
                                <input
                                    type="text"
                                    id="etatElement"
                                    name="etatElement"

                                    style={inputStyle}
                                />
                            </Box>
                            <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="idProfesseur" style={labelStyle}>
                                    Professeur ID :
                                </label>
                                <input
                                    type="number"
                                    id="idProfesseur"
                                    name="idProfesseur"

                                    style={inputStyle}
                                />
                            </Box>
                        </Box>

                        <Box display="flex" gap="20px" justifyContent="center" mt="20px">
                            <button style={buttonStyle}>
                                Ajouter Élément
                            </button>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box display="flex" gap="20px" height="75vh">
                <Box flex={0.5} sx={{ maxWidth: "45%" }}>
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
                        rows={elementsListModuleID}
                        columns={Elementcolumns}
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

                <Box flex={1} sx={{ maxWidth: "25%" }}>
                    <DataGrid
                        rows={elementsListModuleID}
                        columns={Elementcolumns}
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
        </Box >
    );
};

export default ModuleElement;
