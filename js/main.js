import axiosClient from '../api/axiosClient'
import postApi from '../api/postAPI'

console.log('hello world')

async function main() {
  //   const response = await axiosClient.get('/posts')
  const queryParmas = {
    _page: 1,
    _limit: 5,
  }

  try {
    const data = await postApi.getAll(queryParmas, ``)
    console.log(data)
  } catch (error) {
    console.log('getAll failed', error)
  }
}

main()
