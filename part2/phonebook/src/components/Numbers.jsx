const Person = ({ person }) => {
  return (
    <li>{person.name}: {person.number}</li>
  )
}

const Numbers = ({ persons }) => {
  return (
    <ul>
      {persons.map(person => <Person key={person.name} person={person} />)}
    </ul>
  );
}

export default Numbers