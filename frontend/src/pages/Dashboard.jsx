import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskCard from '../components/TaskCard';
import API_URL from '../config';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do' });
  const [editTaskId, setEditTaskId] = useState(null);
  const token = localStorage.getItem('authToken');

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle create or update task
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editTaskId
        ? `${API_URL}${editTaskId}`
        : `${API_URL}/tasks`;
      const method = editTaskId ? 'put' : 'post';

      await axios[method](url, newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchTasks(); // Refresh task list
      setNewTask({ title: '', description: '', status: 'To Do' });
      setEditTaskId(null);
    } catch (error) {
      console.error('Error saving task:', error.response?.data || error.message);
    }
  };

  // Handle delete task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Handle edit task
  const handleEdit = (task) => {
    setNewTask(task);
    setEditTaskId(task._id);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      {/* Task Form */}
      <form onSubmit={handleFormSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        ></textarea>
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editTaskId ? 'Update Task' : 'Add Task'}
        </button>
      </form>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDelete={handleDelete}
            onEdit={() => handleEdit(task)}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;