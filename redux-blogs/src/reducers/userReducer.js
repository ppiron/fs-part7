import loginService from '../services/login'

const userReducer = (state = null, action) => {
  switch (action.type) {
  case 'SETUSER':
    return action.data
  default:
    return state
  }
}

export const signInUser = userData => {
  return async dispatch => {
    const user = await loginService.login(userData)
    if (user) {
      localStorage.setItem('loggedUser', JSON.stringify(user))
      dispatch(
        {
          type: 'SETUSER',
          data: user
        }
      )
      return user
    }
  }

}

export const setUser = user => {
  if (user === null) {
    return(
      {
        type: 'SETUSER',
        data: null
      }
    )}
  return (
    {
      type: 'SETUSER',
      data: user
    }
  )
}



export default userReducer