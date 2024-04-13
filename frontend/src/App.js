import React from "react";
import StudentDetails from "./StudentDetails";
import Report from "./Report";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StudentDetails></StudentDetails>}></Route>
          <Route path="/report" element={<Report></Report>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
