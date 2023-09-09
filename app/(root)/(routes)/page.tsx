"use client";
import { useState } from 'react';
import TodoList from '../../../components/day-planner/Todolist';
import { Todo } from "../../../components/day-planner/Todolist";
import DemoApp from '../../../components/day-planner/Scheduler';

const DayPlanner = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <div className='p-5 flex'>
      <div className='w-1/3'>
        <TodoList todos={todos} setTodos={setTodos} />
      </div>
      <div className='w-2/3'>
        <DemoApp todos={todos} />
      </div>
    </div>
  );
};

export default DayPlanner;