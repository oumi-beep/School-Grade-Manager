import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  Team,
  Invoices,
  Contacts,
  Form,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
  HomePage,
  Login,
  ModuleElement,
  ModeEvaluation 
} from "./scenes";

import Starts from "./scenes/Starts";
import ProfessorsSide from "./scenes/ProfessorsSide";
import Professors from "./scenes/Professors";
import Fields from "./scenes/Fields";
 
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<Login />} />
        {/* Routes imbriquées sous le composant App */}
        <Route path="/Dashboard" element={<App />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Dashboard/Professors" element={<Professors />} />
          <Route path="/Dashboard/Fields" element={<Fields />} />
          <Route path="/Dashboard/ModuleElement" element={<ModuleElement />} />
          <Route path="/Dashboard/team" element={<Team />} />
          <Route path="/Dashboard/ModeEvaluation" element={<ModeEvaluation />} />
          <Route path="/Dashboard/invoices" element={<Invoices />} />
          <Route path="/Dashboard/form" element={<Form />} />
          <Route path="/Dashboard/calendar" element={<Calendar />} />
          <Route path="/Dashboard/bar" element={<Bar />} />
          <Route path="/Dashboard/pie" element={<Pie />} />
          <Route path="/Dashboard/stream" element={<Stream />} />
          <Route path="/Dashboard/line" element={<Line />} />
          <Route path="/Dashboard/faq" element={<FAQ />} />
          <Route path="/Dashboard/geography" element={<Geography />} />
]        </Route>

          {/* Espace Professeur*/}
          <Route path="/ProfessorsSide" element={<App />} >
            <Route path="" element={<ProfessorsSide />} />
            <Route path="/ProfessorsSide/notes" element={<Starts />} />
          </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
