import { useEffect, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckCircleIcon } from "lucide-react";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");
  const [editId, setEditId] = useState();
  const [editTodoText, setEditTodoText] = useState("");
  const [selectOrder, setSelectOrder] = useState("all")

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
    setTodos(savedTodos);
  }, []);
  console.log(todos);

  const deleteNotification = () =>
    toast.warn("Todo o'chirildi", {
      position: "bottom-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });

  const addNotification = () =>
    toast.success("Todo qo'shildi", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });

  function handleEdit(todoId) {
    setEditId(todoId);
  }

  function handleSubmit(event) {
    event.preventDefault();
    // console.log(todos, editId)
    const updatedTodos = [
      ...todos,
      { id: Date.now(), text: todoText, isDone: false },
    ];
    addNotification();
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setTodoText("");
  }

  function handleDelete(todoId) {
    const filteredTodos = todos.filter((todo) => todo.id !== todoId);
    setTodos(filteredTodos);
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
    deleteNotification();
  }

  function editTodo(id, text) {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          text,
        };
      } else {
        return todo;
      }
    });
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos))
    setEditId();
    setEditTodoText("");
  }

  function handleIsDone(id) {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          isDone: !todo.isDone,
        };
      }
      return todo;
    });

    setTodos(updatedTodos)
    localStorage.setItem("todos", JSON.stringify(updatedTodos))
    // console.log(todos, "isD")
  }

  function handleSelect(event){
    setSelectOrder(event.target.value)
  }

  return (
    <div className="bg-slate-400 rounded-lg py-2 px-4 grid grid-cols-1 place-items-center">
      <h2 className="text-yellow-600 text-6xl">Todo List</h2>
      <div className="flex">
        <form className=" py-2 px-4 flex gap-2 text-sm" onSubmit={handleSubmit}>
          <input
            className="bg-zinc-300 py-2 px-4 rounded-lg text-slate-900"
            type="search"
            value={todoText}
            onChange={(event) => setTodoText(event.target.value)}
          />
          <button type="submit" disabled={todoText === ""}>
            Add
          </button>
        </form>
        <select name="isDone" className="bg-zinc-500 rounded-lg" onChange={(event) => handleSelect(event)}>
          <option value="all" selected="selected">Hammasi</option>
          <option value="done">Bajarilgan</option>
          <option value="not done">Bajarilmagan</option>
        </select>
      </div>
      <ul>
        {todos.filter((todo) => {
          if(selectOrder === "done") return todo.isDone === true;
          if(selectOrder === "not done") return todo.isDone === false;
          return true;
        })
        .map((todo) =>
          todo.id === editId ? (
            <div key={todo.id}>
              <input
                type="text"
                className="py-2 px-4 rounded-lg"
                value={editTodoText}
                onChange={(event) => setEditTodoText(event.target.value)}
              />
              <button onClick={() => editTodo(editId, editTodoText)}>Ok</button>
              <button onClick={() => setEditId()}>Cancel</button>
            </div>
          ) : (
            <li
              key={todo.id}
              className="grid grid-cols-2 gap-2 place-items-center p-2"
            >
              <strong className={`py-2 px-4 ${todo.isDone && "line-through"}`}>{todo.text}</strong>
              <div className="grid grid-cols-3 justify-items-center gap-1">
                <button className="bg-neutral-900 hover:bg-teal-600" onClick={() => handleIsDone(todo.id)}>
                  <CheckCircleIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    handleEdit(todo.id);
                    setEditTodoText(todo.text);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
              </div>
            </li>
          )
        )}
      </ul>
      <ToastContainer />
    </div>
  );
}

export default Todo;
