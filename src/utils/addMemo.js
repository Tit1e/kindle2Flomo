import axios from 'axios'

export default function addMemo(url, content) {
  const data = {
    content
  }
  return axios.post(url, data)
}