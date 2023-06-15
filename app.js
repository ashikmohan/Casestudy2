// Task1: initiate app and run server at 3000
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const morgan=require('morgan')

const app = express();
const port = 3000;

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
app.use(express.json());

// Task2: create mongoDB connection 

// Replace placeholders with your MongoDB Atlas connection string and database name
const MONGODB_URI = 'mongodb+srv://AshikMohan:Ashik12345@cluster0.vw6y7bq.mongodb.net/Database2/Employee?retryWrites=true&w=majority'
const DB_NAME = 'Database2';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: DB_NAME
})
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });



  const employeeSchema = new mongoose.Schema({
    name: String,
    location: String,
    position: String,
    salary: Number,
  });
  
  const Employee = mongoose.model('Employee', employeeSchema);



//Task 2 : write api with error handling and appropriate api mentioned in the TODO below







//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist', (req, res) => {
    Employee.find()
      .then((employees) => {
        res.json(employees);
      })
      .catch((error) => {
        console.error('Error retrieving employees:', error);
        res.status(500).json({ error: 'An error occurred while retrieving employees' });
      });
  });


//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id', (req, res) => {
    const { id } = req.params;
  
    Employee.findById(id)
      .then((employee) => {
        if (!employee) {
          return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee);
      })
      .catch((error) => {
        console.error('Error retrieving employee:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the employee' });
      });
  });
  



//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist', (req, res) => {
    const { name, location, position, salary } = req.body;
  
    const newEmployee = new Employee({ name, location, position, salary });
  
    newEmployee.save()
      .then(() => {
        res.json({ message: 'Employee added successfully' });
      })
      .catch((error) => {
        console.error('Error adding employee:', error);
        res.status(500).json({ error: 'An error occurred while adding the employee' });
      });
  });




//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', (req, res) => {
    const { id } = req.params;
  
    Employee.findByIdAndDelete(id)
      .then((employee) => {
        if (!employee) {
          return res.status(404).json({ error: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
      })
      .catch((error) => {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'An error occurred while deleting the employee' });
      });
  });




//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put('/api/employeelist/:id', (req, res) => {
    const { id } = req.params;
    const { name, location, position, salary } = req.body;
  
    Employee.findByIdAndUpdate(id, { name, location, position, salary })
      .then((employee) => {
        if (!employee) {
          return res.status(404).json({ error: 'Employee not found' });
        }
        res.json({ message: 'Employee updated successfully' });
      })
      .catch((error) => {
        console.error('Error updating employee:', error);
        res.status(500).json({ error: 'An error occurred while updating the employee' });
      });
  });

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});





app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
