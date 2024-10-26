const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todo-app', { useNewUrlParser: true, useUnifiedTopology: true });

const taskSchema = new mongoose.Schema({
    title: String,
    completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// Get all tasks
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Add a new task
app.post('/api/tasks', async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

// Toggle task completion
app.patch('/api/tasks/:id/toggle', async (req, res) => {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.json(task);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
