import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import FormModal from './components/FormModal'

const initialTodos = [
  { id: 1, text: 'Learn VSCode', completed: true, points: 2, user: {id: 1, name: 'Abu'} },
  { id: 2, text: 'Learn Css', completed: true, points: 5, user: {id: 2, name: 'Ali'} },
  { id: 3, text: 'Learn HTML', completed: true, points: 7, user: {id: 1, name: 'Abu'} },
  { id: 4, text: 'Learn Bootstrap', completed: true, points: 2, user: {id: 2, name: 'Ali'} },
  { id: 5, text: 'Learn Git', completed: true, points: 10, user: {id: 1, name: 'Abu'} },
  { id: 6, text: 'Learn Databse', completed: true, points: 1, user: {id: 1, name: 'Abu'} },
  { id: 7, text: 'Learn Tailwind', completed: true, points: 3, user: {id: 2, name: 'Ali'} },
  { id: 8, text: 'Learn SQL', completed: true, points: 6, user: {id: 1, name: 'Abu'} },
]

const defaultTodo = {
  id: '',
  text: '',
  points: '',
  user: ''
}

function App() {
  const [todos, setTodos] = useState(initialTodos)
  const [todoEdit, setTodoEdit] = useState(defaultTodo)
  const [showModal, setShowModal] = useState(false)

  const handleToggleCompleted = (id) => {
    const newTodos = todos.map((todo) => {
      if(todo.id === id){
        return {...todo, completed: !todo.completed}
      }
      return todo
    })
    setTodos(newTodos)
  }

  const onSubmitForm = (newTodo) => {
    if(newTodo.id){
      const newTodos = todos.map((todo) => {
        if(todo.id === newTodo.id){
          return newTodo
        }
        return todo
      })
      setTodos(newTodos)
    }else{
      const newTodos = [...todos, {...newTodo, id: todos.length + 1}]
      setTodos(newTodos)
    }
  }

  const toggleEdit = (todo) => {
    setTodoEdit(todo)
    setShowModal(true)
  }

  const onCloseModal = () => {
    setTodoEdit(null)
    setShowModal(false)
  }

  return (
      <div className="row mt-5 justify-content-center">
        <div className="col-6 align-self-center">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Todo List</h1>
            </div>
            <div className="card-body">
              <ul className="list-group">
                {todos.map((todo) => (
                  <li key={todo.id} className="list-group-item">
                    <div className="row">
                      <div className="col-2">
                        <input type="checkbox" defaultChecked={todo.completed} onChange={() => handleToggleCompleted(todo.id)}/>
                      </div>
                      <div className="col-10">
                        <div>
                          {todo.text}
                          <span className="mx-2 badge bg-primary">{todo.points}</span>
                          <span className="badge bg-secondary">{todo?.user?.name}</span>
                          <span className='mx-2 text-primary' onClick={()=> {toggleEdit(todo)}}>edit</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
                <div className='btn btn-primary mt-2' onClick={()=> toggleEdit(defaultTodo)}>Add Todo</div>
              </ul>
            </div>
        </div>
      </div>
      <FormModal showModal={showModal} todo={todoEdit} onCloseModal={onCloseModal} onSubmitForm={onSubmitForm}/>
    </div>
  )
}

export default App
