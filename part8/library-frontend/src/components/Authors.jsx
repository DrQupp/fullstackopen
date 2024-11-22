import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_BORN } from '../queries'
import Select from 'react-select'
import { useState } from 'react'

const AuthorForm = ({ authors, setError }) => {
  const [born, setBorn] = useState('')
  const [name, setName] = useState(null)
  const [editBorn] = useMutation(EDIT_BORN, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join('\n')
      setError(messages)
    }
  })

  const selectOptions = authors.map((author) => {
    return { value: author.name, label: author.name }
  })

  const submit = async (event) => {
    event.preventDefault()
    editBorn({ variables: { name: name.value, setBornTo: parseInt(born) } })

    setBorn('')
    setName(null)
  }

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <Select value={name} onChange={setName} options={selectOptions} />
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }
  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <AuthorForm authors={authors} setError={props.setError} />
    </div>
  )
}

export default Authors
