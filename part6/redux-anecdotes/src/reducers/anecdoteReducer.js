import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    vote(state, action) {
      const changedAnecdote = action.payload
      const id = changedAnecdote.id
      return state.map(anecdote =>
        anecdote.id === id ? changedAnecdote :anecdote
      )
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
})

export const { vote, setAnecdotes, appendAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteFor = anecdote => {
  return async dispatch => {
    const changedAnecdote = {...anecdote, votes: anecdote.votes + 1}
    const response = await anecdoteService.update(changedAnecdote)
    dispatch(vote(changedAnecdote))
  }
}
export default anecdoteSlice.reducer