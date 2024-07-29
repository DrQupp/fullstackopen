import { useState, useEffect } from 'react'

import Numbers from './components/Numbers'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/persons'
import Notification from './components/Notification'



const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [notifMessage, setNotifMessage] = useState({message: null, className: null});

  const hook = () => {
    personService.getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      });
  };
  useEffect(hook, []);


  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const showNotif = (message, className) => {
    console.log(`In showNotif ${message}, ${className}`);
    setNotifMessage({message: message, className: className});
    setTimeout(() => setNotifMessage({message: null, className: null}), 5000);
  }

  const addPhone = (event) => {
    event.preventDefault();
    if (newName.length === 0 || newNumber.length === 0) {
      alert('Information missing');
    }
    else {
      const p = persons.find(person => person.name === newName);
      if (p && confirm(`${newName} is already added to phonebook. Do you want to update the number?`)) {
        const updatedPerson = { ...p, number: newNumber };
        personService.update(updatedPerson)
          .then(() => {
            setPersons(persons.map(p => p.id === updatedPerson.id ? updatedPerson : p));
            setNewName('');
            setNewNumber('');
            showNotif(`Updating info for ${newName}`, 'notif');
          });
      }
      else {
        personService.create({ name: newName, number: newNumber })
          .then(createdPerson => {
            setPersons(persons.concat(createdPerson));
            setNewName('');
            setNewNumber('');
            showNotif(`Adding ${newName} to phonebook`, 'notif');
          });
      }
    }
  };

    const handleDelete = (person) => {
      if (confirm(`Are you sure you want to delete ${person.name}?`)) {
        personService
          .deletePerson(person.id)
          .then(() => {
            setPersons(persons.filter(p => p.id !== person.id))
          })
          .catch(error => {
            showNotif(`Info on ${person.name} is already deleted from the server`, 'error')
            setPersons(persons.filter(p => p.id !== person.id))
          });
      }
    }

    const personsToShow = filterValue.length === 0 ? persons : persons.filter(person => person.name.toLowerCase().includes(filterValue.toLowerCase()))

    return (
      <div>
        <h2>Phonebook</h2>
        <Notification message={notifMessage.message} className={notifMessage.className} />
        <Filter filterValue={filterValue} handleFilterChange={handleFilterChange} />

        <h2>add a new</h2>
        <PersonForm
          addPhone={addPhone}
          newName={newName}
          newNumber={newNumber}
          handleNameChange={handleNameChange}
          handleNumberChange={handleNumberChange}
        />

        <h2>Numbers</h2>
        <Numbers persons={personsToShow} deleteButton={handleDelete} />
      </div>
    )
  }

  export default App