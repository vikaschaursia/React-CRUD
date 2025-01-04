const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/employeeDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>{ console.log("Connected to MongoDB") })
  .catch(err => { console.error("Could not connect to MongoDB", err) });

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String
});

const Employee = mongoose.model('Employee', employeeSchema);

app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();

    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }

    res.status(200).json(employees); e
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error });
  }
});


app.post('/api/employees', async (req, res) => {
  const { firstName, lastName, email, phone, address } = req.body;
  const newEmployee = new Employee({
    firstName,
    lastName,
    email,
    phone,
    address
  });

  try {
    const savedEmployee = await newEmployee.save();
    res.status(200).json(savedEmployee);
  } catch (error) {
    console.error('Error saving employee:', error);
    res.status(500).json({ message: 'Failed to save employee' });
  }
});


app.get('/api/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee', error });
  }
});


app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, address } = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, {
      firstName,
      lastName,
      email,
      phone,
      address
    }, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error });
  }
});


app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error });
  }
});

app.listen(port, () => {
  console.log(`Server on http://localhost:${port}`);
});
