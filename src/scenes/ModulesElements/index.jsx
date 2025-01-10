import { Box, useTheme, IconButton } from "@mui/material";
import { Header } from "../../components";
import { DataGrid, GridToolbar, GridToolbarQuickFilter } from "@mui/x-data-grid";
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
        idModule: null,
        codeModule: "",
        nomModule: "",
        nomSemestre: "",
        nomFiliere: "",
        elementsNom: "",
        elementsCoeff: "",
    });


    const [elementData, setElementData] = useState({
        elementId: "",
        elementName: "",
        coefficient: "",
        etatElement: "",
        professeurNom: "",
        professeurPrenom: "",
        modesNoms: "",
        modesCoefficients: "",
        professeurNomComplet: "",
    });
    const [modesList, setModesList] = useState([]);
    // Suppression d'une modalité
    const handleDeleteMode = async (idModeEval) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer la modalité ID ${idModeEval} ?`)) {
            try {
                await axios.delete(`http://localhost:8080/api/modes-evaluation/delete/${idModeEval}`);
                alert("Modalité supprimée avec succès.");

                // Recharge la liste des modalités après suppression
                if (selectedElement) {
                    const selectedElementObj = elementsList.find(
                        (element) => element.elementName === selectedElement
                    );
                    if (selectedElementObj) {
                        await handleFetchModes(selectedElementObj.elementId, selectedElement);
                    }
                }
                // Met à jour la liste des modalités
                setModesList((prevModes) => prevModes.filter((mode) => mode.idModeEval !== idModeEval));
            } catch (error) {
                console.error("Erreur lors de la suppression de la modalité :", error);
                alert("Une erreur est survenue lors de la suppression de la modalité.");
            }
        }
    };

    const [professeurs, setProfesseurs] = useState([]);

    useEffect(() => {
        const fetchProfessors = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/professors');
                setProfesseurs(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des professeurs :', error);
            }
        };

        fetchProfessors();
    }, []);

    const handleChangeElement = (e) => {
        const { name, value } = e.target;
        setElementData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleChangeProfessor = (event) => {
        const fullName = event.target.value.trim();
        const [prenom, ...nomParts] = fullName.split(" ");
        const nom = nomParts.join(" ");

        setElementData((prevData) => ({
            ...prevData,
            professeurNomComplet: fullName,
            professeurPrenom: prenom || "",  // Gestion si seul un prénom est saisi
            professeurNom: nom || ""         // Gestion si aucun nom de famille n'est fourni
        }));
    };



    const handleSaveElement = async () => {
        const modesNomArray = elementData.modesNoms.split(",").map((nom) => nom.trim());
        const modesCoeffArray = elementData.modesCoefficients.split(",").map((coeff) => parseFloat(coeff));

        // Vérification du nombre de modes et de coefficients
        if (modesNomArray.length !== modesCoeffArray.length) {
            alert("Le nombre de modalités et le nombre de coefficients doivent être identiques.");
            return;
        }

        // Vérification que tous les coefficients sont numériques et valides
        if (modesCoeffArray.some(isNaN)) {
            alert("Tous les coefficients doivent être des valeurs numériques.");
            return;
        }
        // Vérification de la somme des coefficients
        const sumCoefficients = modesCoeffArray.reduce((sum, coeff) => sum + coeff, 0);
        if (sumCoefficients !== 1) {
            alert("La somme des coefficients des modalités doit être égale à 1.");
            return; // Interrompt la fonction si la condition n'est pas respectée
        }

        const updatedElement = {
            elementId: elementData.elementId,
            elementName: elementData.elementName,
            coefficient: elementData.coefficient,
            etatElement: elementData.etatElement,
            professeurNom: elementData.professeurNom,
            professeurPrenom: elementData.professeurPrenom,
            modesNoms: modesNomArray,
            modesCoefficients: modesCoeffArray,
        };

        try {
            await axios.put(`http://localhost:8080/api/element/${elementData.elementId}`, updatedElement);
            alert("Élément mis à jour avec succès !");


            // Réinitialisation des champs
            setElementData({
                elementId: "",
                elementName: "",
                coefficient: "",
                etatElement: "",
                professeurNom: "",
                professeurPrenom: "",
                modesNoms: "",
                modesCoefficients: "",
            });



        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'élément :", error);
            alert("Erreur lors de la mise à jour de l'élément.");
        }
    };

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


    const handleSave = () => {
        // Transformer les chaînes de noms et coefficients en listes
        const elementsNomArray = moduleData.elementsNom.split(",").map((nom) => nom.trim());
        const elementsCoeffArray = moduleData.elementsCoeff.split(",").map((coeff) => parseFloat(coeff));
        // Vérification de compatibilité des tailles
        if (elementsNomArray.length !== elementsCoeffArray.length) {
            alert("Le nombre d'éléments et le nombre de coefficients doivent être identiques.");
            return;
        }

        // Vérification que tous les coefficients sont des nombres valides
        if (elementsCoeffArray.some(isNaN)) {
            alert("Tous les coefficients doivent être des valeurs numériques valides.");
            return;
        }

        // Vérification que la somme des coefficients est égale à 1
        const sumCoefficients = elementsCoeffArray.reduce((sum, coeff) => sum + coeff, 0);
        if (sumCoefficients !== 1) {
            alert("La somme des coefficients des éléments doit être égale à 1.");
            return;
        }
        const updatedModule = {
            idModule: moduleData.idModule,
            codeModule: moduleData.codeModule,
            nomModule: moduleData.nomModule,
            nomSemestre: moduleData.nomSemestre,
            nomFiliere: moduleData.nomFiliere,
            elementsNom: elementsNomArray,
            elementsCoeff: elementsCoeffArray,
        };

        axios
            .put(`http://localhost:8080/api/modules/${moduleData.idModule}`, updatedModule)
            .then(() => {
                alert("Module mis à jour avec succès !");
                setEditingMode(null);
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


            })

            .catch((error) => {
                console.error(error);
                alert("Erreur lors de la mise à jour du module.");
            });
    };
    const [editingMode, setEditingMode] = useState(false);
    const fetchElementDetails = async (element) => {
        try {
            // Appel à l'API pour récupérer les éléments associés au module
            const response = await fetch(`http://localhost:8080/api/element/modes/${element.elementId}`);
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des éléments.");
            }

            const modes = await response.json();


            console.log(modes)
            // Préparer les données des éléments pour les afficher dans le formulaire
            const modesNom = modes.map(mode => mode.nomMode).join(',');
            const modesCoeff = modes.map(mode => mode.coefficient).join(',');
            console.log(modesNom)

            // Mettre à jour les données de l'élément
            setElementData({
                elementId: element.elementId,
                elementName: element.elementName,
                coefficient: element.coefficient,
                etatElement: element.etatElement,
                professeurNomComplet: `${element.professeurPrenom || ""} ${element.professeurNom || ""}`,
                modesNoms: modesNom,
                modesCoefficients: modesCoeff,

            });
        } catch (error) {
            console.error("Erreur lors de la récupération des détails de l'élément :", error);
            alert("Erreur lors de la récupération des détails de l'élément.");
        }
    };

    const handleEdit = async (module) => {
        try {
            // Appel à l'API pour récupérer les éléments associés au module
            const response = await fetch(`http://localhost:8080/api/element/module/${module.idModule}`); // Remplacez par l'URL correcte de votre API
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des éléments.");
            }

            const elements = await response.json();
            console.log(elements);

            // Extraction des noms des éléments
            const elementNames = elements.map(item => item.elementName).join(',');
            const elementCoeffs = elements.map(item => item.coefficient).join(',');


            // Mettre à jour les données du formulaire avec les informations du module et des éléments
            setModuleData({
                idModule: module.idModule,
                codeModule: module.codeModule,
                nomModule: module.nomModule,
                nomSemestre: module.nomSemestre,
                nomFiliere: module.nomFiliere,

                elementsNom: elementNames,
                elementsCoeff: elementCoeffs,
            });
            setEditingMode(true);



            // Optionnel : Charger d'autres données (semestres, filières, etc.) si nécessaire
        } catch (error) {
            console.error("Erreur lors de la gestion de l'édition :", error);
        }
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

    const [elementsList, setElementsList] = useState([]);
    const [selectedModuleName, setSelectedModuleName] = useState("");
    const handleFetchElements = async (moduleId, moduleName) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/element/module/${moduleId}`);
            const transformedElements = response.data.map((element, index) => ({
                id: index + 1,
                ...element,
            }));
            setElementsList(transformedElements);
            setSelectedModuleName(moduleName);
        } catch (error) {
            console.error("Erreur lors de la récupération des éléments :", error);
        }
    };
    const columnsModules = [
        { field: "idModule", headerName: "ID", flex: 0.05 },
        {
            field: "codeModule", headerName: "Code", flex: 0.4, cellClassName: "multilineCell"
        },
        { field: "nomModule", headerName: "Nom", flex: 0.4, cellClassName: "multilineCell" },
        { field: "nomSemestre", headerName: "Semestre", flex: 0.3 },
        { field: "nomFiliere", headerName: "Filière", flex: 0.3 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.7,
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
                        onClick={() => handleFetchElements(params.row.idModule, params.row.nomModule)}
                        style={{ color: "black" }}
                        title="Afficher"
                    >
                        <VisibilityIcon />
                    </IconButton>

                </>
            ),
        },
    ];

    const handleDeleteElement = async (idElement) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'élément avec l'ID ${idElement} et ses associations ?`)) {
            try {
                await axios.delete(`http://localhost:8080/api/element/deleteElement/${idElement}`);
                alert("Élément supprimé avec succès.");

                // Recharge la liste des éléments associés au module sélectionné
                if (selectedModuleName) {
                    const selectedModule = modulesList.find(module => module.nomModule === selectedModuleName);
                    if (selectedModule) {
                        await handleFetchElements(selectedModule.idModule, selectedModule.nomModule);
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la suppression de l'élément :", error);
                alert("Une erreur est survenue lors de la suppression de l'élément.");
            }
        }
    };

    const [modes, setModes] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);

    const handleFetchModes = async (elementId, elementName) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/element/modes/${elementId}`);
            const transformedModes = response.data.map((mode, index) => ({
                id: index + 1, // Ajout d'un ID unique basé sur l'index
                ...mode,
            }));
            setModes(transformedModes);
            setSelectedElement(elementName);
        } catch (error) {
            console.error("Erreur lors de la récupération des modalités :", error);
        }
    };

    const columnsModes = [
        { field: "idModeEval", headerName: "ID Modalité", flex: 0.2 },
        { field: "nomMode", headerName: "Nom Modalité", flex: 0.4 },
        { field: "coefficient", headerName: "Coefficient", flex: 0.4 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.7,
            renderCell: (params) => (
                <>

                    <IconButton
                        onClick={() => handleDeleteMode(params.row.idModeEval)}
                        style={{ color: "red" }}
                    >
                        <DeleteIcon />
                    </IconButton>




                </>
            ),
        },
    ];

    const columnsElements = [
        { field: "elementId", headerName: "ID", flex: 0.1 },
        { field: "elementName", headerName: "Nom", flex: 0.3 },
        { field: "coefficient", headerName: "Coefficient", flex: 0.3 },
        {
            field: "professeurNomComplet",
            headerName: "Professeur",
            flex: 0.4,
            valueGetter: (params) => `${params.row.professeurPrenom || ""} ${params.row.professeurNom || ""}`,
        },
        { field: "etatElement", headerName: "État", flex: 0.4 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.7,
            renderCell: (params) => (
                <>
                    <IconButton
                        onClick={() => fetchElementDetails(params.row)}
                        style={{ color: "blue", marginRight: "10px" }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handleDeleteElement(params.row.elementId)}
                        style={{ color: "red" }}
                    >
                        <DeleteIcon />
                    </IconButton>


                    <IconButton
                        onClick={() => handleFetchModes(params.row.elementId, params.row.elementName)}
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
                                <Box flex={1} display="flex" justifyContent="center" alignItems="center" >

                                    <button style={buttonStyle} onClick={editingMode ? handleSave : addModule} type="submit">
                                        {editingMode ? "Mettre à jour" : "Ajouter"}
                                    </button>
                                </Box>
                            </Box>

                        </Box>

                        {/* Right Side  */}


                    </Box>
                </Box>
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
                                    <label htmlFor="elementName" style={labelStyle}>
                                        Nom de l'Élément :
                                    </label>
                                    <input
                                        type="text"
                                        style={inputStyle}
                                        id="elementName"
                                        name="elementName"
                                        value={elementData.elementName}
                                        onChange={handleChangeElement}
                                    />
                                </Box>
                                <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label htmlFor="coefficient" style={labelStyle}>
                                        Coefficient :
                                    </label>
                                    <input
                                        type="number"
                                        style={inputStyle}
                                        id="coefficient"
                                        name="coefficient"
                                        value={elementData.coefficient}
                                        onChange={handleChangeElement}
                                    />
                                </Box>
                            </Box>

                            <Box display="flex" gap="20px">
                                <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label htmlFor="etatElement" style={labelStyle}>
                                        État de l'Élément :
                                    </label>
                                    <select
                                        id="etatElement"
                                        style={inputStyle}
                                        name="etatElement"
                                        value={elementData.etatElement}
                                        onChange={handleChangeElement}
                                    >
                                        <option value="">Sélectionner l'état</option>
                                        <option value="Validé">Validé</option>
                                        <option value="Non Validé">Non Validé</option>
                                    </select>
                                </Box>
                                <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label htmlFor="professeurId" style={labelStyle}>
                                        Professeur :
                                    </label>
                                    <select
                                        id="professeurId"
                                        name="professeurNomComplet"
                                        value={elementData.professeurNomComplet || ""}
                                        onChange={handleChangeProfessor}
                                        style={inputStyle}
                                    >
                                        <option value="">Sélectionnez un professeur</option>
                                        {professeurs.map((prof) => (
                                            <option key={prof.CodeProf} value={`${prof.FirstName} ${prof.LastName}`}>
                                                {prof.FirstName} {prof.LastName}
                                            </option>
                                        ))}
                                    </select>
                                </Box>
                            </Box>

                            <Box display="flex" gap="20px">

                                <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label htmlFor="modesNoms" style={labelStyle}>
                                        Modalités d'Évaluation (séparés par des virgules) :
                                    </label>
                                    <input
                                        type="text"
                                        id="modesNoms"
                                        name="modesNoms"
                                        value={elementData.modesNoms}
                                        onChange={handleChangeElement}
                                        style={inputStyle}
                                    />
                                </Box>
                            </Box>

                            <Box display="flex" gap="20px">
                                <Box flex={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label htmlFor="modesCoefficients" style={labelStyle}>
                                        Coefficients des Modalités (séparés par des virgules) :
                                    </label>
                                    <input
                                        type="text"
                                        id="modesCoefficients"
                                        name="modesCoefficients"
                                        value={elementData.modesCoefficients}
                                        onChange={handleChangeElement}
                                        style={inputStyle}
                                    />
                                </Box>
                            </Box>

                            <Box display="flex" gap="20px" justifyContent="center" mt="20px">
                                <Box flex={1} display="flex" justifyContent="center" alignItems="center">
                                    <button style={buttonStyle} onClick={
                                        handleSaveElement
                                    } type="submit">
                                        Mettre à jour
                                    </button>
                                </Box>
                            </Box>
                        </Box>

                        {/* Right Side  */}


                    </Box>
                </Box>
            </Box>
            <Box display="flex" gap="20px" height="75vh">
                <Box flex={0.5} sx={{ maxWidth: "42%" }}>
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

                <Box flex={1} sx={{ maxWidth: "30% " }}>
                    < DataGrid
                        rows={elementsList}
                        columns={columnsElements}
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
                <Box flex={1} sx={{ maxWidth: "25% " }}>
                    < DataGrid
                        rows={modes}
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
