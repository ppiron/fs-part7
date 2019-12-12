const notificationReducer = (state='', action) => {
  switch (action.type) {
  case 'NOTIFICATION':
    return action.data
  case 'RESET':
    return ''
  default:
    return state
  }
}

export const setNotification = notification => {
  return dispatch => {
    dispatch(
      {
        type: 'NOTIFICATION',
        data: notification
      }
    )
    setTimeout(() => {
      dispatch(
        {
          type: 'RESET'
        }
      )
    }, 3000)}
}

export default notificationReducer