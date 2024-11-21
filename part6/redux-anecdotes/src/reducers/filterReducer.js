import { createSlice } from "@reduxjs/toolkit"

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    filterChange(state, action) {
      const filter = action.payload
      return filter
    }
  }
})

export default filterSlice.reducer
export const { filterChange } = filterSlice.actions