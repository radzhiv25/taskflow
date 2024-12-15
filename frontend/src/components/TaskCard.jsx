import React from 'react';

const TaskCard = ({ task, onDelete, onEdit }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="font-bold text-lg">{task.title}</h2>
      <p>{task.description}</p>
      <p className="text-gray-500 text-sm">Status: {task.status}</p>
      <div className="mt-4 flex space-x-2">
        <button onClick={() => onEdit(task)} className="bg-yellow-500 px-3 py-1 text-white rounded">
          Edit
        </button>
        <button onClick={() => onDelete(task._id)} className="bg-red-500 px-3 py-1 text-white rounded">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;