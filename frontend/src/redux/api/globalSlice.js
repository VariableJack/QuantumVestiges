import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  franchises: [],
}

const globalSlice = createSlice({
    name: 'globalReducer',
    reducerPath: 'globalReducer',
    initialState,
    reducers: {
        setFranchises: (state, action: PayloadAction<[{franchise_name: string, franchise_id: number}]>) => {
            state.franchises = [...action.payload];
      },
    }
})

const {
    setFranchises
} = globalSlice.actions
export {
    setFranchises
}
export default globalSlice