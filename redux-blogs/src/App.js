import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { initializeBlogs, createNew, likeBlog, deleteBlog } from './reducers/blogReducer'
import { signInUser, setUser } from './reducers/userReducer'
import { setNotification } from './reducers/notificationReducer'
import Blog from './components/Blog'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import BlogForm from './components/BlogForm'
import './index.css'

function App(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isFormVisible, setFormVisible] = useState(false)
  const [visibleBlogs, setVisibleBlogs] = useState(null)

  const savedUser = localStorage.getItem('loggedUser')

  useEffect(() => {
    if (savedUser) {
      props.initializeBlogs()
        .then(
          (blogs) => {
            setVisibleBlogs(Object.fromEntries(Array.from(blogs, blog => [blog.id, false])))
            props.setUser(JSON.parse(savedUser))
          })
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    const userData = {
      username,
      password
    }
    const user = await props.signInUser(userData)
    if (user) {
      // console.log(user)
      props.blogs.length === 0 && props.initializeBlogs()
        .then(blogs => {
          setVisibleBlogs(Object.fromEntries(Array.from(blogs, blog => [blog.id, false])))
        })
    } else {
      setErrorMessage('Invalid username or password')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('loggedUser')
    props.setUser(null)
  }

  const toggleFormVisibility = () => {
    setFormVisible(!isFormVisible)
  }

  const createNewBlog = newBlog => {
    props.createNew(newBlog, props.user.token)
      .then(savedBlog => {
        // console.log(savedBlog)
        props.setNotification(`a new blog ${savedBlog.title} ${savedBlog.author ? 'by ' + savedBlog.author : ' '}  added`)
      })
  }

  const incrementLikes = blog => {
    props.likeBlog(blog)
  }

  const deleteBlog = blog => {
    props.deleteBlog(blog.id, props.user.token)
      .then(() => {
        props.setNotification(
          `the blog ${blog.title} has been deleted`
        )}
      )
      .catch(err => console.log(err))
  }

  const toggleBlogVisibility = id => {
    setVisibleBlogs({ ...visibleBlogs, [id]: !visibleBlogs[id] })
  }

  const openAllBlogs = () => {
    setVisibleBlogs(Object.fromEntries(Array.from(props.blogs, blog => [blog.id, true])))
  }

  const closeAllBlogs = () => {
    setVisibleBlogs(Object.fromEntries(Array.from(props.blogs, blog => [blog.id, false])))
  }

  if (props.user !== null && visibleBlogs !== null) {
    console.log('pippo')
    const sortedBlogs = props.blogs.sort((a, b) => b.likes - a.likes)
    return (
      <>
        <h2>Blogs</h2>
        <Notification message={props.notification} />
        <div><span>{props.user.name} logged in </span>
          <button onClick={handleLogout}>logout</button>
        </div>
        <br />
        <BlogForm isFormVisible={isFormVisible} toggleFormVisibility={toggleFormVisibility} createNewBlog={createNewBlog} />
        {sortedBlogs.map(blog => {
          return (
            <Blog key={blog.id}
              blog={blog}
              incrementLikes={incrementLikes}
              deleteBlog={deleteBlog}
              showRemove={blog.user.username === props.user.user}
              visible={visibleBlogs[blog.id]}
              toggleBlogVisibility={toggleBlogVisibility} />
          )
        })}
        {(function () {
          const openBlogs = Object.values(visibleBlogs).filter(isOpen => isOpen === true).length
          if (openBlogs === Object.values(visibleBlogs).length) {
            return <button onClick={closeAllBlogs}>Collapse all blogs</button>
          }
          if (openBlogs === 0) {
            return <button onClick={openAllBlogs}>Expand all blogs</button>
          }
          return (
            <>
              <button onClick={openAllBlogs}>Expand all blogs</button>
              <button onClick={closeAllBlogs}>Collapse all blogs</button>
            </>)
        })()}
      </>
    )
  } else if (props.user === null && !savedUser) {
    // console.log('pippa')
    return (
      <>
        <h1>log in to application</h1>
        <ErrorNotification errorMessage={errorMessage} />
        <form onSubmit={handleLogin}>
          <label htmlFor="username">username </label>
          <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <br />
          <label htmlFor="password">password </label>
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <br />
          <button type="submit">login</button>
        </form>
      </>
    )
  } else {
    console.log('crotalo')
    return null
  }
}

const mapStateToProps = state => {
  return {
    blogs: state.blogs,
    notification: state.notification,
    user: state.user
  }
}

const mapDispatchToProps = {
  initializeBlogs,
  createNew,
  deleteBlog,
  likeBlog,
  setUser,
  signInUser,
  setNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
