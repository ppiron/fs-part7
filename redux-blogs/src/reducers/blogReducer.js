import blogService from '../services/blogs'

const blogReducer = (state=[], action) => {
  switch(action.type) {
  case 'INIT':
    return action.data
  case 'NEW':
    return [...state, action.data]
  case 'LIKE':
    return state.map(blog => {
      if (blog.id !== action.data.id) {
        return blog
      }
      return(
        {
          ...blog,
          likes: blog.likes + 1
        }
      )
    })
  case 'DELETE':
    return state.filter(blog => blog.id !== action.data)
  default:
    return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(
      {
        type: 'INIT',
        data: blogs
      }
    )
    return blogs
  }
}

export const createNew = (newBlog, token) => {
  return async dispatch => {
    const createdBlog = await blogService.createBlog(newBlog, token)
    dispatch(
      {
        type: 'NEW',
        data: createdBlog
      }
    )
    return createdBlog
  }
}

export const deleteBlog = (id, token) => {
  return async dispatch => {
    try {
      await blogService.deleteBlog(id, token)
      dispatch({
        type: 'DELETE',
        data: id
      })
    }
    catch (error) {
      console.log(error)
    }
  }
}

export const likeBlog = blog => {
  return async dispatch => {
    const updatedBlog = await blogService.updateBlog(blog.id, {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    })
    dispatch(
      {
        type: 'LIKE',
        data: updatedBlog
      }
    )
  }
}

export default blogReducer