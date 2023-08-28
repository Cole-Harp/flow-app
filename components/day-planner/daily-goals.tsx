import { useState } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { IconButton } from '@mui/material';


type DailyGoalsProps = {
  goals: string[];
  setGoals: (goals: string[]) => void;
};

const DailyGoals: React.FC<DailyGoalsProps> = ({ goals, setGoals }) => {
  const [newGoal, setNewGoal] = useState('');

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal]);
      setNewGoal('');
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold mb-2">Daily Goals</h3>
      <ul className="list-disc pl-5">
        {goals.map((goal, index) => (
          <li key={index}>{goal}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newGoal}
        onChange={(e) => setNewGoal(e.target.value)}
        placeholder="Add a new goal"
        className="border border-gray-300 rounded p-1 mt-2"
      />
      <IconButton onClick={handleAddGoal} className="bg-blue-500 text-white px-4 py-1 rounded ml-2">
        <Cross1Icon />
      </IconButton>
    </div>
  );
};

export default DailyGoals;