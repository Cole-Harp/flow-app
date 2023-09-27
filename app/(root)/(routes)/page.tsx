
import { useState } from 'react';
import TodoList from '../../../components/Productivity_Page/Todolist';
import { Todo } from "../../../components/Productivity_Page/Todolist";
import DemoApp from '../../../components/Productivity_Page/Scheduler';
import { findOrCreateUser } from '@/lib/serv-actions/User';

const DayPlanner = async () => {

  const user =  await findOrCreateUser()

  return (
    <div className='p-5 flex'>
      {user.email}
      <div className='w-1/3'>
      </div>
      <div className='w-2/3'>

      </div>
    </div>
  );
};

export default DayPlanner;