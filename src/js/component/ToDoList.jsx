import React, { useState, useEffect } from 'react';

const makeRandomId = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const ToDoList = () => {
  const [listItem, setListItem] = useState([]);

  async function crearUsuario() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([])
    };
    try {
      await fetch("https://playground.4geeks.com/apis/fake/todos/user/abielsaf", requestOptions);
    } catch (error) {
      console.error("Couldn't create the user: ", error);
    }
  }

  const enter = (e) => {
    if (e.key === 'Enter') {
      const value = e.target.value.trim();
      if (value === "") {
        alert("The input can't be empty");
      } else {
        const newTask = { "id": makeRandomId(8), "label": value, "done": false };
        setListItem([...listItem, newTask]);
        e.target.value = "";
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://playground.4geeks.com/apis/fake/todos/user/abielsaf");
        if (!response.ok && response.status === 404) {
          await crearUsuario();
        } else {
          const data = await response.json();
          setListItem(data);
        }
      } catch (error) {
        console.error("Error cargando tareas", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updateTasks = async () => {
      if (listItem.length !== 0) {
        const requestOptions = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(listItem)
        };
        try {
          await fetch("https://playground.4geeks.com/apis/fake/todos/user/abielsaf", requestOptions);
        } catch (error) {
          console.error("Error actualizando tareas: ", error);
        }
      }
    };
    updateTasks();
  }, [listItem]);

  const deleteItem = (deletedItem) => {
    const newList = listItem.filter((el) => el.id !== deletedItem.id);
    setListItem(newList);
  };

  const deleteAllItems = async () => {
    try {
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      };
      await fetch("https://playground.4geeks.com/apis/fake/todos/user/abielsaf", requestOptions);
      setListItem([]);
      alert('This is going to delete the tasks and your user!');
    } catch (error) {
      console.error("Error deleting everything: ", error);
    }
  };

  const list = listItem.map((el, index) => (
    <div id="item" className='listado' key={index}>
      <li>
        <p>{el.label}</p>
        <button className='delete-button' onClick={() => deleteItem(el)}>Delete</button>
      </li>
    </div>
  ));

  return (
    <div className='text-center'>
      <h1> To do list!</h1>
      <div className='d-flex justify-content-end me-5'>
        <button type="button" onClick={deleteAllItems} className="delete-button">Self destruct</button>
      </div>

      <input className="mt-4" type="text" onKeyDown={enter} placeholder='Add task' />

      <ul>
        {list}
      </ul>
      <hr />
      <p>{listItem.length === 0 ? "No tasks left, good job!" : listItem.length + [" Tasks left"]}</p>

    </div>
  );
};


export default ToDoList;

