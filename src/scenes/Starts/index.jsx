import React, { useState, useEffect } from "react";
import axios from "axios";
import './indexStart.scss';

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
  const [selectedNiveau, setSelectedNiveau] = useState(null);
  const [error, setError] = useState(null);

  // Fetch professorId from local storage
  const professorId = localStorage.getItem("userId");

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

  // Fetch Filières
  const fetchFilieres = async (semesterId) => {
    setLoadingFilieres(true);
    setFilieres([]); // Clear previous filieres
    setElements([]); // Clear elements when changing filiere
    try {
      const response = await axios.get(
        `http://localhost:8080/api/filieres/findBySemesterAndProfessor`,
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

  // Fetch Elements
  const fetchElements = async (filiereId) => {
    setLoadingElements(true);
    setSelectedFiliereId(filiereId);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/element/findByFiliereAndProfessorAsMap`,
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

  const fetchStudents = async () => {
    if (!selectedFiliereId || !selectedNiveau) {
      alert("Please select both Filiere and Niveau.");
      return;
    }

    setLoadingStudents(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/StudentList/${selectedFiliereId}/${selectedNiveau}`
      );
      setStudents(response.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to fetch students.");
    } finally {
      setLoadingStudents(false);
    }
  };

  if (loadingSemesters) return <p>Loading semesters...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="semesterss-container">
    <h1>Semesters Assigned</h1>
    {loadingSemesters ? (
      <p className="loadingg">Loading semesters...</p>
    ) : error ? (
      <p className="errorr">{error}</p>
    ) : (
      <ul>
        {semesters.map((semester) => (
          <li key={semester.id}>
            <button onClick={() => fetchFilieres(semester.id)}>
              <strong>{semester.name}</strong>
            </button>
          </li>
        ))}
      </ul>
    )}

      {loadingFilieres && <p>Loading filières...</p>}
      {filieres.length > 0 && !loadingFilieres && (
        <div className="filiere-container">
          <h2>Filières for Selected Semester</h2>
          <ul>
            {filieres.map((filiere) => (
              <li key={filiere.id}>
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
              <button onClick={() => fetchStudents(element.idElement)}>
                <strong>{element.nomElement}</strong>
                </button>

                <p>Coefficient: {element.coefficient}</p>
                {/* <p>Professor: {element.professeur.nomProf}</p> */}
                <p>Module: {element.module.nomModule}</p>
              </li>

            ))}
          </ul>
        </div>
      )}
      {loadingStudents && <p>Loading students...</p>}
      {students.length > 0 && !loadingStudents && (
        <div>
          <h2>Students for Selected Filière and Niveau</h2>
          <ul>
            {students.map((student) => (
              <li key={student.id}>
                <p>
                  <strong>{student.nomEtudiant}</strong>
                </p>
                <p>First Name: {student.prenomEtudiant}</p>
              </li>
            )
            )}
        
          </ul>
        </div>
      )}

    </div>
  );
};

export default SemestersList;
