import { useDispatch, useSelector } from 'react-redux'
import { voteFor } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdote.filter(
    anecdote => anecdote.content.includes(state.filter)
  ))
  const dispatch = useDispatch()
  console.log(anecdotes)
  const vote = (anecdote) => {
    dispatch(voteFor(anecdote))

    dispatch(setNotification('Voted for an anecdote', 3))
  }

  return (
    <div>
      {[...anecdotes]
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
        )}
    </div>
  )
}

export default AnecdoteList