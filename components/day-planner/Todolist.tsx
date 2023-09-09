import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Cross1Icon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type SubTodo = {
  text: string;
  completed: boolean;
  dueDate: Date | null;
  dueTime: Date | null;
};

export type Todo = {
  text: string;
  completed: boolean;
  subTodos: SubTodo[];
  dueDate: Date | null;
  dueTime: Date | null;
};

type TodoListProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};
const TodoList: React.FC<TodoListProps> = ({ todos, setTodos }) => {
  const [newTodo, setNewTodo] = useState('');
  const [newSubTodo, setNewSubTodo] = useState('');
  const [activeSubTodoInput, setActiveSubTodoInput] = useState<number | null>(null);
  const [newTodoDueDate, setNewTodoDueDate] = useState<Date | null>(null);
  const [newTodoDueTime, setNewTodoDueTime] = useState<Date | null>(null);
  const [newSubTodoDueDate, setNewSubTodoDueDate] = useState<Date | null>(null);
  const [newSubTodoDueTime, setNewSubTodoDueTime] = useState<Date | null>(null);
  const [showTodoDatePicker, setShowTodoDatePicker] = useState(false);
  const [showSubTodoDatePicker, setShowSubTodoDatePicker] = useState(false);

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const todoToAdd = {
        text: newTodo,
        completed: false,
        subTodos: [],
        dueDate: newTodoDueDate,
        dueTime: newTodoDueTime,
      };
  
      if (showTodoDatePicker) {
        setTodos((prevTodos) => [...prevTodos, todoToAdd]);
        setShowTodoDatePicker(false);
      } else {
        setTodos((prevTodos) => [...prevTodos, todoToAdd]);
        setNewTodo('');
        setNewTodoDueDate(null);
        setNewTodoDueTime(null);
      }
    }
  };

  const handleAddSubTodo = (index: number) => {
    if (newSubTodo.trim()) {
      const newTodos = [...todos];
      const subTodoToAdd = {
        text: newSubTodo,
        completed: false,
        dueDate: newSubTodoDueDate,
        dueTime: newSubTodoDueTime,
      };

      if (showSubTodoDatePicker) {
        newTodos[index].subTodos.push(subTodoToAdd);
        setTodos(newTodos);
        setShowSubTodoDatePicker(false);
      } else {
        newTodos[index].subTodos.push(subTodoToAdd);
        setTodos(newTodos);
        setNewSubTodo('');
        setActiveSubTodoInput(null);
        setNewSubTodoDueDate(null);
        setNewSubTodoDueTime(null);
      }
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
    setNewSubTodoDueDate(null);
    setNewSubTodoDueTime(null);
    setShowSubTodoDatePicker(false);
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
                <div className="flex items-center space-x-2">
                  {showTodoDatePicker && (
                    <div className="flex items-center space-x-2">
                      <DatePicker
                        selected={todo.dueDate}
                        onChange={(date) => setTodos([...todos.slice(0, index), { ...todo, dueDate: date }, ...todos.slice(index + 1)])}
                        dateFormat="MM/dd/yyyy"
                        placeholderText="Select due date"
                        className="border border-gray-300 rounded p-1"
                      />
                      <DatePicker
                        selected={todo.dueTime}
                        onChange={(time) => setTodos([...todos.slice(0, index), { ...todo, dueTime: time }, ...todos.slice(index + 1)])}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        placeholderText="Select due time"
                        className="border border-gray-300 rounded p-1"
                      />
                    </div>
                  )}
                  {activeSubTodoInput === index && (
                    <div className="flex items-center space-x-2">
                      {showSubTodoDatePicker && (
                        <div className="flex items-center space-x-2">
                          <DatePicker
                            selected={newSubTodoDueDate}
                            onChange={(date) => setNewSubTodoDueDate(date)}
                            dateFormat="MM/dd/yyyy"
                            placeholderText="Select due date"
                            className="border border-gray-300 rounded p-1"
                          />
                          <DatePicker
                            selected={newSubTodoDueTime}
                            onChange={(time) => setNewSubTodoDueTime(time)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            placeholderText="Select due time"
                            className="border border-gray-300 rounded p-1"
                          />
                        </div>
                      )}
                      <IconButton
                        onClick={() => {
                          handleAddSubTodo(index);
                          setShowSubTodoDatePicker(false);
                        }}
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
                  {!showTodoDatePicker && !showSubTodoDatePicker && (
                    <IconButton
                      onClick={() => {
                        setActiveSubTodoInput(index);
                        setShowTodoDatePicker(true);
                        setShowSubTodoDatePicker(false);
                      }}
                      size="small"
                      className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                      <AddIcon />
                    </IconButton>
                  )}
                </div>
              </div>
            </li>
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
                    <div className="flex items-center space-x-2">
                      {showSubTodoDatePicker && (
                        <div className="flex items-center space-x-2">
                          <DatePicker
                            selected={subTodo.dueDate}
                            onChange={(date) =>
                              setTodos([
                                ...todos.slice(0, index),
                                {
                                  ...todo,
                                  subTodos: [
                                    ...todo.subTodos.slice(0, subIndex),
                                    { ...subTodo, dueDate: date },
                                    ...todo.subTodos.slice(subIndex + 1),
                                  ],
                                },
                                ...todos.slice(index + 1),
                              ])
                            }
                            dateFormat="MM/dd/yyyy"
                            placeholderText="Select due date"
                            className="border border-gray-300 rounded p-1"
                          />
                          <DatePicker
                            selected={subTodo.dueTime}
                            onChange={(time) =>
                              setTodos([
                                ...todos.slice(0, index),
                                {
                                  ...todo,
                                  subTodos: [
                                    ...todo.subTodos.slice(0, subIndex),
                                    { ...subTodo, dueTime: time },
                                    ...todo.subTodos.slice(subIndex + 1),
                                  ],
                                },
                                ...todos.slice(index + 1),
                              ])
                            }
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            placeholderText="Select due time"
                            className="border border-gray-300 rounded p-1"
                          />
                        </div>
                      )}
                      {!showSubTodoDatePicker && (
                        <IconButton
                          onClick={() => {
                            setShowSubTodoDatePicker(true);
                            setShowTodoDatePicker(false);
                          }}
                          size="small"
                          className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        >
                          <AddIcon />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={() => handleDeleteSubTodo(index, subIndex)}
                        size="small"
                        className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
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
      <div className="flex items-center space-x-2">
        {showTodoDatePicker && (
          <div className="flex items-center space-x-2">
            <DatePicker
              selected={newTodoDueDate}
              onChange={(date) => {
                setNewTodoDueDate(date);
                setShowTodoDatePicker(false);
              }}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select due date"
              className="border border-gray-300 rounded p-1"
            />
            <DatePicker
              selected={newTodoDueTime}
              onChange={(time) => {
                setNewTodoDueTime(time);
                setShowTodoDatePicker(false);
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              placeholderText="Select due time"
              className="border border-gray-300 rounded p-1"
            />
          </div>
        )}
        {!showTodoDatePicker && (
          <IconButton
            onClick={() => {
              setShowTodoDatePicker(true);
              setShowSubTodoDatePicker(false);
            }}
            className="bg-blue-500 text-white px-4 py-1 rounded ml-2"
          >
            <Cross1Icon />
          </IconButton>
        )}
        {showSubTodoDatePicker && (
          <div className="flex items-center space-x-2">
            <DatePicker
              selected={newSubTodoDueDate}
              onChange={(date) => {
                setNewSubTodoDueDate(date);
                setShowSubTodoDatePicker(false);
              }}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select due date"
              className="border border-gray-300 rounded p-1"
            />
            <DatePicker
              selected={newSubTodoDueTime}
              onChange={(time) => {
                setNewSubTodoDueTime(time);
                setShowSubTodoDatePicker(false);
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              placeholderText="Select due time"
              className="border border-gray-300 rounded p-1"
            />
          </div>
        )}
      </div>
    </div>
  );
  
        }
        export default TodoList  