import React from 'react';
 
const Overview = () => {
  return (
    <div>
        
       <div style={{ padding: "20px" }}>
        <h1>Professors Side</h1>
        <p>Welcome to the Professors Side of the application. Here you can manage your courses, students, and other resources.</p>

         <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <div style={{ background: "#f0f0f0", padding: "20px", borderRadius: "8px", flex: 1, marginRight: "20px" }}>
            <h2>Courses Overview</h2>
            <p>Number of Courses: 10</p>
            <p>Active Courses: 8</p>
            <p>Upcoming Courses: 2</p>
          </div>
          
          <div style={{ background: "#f0f0f0", padding: "20px", borderRadius: "8px", flex: 1, marginLeft: "20px" }}>
            <h2>Student Overview</h2>
            <p>Total Students: 200</p>
            <p>Active Students: 180</p>
            <p>Graduated Students: 20</p>
          </div>
        </div>

         <div style={{ marginTop: "40px" }}>
          <h2>Quick Links</h2>
          <ul>
            <li><a href="/ProfessorsSide">Test Courses</a></li>
            <li><a href="/ProfessorsSide">Manage Students</a></li>
            <li><a href="/ProfessorsSide">View Calendar</a></li>
            <li><a href="/ProfessorsSide">Grade Management</a></li>
            <li><a href="/ProfessorsSide">View Reports</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Overview;
