import React, { useState } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { IconButton, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

type SubTodo = {
  text: string;
  completed: boolean;
};

type Todo = {
  text: string;
  completed: boolean;
  subTodos: SubTodo[];
};

type TodoListProps = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
};

const TodoList: React.FC<TodoListProps> = ({ todos, setTodos }) => {
  const [newTodo, setNewTodo] = useState('');
  const [newSubTodo, setNewSubTodo] = useState('');
  const [activeSubTodoInput, setActiveSubTodoInput] = useState<number | null>(null);

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { text: newTodo, completed: false, subTodos: [] }]);
      setNewTodo('');
    }
  };

  const handleAddSubTodo = (index: number) => {
    if (newSubTodo.trim()) {
      const newTodos = [...todos];
      newTodos[index].subTodos.push({ text: newSubTodo, completed: false });
      setTodos(newTodos);
      setNewSubTodo('');
      setActiveSubTodoInput(null);
    }
  };

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const handleToggleSubTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
    todoIndex: number,
    subTodoIndex: number
  ) => {
    const newTodos = [...todos];
    newTodos[todoIndex].subTodos[subTodoIndex].completed = !newTodos[todoIndex].subTodos[subTodoIndex].completed;
    setTodos(newTodos);
  };

  const handleDelete = (index: number) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const handleDeleteSubTodo = (todoIndex: number, subTodoIndex: number) => {
    const newTodos = [...todos];
    newTodos[todoIndex].subTodos = newTodos[todoIndex].subTodos.filter((_, i) => i !== subTodoIndex);
    setTodos(newTodos);
  };

  const handleCancelSubTodo = () => {
    setActiveSubTodoInput(null);
    setNewSubTodo('');
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-2">To-do List</h3>
      <ul className="list-none pl-0">
        {todos.map((todo, index) => (
          <div key={index}>
            <li
              className={`flex items-center space-x-2 group hover:bg-gray-100 ${
                todo.completed ? 'line-through' : ''
              }`}
            >
              <div className="flex items-center flex-grow">
                <Checkbox
                  checked={todo.completed}
                  onChange={(event) => handleToggle(event, index)}
                  className="mr-2"
                />
                <span>{todo.text}</span>
              </div>
              <div className="flex items-center space-x-2">
                <IconButton
                  onClick={() => handleDelete(index)}
                  size="small"
                  className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <DeleteIcon />
                </IconButton>
                {!activeSubTodoInput && (
                  <IconButton
                    onClick={() => setActiveSubTodoInput(index)}
                    size="small"
                    className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <AddIcon />
                  </IconButton>
                )}
              </div>
            </li>
            {activeSubTodoInput === index && (
              <div className="">
                <input
                  type="text"
                  value={newSubTodo}
                  onChange={(e) => setNewSubTodo(e.target.value)}
                  placeholder="Add a new sub todo"
                  className="border border-gray-300 rounded p-1 mt-2"
                />
                <IconButton
                  onClick={() => handleAddSubTodo(index)}
                  className="bg-blue-500 text-white px-4 py-1 rounded ml-2"
                >
                  <Cross1Icon />
                </IconButton>
                <IconButton
                  onClick={handleCancelSubTodo}
                  className="bg-red-500 text-white px-4 py-1 rounded ml-2"
                >
                  <CloseIcon />
                </IconButton>
              </div>
            )}
            {todo.subTodos.length > 0 && (
              <ul className="list-none pl-5">
                {todo.subTodos.map((subTodo, subIndex) => (
                  <li
                    key={subIndex}
                    className={`flex items-center space-x-2 group hover:bg-gray-100 ${
                      subTodo.completed ? 'line-through' : ''
                    }`}
                  >
                    <div className="flex items-center flex-grow">
                      <Checkbox
                        checked={subTodo.completed}
                        onChange={(event) => handleToggleSubTodo(event, index, subIndex)}
                        className="mr-2"
                      />
                      <span>{subTodo.text}</span>
                    </div>
                    <IconButton
                      onClick={() => handleDeleteSubTodo(index, subIndex)}
                      size="small"
                      className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </ul>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
        className="border border-gray-300 rounded p-1 mt-2"
      />
      <IconButton onClick={handleAddTodo} className="bg-blue-500 text-white px-4 py-1 rounded ml-2">
        <Cross1Icon />
      </IconButton>
    </div>
  );
}
export default TodoList;