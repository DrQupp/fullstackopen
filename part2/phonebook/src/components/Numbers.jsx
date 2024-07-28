const Person = ({ person, deleteButton }) => {
  return (
    <li>
      {person.name}: {person.number}
      <button onClick={deleteButton}>delete</button>
    </li>
  )
}

const Numbers = ({ persons, deleteButton }) => {
  return (
    <ul>
      {persons.map(person =>
        <Person
          key={person.id}
          person={person}
          deleteButton={() => deleteButton(person)}
        />
      )}

    </ul>
  );
}

export default Numbers