import * as React from 'react'
import { Card, Image, Icon, Button } from 'semantic-ui-react'
import { Post } from '../types/Post'
import { deletePost } from '../api/posts-api'
import Auth from '../auth/Auth'
import { History } from 'history'

interface PostCardProps {
  auth: Auth
  post: Post
  history: History
}

interface PostCardState {}

export class UdagramPost extends React.PureComponent<
  PostCardProps,
  PostCardState
> {

  onPostDelete = async (postId: string) => {
    try {
      await deletePost(this.props.auth.getIdToken(), postId)
      this.setState({
        post: undefined
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onEditButtonClick = (postId: string) => {
    this.props.history.push(`/posts/${postId}/edit`)
  }
  
  render() {
    return (
      <Card fluid color="red">
        <Card.Content>
          <Card.Description>{this.props.post.datePosted}</Card.Description>
          {this.props.post.attachmentUrl && (
            <Image src={this.props.post.attachmentUrl} />
          )}
          <Card.Header>{this.props.post.content}</Card.Header>
          <Button
            icon
            color="red"
            onClick={() => this.onPostDelete(this.props.post.postId)}
            >
            <Icon name="delete" />
          </Button>
          <Button
            icon
            color="blue"
            onClick={() => this.onEditButtonClick(this.props.post.postId)}
            >
            <Icon name="pencil" />
          </Button>
        </Card.Content>
      </Card>
    )
  }
}
