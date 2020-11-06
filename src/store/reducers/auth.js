const initialState = {
    errMessage: null
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case "ERROR":
            return {
                ...state,
                errMessage: action.error
            }
        default:
            return state    
    }
}

export default reducer