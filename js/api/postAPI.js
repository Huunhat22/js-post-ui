import axiosClient from './axiosClient'

const postApi = {
  // params là object chứa các param
  getAll(params) {
    const url = '/posts'
    return axiosClient.get(url, { params})
  },

  getById(id) {
    const url = `/posts/${id}`
    return axiosClient.get(url)
  },

  // data là object chứa các thuộc tính của một item
  add(data) {
    const url = '/posts'
    return axiosClient.post(url, data)
  },

  // data là object chứa nội dung cần update của item
  update(data) {
    const url = `/posts/${data.id}`
    return axiosClient.patch(url, data)
  },

  remove(id) {
    const url = `/posts/${id}`
    return axiosClient.delete(url)
  },
}

export default postApi
