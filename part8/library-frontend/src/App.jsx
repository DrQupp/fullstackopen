import { useEffect, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'
import { FAVORITE_GENRE } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [favoriteGenre, setFaroviteGenre] = useState(null)

  const [token, setToken] = useState(null)

  const client = useApolloClient()

  const favGenre = useQuery(FAVORITE_GENRE, {
    onCompleted: (data) => {
      console.log('favGenre completed')
      console.log(data)
      if (data.me) {
        console.log('set favorite genre to ' + data.me.favoriteGenre.name)
        setFaroviteGenre(data.me.favoriteGenre.name)
      }
    }
  })
  console.log('token' + token)
  useEffect(() => {
    if (token) {
      favGenre.refetch()
    }
    console.log('in refecth useEffect. token is : ' + token)
  },[token])

  useEffect(() => {
    console.log('in favGenre useEffet')
    if (favGenre.data && favGenre.data.me) {
      console.log('setting favoriteGenre')
      setFaroviteGenre(favGenre.data.me.favoriteGenre.name)
    }
  }, [favGenre])

  console.log('favoriteGenre is : ' + favoriteGenre)
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <span>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommended')}>recommended</button>
            <button onClick={logout}>logout</button>
          </span>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>
      <Notify errorMessage={errorMessage} />
      <Authors show={page === 'authors'} setError={notify} />

      <Books show={page === 'books'} />
      <Recommended show={page === 'recommended' && token} setError={notify} favGenre={favoriteGenre}/>

      <NewBook show={page === 'add'} setError={notify} />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setError={notify}
      />
    </div>
  )
}

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return <div style={{ color: 'red' }}>{errorMessage}</div>
}

export default App
