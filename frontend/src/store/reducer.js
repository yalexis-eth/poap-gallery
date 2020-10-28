import { createSlice, combineReducers } from '@reduxjs/toolkit';


const eventsSlice = createSlice({
  name: 'events',
  initialState: {},
  reducers: {
    setEvents: state => state,
    setMainnetStats: state => state,
    setxDaiStats: state => state,
  }
})

const rootReducer = combineReducers({
  events: eventsSlice.reducer
})

export default rootReducer
