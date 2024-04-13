import React, { useState } from "react";
import axios from "axios";
import moment from "moment-timezone";
import { Link } from "react-router-dom";

import "./App.css";

const StudentDetails = () => {
  const [barcode, setBarcode] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (bar) => {
    console.log(barcode);
    const currentTimeIST = moment().tz("Asia/Kolkata").format();
    // console.log(currentTimeIST.toString());

    try {
      const response = await axios.get(
        `http://localhost:5000/student/${bar}`
      );
      setStudent(response.data);
      setError(null);

      // Send search details to the server
      await axios.post("http://localhost:5000/entry", {
        barcode: response.data.barcode,
        name: response.data.name,
        year: response.data.year,
        dept: response.data.dept,
        section: response.data.section,
        entryAt: currentTimeIST,
      });
    } catch (error) {
      setError("Student not found");
      setStudent(null);
    }
  };

  return (
    <div>
      <Link to="/report" style={{ color: 'aqua' }}>Report</Link>
      <div className="input-group">
        <h1>Student Details</h1>
        <input style={{ width: '500px' }}
          type="text"
          placeholder="Enter Barcode"
          value={barcode}
          onChange={(e) => {
            var bar=e.target.value;
            setBarcode(bar); 
            if (bar.length === 10) {
              handleSearch(bar);}
            }}
        />
        <button onClick={handleSearch} className="button primary">
          Search
        </button>
        {error && <p>{error}</p>}
        {student && (
          <div>
            <h3>Barcode : {student.barcode}</h3>
            <h3>Name : {student.name}</h3>
            <h3>Year : {student.year}</h3>
            <h3>Dept : {student.dept}</h3>
            <h3>Section : {student.section}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;
