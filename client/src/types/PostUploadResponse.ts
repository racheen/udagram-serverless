import { Post } from './Post'

export interface PostUploadResponse {
  newItem: Post
  uploadUrl: string
}
