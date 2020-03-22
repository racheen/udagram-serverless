import * as React from 'react'
import { Post } from '../types/Post'
import { getPosts } from '../api/posts-api'
import { Card, Divider, Button, Icon } from 'semantic-ui-react'
import { UdagramPost } from './UdagramPost'
import { History } from 'history'
import Auth from '../auth/Auth'

interface PostsListProps {
  history: History
  match: {
    params: {
      todoId: string
    }
  }
  auth: Auth
}

interface PostsListState {
  posts: Post[]
}

export class PostsList extends React.PureComponent<
  PostsListProps,
  PostsListState
> {
  state: PostsListState = {
    posts: []
  }

  async componentDidMount() {
    try {
      const posts = await getPosts(this.props.auth.getIdToken())
      this.setState({
        posts
      })
    } catch (e) {
      alert(`Failed to fetch posts : ${e.message}`)
    }
  }

  handleCreateImage = () => {
    this.props.history.push(`/posts`)
  }
  
  render() {
    return (
      <div>
        <h1>Posts</h1>
        <Button
          primary
          size="huge"
          className="add-button"
          onClick={this.handleCreateImage}
        >
          Create new post
        </Button>
        
        <Divider clearing />

        <Card.Group>
          {this.state.posts.map(posts => {
            return <UdagramPost post={posts} auth={this.props.auth} history={this.props.history}/>
          })}
        </Card.Group>
      </div>
    )
  }
}
