"use client";

import { useState } from 'react';
import TodoList from '../../..//components/day-planner/Todolist';
import Schedule from '../../../components/day-planner/Scheduler';

type DayPlannerProps = {
  initialData: {
    daily_goals: string[];
    schedule: { time: string; event: string }[];
    todos: { text: string; completed: boolean }[];
  };
};

const DayPlanner: React.FC<DayPlannerProps> = ({ initialData }) => {
  const [dailyGoals, setDailyGoals] = useState([""]);
  const [todos, setTodos] = useState([]);

  const handleSave = async () => {
    const data = { daily_goals: dailyGoals, todos };
    alert('Saved!');
  };

  return (
    <div>
      <Schedule />
      <TodoList todos={todos} setTodos={setTodos} />
    </div>
  );
};

export default DayPlanner;