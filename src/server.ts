import express from 'express';
// import TaskRepositoryDB from './tasks/adapter/persistence/taskRepositoryDB';
import TaskController from './tasks/http/rest/taskController';
import TaskRepositoryArray from './tasks/adapter/persistenceArray/taskRepositoryArray';

// const taskRepository = new TaskRepositoryDB()
const taskRepository = new TaskRepositoryArray()
const taskController = new TaskController(taskRepository)

const app = express();

app.use(express.json());
app.use('/tasks', taskController.buildRouter());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});