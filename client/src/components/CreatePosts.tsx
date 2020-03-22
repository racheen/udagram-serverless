import * as React from 'react'
import { Form, Button, Card } from 'semantic-ui-react'
import { createPost, uploadFile } from '../api/posts-api'
import Auth from '../auth/Auth'

enum UploadState {
  NoUpload,
  UploadingData,
  UploadingFile,
}

interface CreatePostProps {
  match: {
    params: {
      postId: string
    }
  }
  auth: Auth
}

interface CreatePostState {
  content: string
  file: any
  url: string
  uploadState: UploadState
}

export class CreatePost extends React.PureComponent<
  CreatePostProps,
  CreatePostState
> {
  state: CreatePostState = {
    content: '',
    file: undefined,
    url: '',
    uploadState: UploadState.NoUpload,
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('State', this.state)
    this.setState({ content: event.target.value })
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    console.log('File change', files)
    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    
    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.UploadingData)
      const uploadInfo = await createPost(this.props.auth.getIdToken(), {
        content: this.state.content
      })

      console.log('Created post', uploadInfo)
      this.setState({
        url: uploadInfo.uploadUrl
      })
      console.log('Signed URL', uploadInfo.uploadUrl)
      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadInfo.uploadUrl, this.state.file)

      alert('Post was uploaded!')
    } catch (e) {
      alert('Could not upload a post: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Post Content</label>
            <input
              placeholder="Post content"
              value={this.state.content}
              onChange={this.handleTitleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Upload Image</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Post to upload"
              onChange={this.handleFileChange}
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
        {this.state.uploadState === UploadState.UploadingData && <p>Uploading post metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}


