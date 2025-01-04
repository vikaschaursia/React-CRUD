import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: ''
  });
  const [tableData, setTableData] = useState([]); 
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

 
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setTableData(response.data); 
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/employees', formData);
      setTableData([...tableData, response.data]);  
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', address: ''
      }); 
      console.log('Employee saved:', response.data);
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

 
  const handleEdit = async (id) => {
    try {
      const editData = await axios.get(`http://localhost:5000/api/employees/${id}`);
      console.log(editData.data);
      setFormData(editData.data);  
      setIsPopupOpen(true);  
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

 
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/employees/${formData._id}`, formData);
      setTableData(tableData.map(employee => 
        employee._id === formData._id ? formData : employee
      )); 
      setIsPopupOpen(false); 
      console.log('Employee updated successfully');
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

 
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      setTableData(tableData.filter(employee => employee._id !== id)); 
      console.log("Employee deleted:", id);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <>
      <div className="div">
        <div className="employee-form">
          <h1>Employee Form</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>First Name:</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required/>
            </div>
            <div>
              <label>Last Name:</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required/>
            </div>
            <div>
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required/>
            </div>
            <div>
              <label>Phone:</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required/>
            </div>
            <div>
              <label>Address:</label>
              <textarea name="address" value={formData.address} onChange={handleChange} required></textarea>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>

        <div align="center">
          <h2>Show Employee List</h2>
          <table border="1">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map(employee => (
                <tr key={employee._id}>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.address}</td>
                  <td>
                    <button onClick={() => handleEdit(employee._id)}>Edit</button>
                    <button onClick={() => handleDelete(employee._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
