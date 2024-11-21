import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    removeNotification() {
      return null
    }
  }
  
})

export default notificationSlice.reducer

export const setNotification = (content, timeout) => {
  return dispatch => {
    dispatch(showNotification(content))
    setTimeout(() => {
      dispatch(removeNotification())
    }, timeout * 1000)
  }
}

export const { showNotification, removeNotification } = notificationSlice.actions