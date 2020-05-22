
const intialState = {
  UserType: '',
  token: '',
};

const reducer = (state = intialState, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...state,
        token: action.token,
        UserType: action.UserType,
      };
    case 'REGISTER_USER':
      return {
        ...state,
        UserType: action.UserType,
        token: action.token,
      };
    default:
      return state;
  }
};

export default reducer;
