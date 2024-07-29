import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Filter from './components/Filter'
import axios from 'axios'
import CountryInfo from './components/ContryInfo'


function App() {
  const [name, setName] = useState('')
  const [countries, setCountries] = useState(null)


  const handleFilterChange = (event) => {
    setName(event.target.value);
  };

  const hook = () => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response => setCountries(response.data))
    .catch(e => console.log(`Error ${error}`))
  };
  useEffect(hook, [])

  if (!countries) {
    return;
  }
  return (
    <>
      <Filter filterValue={name} handleFilterChange={handleFilterChange} />
      <CountryInfo filter={name} countries={countries}/>
    </>
  )
}

export default App
