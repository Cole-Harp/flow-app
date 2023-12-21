"use client";
import { useState } from 'react';
import { ITask } from './types';
import TaskComponent from './Task';
import { Task } from '@prisma/client';
import { createTask } from '@/lib/serv-actions/Todo';

interface TodosProps {
    initTasks: Task[]; // Define the prop correctly
}

const Todos: React.FC<TodosProps> = ({ initTasks }) => {
  const [tasks, setTasks] = useState<Task[]>(initTasks); // Correct the initial state
  const [newTask, setNewTask] = useState<string>('');

  // You need to adjust the function signature here if necessary
  const handleAddTask = async () => {
    if (newTask) {
        const task = await createTask(newTask);
        setTasks((prevTasks) => [...prevTasks, task]);
        setNewTask('');

    }
  }


  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 mr-2"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2" onClick={handleAddTask}>
          Add Task
        </button>
      </div>
      <div>
        {tasks.map((task) => (
          <TaskComponent key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Todos;
