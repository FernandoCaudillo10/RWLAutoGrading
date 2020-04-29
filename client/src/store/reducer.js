
const intialState = {
    typeofUser: '',
    token: ''
}

const reducer = (state = intialState, action) =>{
    switch(action.type){
        case 'USER_LOGIN':
            return{
                ...state,
                token: action.token,
                typeofUser: action.typeofUser
            }
        case 'REGISTER_USER':
            return{
                ...state,
                typeofUser: action.typeofUser,
                token: action.token
            }
        default:
            return state; 

    }
   
}

export default reducer; 