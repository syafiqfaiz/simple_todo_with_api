import { useState, useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import FormModal from './components/FormModal'
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://bnbktrzydklxwwwifesv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuYmt0cnp5ZGtseHd3d2lmZXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MDE4NjcsImV4cCI6MjAwNzA3Nzg2N30.qnBDylGhgzDTKn4aTXrRC4v74kesqDxq5TUIY6iDKmE"
)

const defaultTodo = {
  text: '',
  points: '',
}

function App() {
  const [todos, setTodos] = useState([])
  const [todoEdit, setTodoEdit] = useState(defaultTodo)
  const [showModal, setShowModal] = useState(false)

  async function getTodos() {
    const { data } = await supabase
      .from("todos")
      .select();

    setTodos(data)
  }

  useEffect(() => {
    getTodos()
  }, [])

  const handleToggleCompleted = async (id) => {
    const completed = !todos.find((todo) => todo.id === id).completed
    
    const { data, error } = await supabase
      .from('todos')
      .update({ completed: completed })
      .eq('id', id)
      .select()

    const newTodos = todos.map((todo) => {
      if(todo.id === data[0].id){
        return data[0]
      }
      return todo
    })

    setTodos(newTodos)
  }

  const onSubmitForm = async (newTodo) => {
    if(newTodo.id){
      // update
      const { data, error } = await supabase
        .from('todos')
        .update({ ...newTodo })
        .eq('id', newTodo.id)
        .select()

      const newTodos = todos.map((todo) => {
        if(todo.id === data[0].id){
          return data[0]
        }
        return todo
      })

      setTodos(newTodos)
    }else{
      // create
      const { data, error } = await supabase
        .from('todos')
        .insert([{...newTodo}])
        .select()

      const newTodos = [...todos, data[0]]
      setTodos(newTodos)
    }
  }

  const onDelete = async (id) => {
    const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)

    getTodos()
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
                          <span className='mx-2 text-danger' onClick={()=> {onDelete(todo.id)}}>delete</span>
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
