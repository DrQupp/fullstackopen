import { useState, useEffect } from 'react'

import Numbers from './components/Numbers'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/persons'



const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterValue, setFilterValue] = useState('');

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
          });
      }
      else {
        personService.create({ name: newName, number: newNumber })
          .then(createdPerson => {
            setPersons(persons.concat(createdPerson));
            setNewName('');
            setNewNumber('');
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
            console.log('error');
          });
      }
    }

    const personsToShow = filterValue.length === 0 ? persons : persons.filter(person => person.name.toLowerCase().includes(filterValue.toLowerCase()))

    return (
      <div>
        <h2>Phonebook</h2>
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