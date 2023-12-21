import React, { useState } from 'react';
import { fetchTaskBreakdown } from '../../../lib/AI/taskBreakdown'; // Adjust the path as needed
import { Task } from '@prisma/client';

interface TaskComponentProps {
  task: Task;
}

const TaskComponent: React.FC<TaskComponentProps> = ({ task }) => {
  const [breakdown, setBreakdown] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFetchBreakdown = async () => {
    setLoading(true);
    const breakdownData = await fetchTaskBreakdown(task.id, task.title);
    setBreakdown(breakdownData);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center">
        <input type="checkbox" checked={task.completed} />
        <span className={`ml-2 ${task.completed ? 'line-through' : ''}`} onClick={handleFetchBreakdown}>
          {task.title}
        </span>
      </div>
      {/* Displaying the breakdown as a sublist */}
      {loading && <p>Loading...</p>}
      {breakdown.length > 0 && (
        <ul>
          {breakdown.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskComponent;
