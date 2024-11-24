import { useQuery, useSubscription } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES, BOOK_ADDED } from '../queries'
import { useEffect, useState } from 'react'
import { updateCache } from '../utilities'

const GenreSelector = ({ genres, bookQuery }) => {
  return (
    <div>
      {genres.map((genre) => (
        <button
          key={genre.name}
          onClick={() => {
            bookQuery.refetch({ genreFilter: genre.name })
          }}
        >
          {genre.name}
        </button>
      ))}
      <button onClick={() => bookQuery.refetch({ genreFilter: null })}>
        all genres
      </button>
    </div>
  )
}

const Books = (props) => {
  const [books, setBooks] = useState(null)
  const result = useQuery(ALL_GENRES)
  const bookQuery = useQuery(ALL_BOOKS, {
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join('\n')
      console.log(messages)
    }
  })

  useEffect(() => {
    if (bookQuery.data) {
      setBooks(bookQuery.data.allBooks)
    }
  }, [bookQuery.data])

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      props.notify(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
      console.log('in here')
    }
  })
  if (!props.show) {
    return null
  }

  if (bookQuery.loading || result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>books</h2>

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
      <GenreSelector genres={result.data.allGenres} bookQuery={bookQuery} />
    </div>
  )
}

export default Books
