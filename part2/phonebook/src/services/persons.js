import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
  return (
    axios.get(baseUrl)
  .then(response => response.data)
  );
}

const create = person => {
  return (
    axios.post(baseUrl, person)
    .then(response => response.data)
  );
}

const deletePerson = personId => { 
  const personUrl = `${baseUrl}/${personId}`;
  return (
    axios.delete(personUrl)
  .then(response => response.data)
  );
}

const update = person => {
  const personUrl = `${baseUrl}/${person.id}`;
  return (
    axios.put(personUrl, person)
    .then(resp => resp.data)
  );
}

export default {getAll, create, deletePerson, update};