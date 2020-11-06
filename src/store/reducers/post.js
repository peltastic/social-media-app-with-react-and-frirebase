const initialState = {
    likesData: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "LIKES": 
            return {
                ...state,
                [action.postId]: action.data
            }
        default:
            return state    
    }
}

export default reducer