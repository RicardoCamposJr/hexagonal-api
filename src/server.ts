import express from 'express';
import TaskRepositoryDB from './tasks/adapter/persistence/taskRepositoryDB';
import TaskController from './tasks/http/rest/taskController';
import UserRepositoryDB from './tasks/adapter/persistence/userRepositoryDB';
import UserController from './tasks/http/rest/userController';

const taskRepository = new TaskRepositoryDB()
const userRepository = new UserRepositoryDB()

const taskController = new TaskController(taskRepository)
const userController = new UserController(userRepository)

const app = express();

app.use(express.json());
app.use('/tasks', taskController.buildRouter());
app.use('/users', userController.buildRouter());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});