import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import {loadSavedData, saveDataInStorage} from "../renderer.js";
import ExpensesList from "./ExpensesList";
const { ipcRenderer } = require("electron");
const { HANDLE_FETCH_DATA, HANDLE_SAVE_DATA } = require("../../utils/constants")

const Home = () => {
  const [val, setVal] = useState("");
  const [expenses, setExpenses] = useState([]);

  // Grab the user's saved expenses after the app loads
  // useEffect(() => {
  //   loadSavedData();
  // });

  // Listener functions that receive messages from main
  useEffect(() => {
    ipcRenderer.on(HANDLE_SAVE_DATA, handleNewExpense);
    // If we omit the next step, we will cause a memory leak and & exceed max listeners
    return () => {
      ipcRenderer.removeListener(HANDLE_SAVE_DATA, handleNewExpense);
    }
  });
  useEffect(() => {
    ipcRenderer.on(HANDLE_FETCH_DATA, handleReceiveData);
    return () => {
      ipcRenderer.removeListener(HANDLE_FETCH_DATA, handleReceiveData);
    }
  });

  // Receives all user expenses from main
  const handleReceiveData = (event, data) => {
    // console.log("renderer received data from main:", data.message);
    setExpenses([...data.message]);
  };

  // Receives a new expense from main
  const handleNewExpense = (event, data) => {
    // console.log("renderer received data from main:", data.message)
    setExpenses([...expenses, data.message])
  }

  // Manage state and input field
  const handleChange = (e) => {
    setVal(e.target.value)
  }

  // Send the input to main
  const addExpense = (input) => {
    saveDataInStorage(input)
    setVal("")
  }

  return (
    <div>
      <div>
        <Button onClick={loadSavedData}>Load Expenses</Button>
        {expenses.length ? (
          <ExpensesList expenses={expenses} />
        ) : (
          <p>Add an expense to get started</p>
        )}
      </div>
      <div>
        <input type="text" onChange={handleChange} value={val}/>
        <Button onClick={() => addExpense(val)}>Add a new expense</Button>
      </div>
    </div>
  )
}

export default Home
