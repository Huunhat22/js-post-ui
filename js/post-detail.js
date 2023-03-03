import postApi from './api/postAPI'
import { setTextContent } from './utils'
import dayjs from 'dayjs'

// id="postHeroImage"
// id="postDetailTitle"
// id="postDetailAuthor"
// id="postDetailTimeSpan"
// id="postDetailDescription"

// create function render Post detail
function renderPostDetail(post) {
  // render title
  // render author
  // render description
  // render postDetail TimeSpan
  setTextContent(document, '#postDetailTitle', post.title)
  setTextContent(document, '#postDetailAuthor', post.author)
  setTextContent(document, '#postDetailDescription', post.description)
  setTextContent(document, '#postDetailTimeSpan', `- ${dayjs(post.updatedAt).format('DD/MM/YYYY HH:mm')}`)

  // render hero Image
  const heroImage = document.getElementById('postHeroImage')
  if (heroImage) {
    heroImage.style.background = `url(${post.imageUrl})`

    heroImage.addEventListener('error', () => {
      heroImage.style.background = url('https://via.placeholder.com/1368x400?text=Placeholder Image')
    })
  }

  // render edit page link
  const editPageLink = document.getElementById('goToEditPageLink')
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`
    editPageLink.textContent = 'Edit Post'
  }
}

;(async () => {
  // dựa vào id trên url để lấy được bài post
  // gọi api để lấy thông tin dữ liệu của bài post, thông qua id
  // render thông tin chi tiết của bài post

  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    if (!postId) {
      console.log('post not found')
      return
    }

    const post = await postApi.getById(postId)
    renderPostDetail(post)

    console.log(post)
  } catch (error) {
    console.log('failed to fetch post detail post', error)
  }
})()
