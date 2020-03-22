import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { patchPost } from '../api/posts-api'

interface EditPostProps {
  match: {
    params: {
      postId: string
    }
  }
  auth: Auth
}

interface EditPostState {
  content: string
}

export class EditPost extends React.PureComponent<
  EditPostProps,
  EditPostState
> {
  state: EditPostState = {
    content: ''
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('State', this.state)
    this.setState({ content: event.target.value })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      const uploadInfo = await patchPost(this.props.auth.getIdToken(), this.props.match.params.postId , {
        content: this.state.content
      })

      alert('Post was updated!')
    } catch (e) {
      alert('Could not update post: ' + e.message)
    }
  }


  render() {
    return (
      <div>
        <h1>Update post content</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
          <label>Post Content</label>
            <input
              placeholder="Post content"
              value={this.state.content}
              onChange={this.handleTitleChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        <Button
          type="submit"
        >
          Update
        </Button>
      </div>
    )
  }
}
