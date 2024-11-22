import { useQuery } from '@apollo/client'
import { ALL_BOOKS, FAVORITE_GENRE } from '../queries'
import { useEffect, useState } from 'react'

const Recommended = (props) => {
  const [books, setBooks] = useState(null)
  const bookQuery = useQuery(ALL_BOOKS, {
    variables: { genreFilter: props.favGenre},
    onCompleted: (data) => {
      console.log('bookQuery completed')
      setBooks(data.allBooks)
    },
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join('\n')
      props.setError(messages)
    }
  })

  useEffect(() => {
    bookQuery.refetch({ genreFilter: props.favGenre })
  }, [props.favGenre])

  useEffect(() => {
    if (bookQuery.data) {
      setBooks(bookQuery.data.allBooks)
      console.log('UPDATING RECOMMENDED BOOKS')
    }
  }, [bookQuery.data])

  if (!props.show || !props.favGenre) {
    return null
  }

  if (bookQuery.loading || !books) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>reccomendations</h2>
      <div>
        books in your favorite genre <b>{props.favGenre}</b>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended
