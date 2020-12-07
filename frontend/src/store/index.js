import { createSlice, combineReducers, configureStore, createAsyncThunk  } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { getIndexPageData, getEventPageData } from './mutations';

const initialEventsState = {
  events: [],
  transfers: [],
  mostClaimed: {},
  upcoming: {},
  mostRecent: {},
  highestPoapPower: {},
  status: 'idle',
  error: null,
  eventStatus: 'idle',
  eventError: null,
  tokens: [],
}

export const fetchIndexData = createAsyncThunk('events/fetchIndexEvents', getIndexPageData)
export const fetchEventPageData = createAsyncThunk('events/fetchEventPageData', async ({eventId, first, skip}) => getEventPageData(eventId, first, skip))


const eventsSlice = createSlice({
  name: 'events',
  initialState: initialEventsState,
  reducers: {},
  extraReducers: {
    [fetchIndexData.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchIndexData.fulfilled]: (state, action) => {
      const { poapEvents, mostRecent, mostClaimed, upcoming, highestPoapPower } = action.payload
      state.events = poapEvents
      state.mostRecent = mostRecent
      state.mostClaimed = mostClaimed
      state.upcoming = upcoming
      state.highestPoapPower = highestPoapPower
      state.status = 'succeeded'
    },
    [fetchIndexData.rejected]: (state, action) => {
      state.eventError = action.error.message
      state.status = 'failed'
      console.warn(action.error)
    },
    [fetchEventPageData.pending]: (state, action) => {
      state.eventStatus = 'loading'
    },
    [fetchEventPageData.fulfilled]: (state, action) => {
      state.tokens = action.payload.tokens
      state.eventStatus = 'succeeded'
    },
    [fetchEventPageData.rejected]: (state, action) => {
      state.eventError = action.error.message
      state.eventStatus = 'failed'
      console.warn(action.error)
    }
  }
})

export const selectAllEvents = state => state.events.events
export const selectEventStatus = state => state.events.status
export const selectEventError = state => state.events.error

export const selectRecentEvents = state => state.events.events.filter(event => {
  // don't show future events
  if ((new Date(event.start_date.replace(/-/g, ' ')).getTime() > new Date().getTime() + (24 * 60 * 60 * 1000))) {
    return false
  }
  // don't show events without a claimed token
  if (event.tokenCount !== undefined && event.tokenCount === 0) {
    return false
  }
  return true
})

export const selectEventById = (state, eventId) => state.events.events.find(event => event.id + '' === eventId) || {}

// export const selectEventById = (state, eventId) => {
//   console.log("SELECTING EVENT BY ID", eventId, state.events.events)
//   const el =  state.events.events.find((event) => {
//     console.log('comparing', event.id + '', 'and', eventId, event.id + '' === eventId)
//     return event.id + '' === eventId
//   })
//   console.log("FOUND EVENT BY ID", eventId, el)
//   return el
// }

export const selectMostRecent = state => state.events.mostRecent
export const selectMostClaimed = state => state.events.mostClaimed
export const selectUpcoming = state => state.events.upcoming
export const selectHighestPoapPower = state => state.events.highestPoapPower
// const selectEventById = (state, eventId) => state.events.find(event => event.id === eventId)

// const transferSlice = createSlice({
//   name: 'transfers',
//   initialState: initialState,
//   reducers: {
//     setTransfers: {
//       reducer(state, action) {
//         state.transfers = action.payload
//       }
//     },
//   },
//   extraReducers: {
//     [fetchMainnetTransfers.pending]: (state, action) => {
//       state.status = 'loading'
//     },
//     [fetchMainnetTransfers.fulfilled]: (state, action) => {
//       state.status = 'succeeded'
//       state.transfers = action.payload
//     },
//     [fetchMainnetTransfers.rejected]: (state, action) => {
//       state.status = 'failed'
//       state.error = action.error.message
//     }
//   }
// })



const rootReducer = combineReducers({
  events: eventsSlice.reducer,
  // transfers: transferSlice.reducer
})

const persistConfig = {
  key: 'root',
  storage,
}

// const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: rootReducer
})

// export const persistor =  persistStore(store)

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept(rootReducer, () => {
    const newRootReducer = rootReducer
    store.replaceReducer(newRootReducer)
  })
}

// convert object to string and store in localStorage
// function saveToLocalStorage(state) {
//   try {
//     const serialisedState = JSON.stringify(state);
//     localStorage.setItem("persistantState", serialisedState);
//   } catch (e) {
//     console.warn(e);
//   }
// }

// // load string from localStarage and convert into an Object
// // invalid output must be undefined
// function loadFromLocalStorage() {
//   try {
//     const serialisedState = localStorage.getItem("persistantState");
//     if (serialisedState === null) return undefined;
//     return JSON.parse(serialisedState);
//   } catch (e) {
//     console.warn(e);
//     return undefined;
//   }
// }

// // create our store from our rootReducers and use loadFromLocalStorage
// // to overwrite any values that we already have saved
// const store = createStore(rootReducer, loadFromLocalStorage());

// // listen for store changes and use saveToLocalStorage to
// // save them to localStorage
// store.subscribe(() => saveToLocalStorage(store.getState()));


export default store