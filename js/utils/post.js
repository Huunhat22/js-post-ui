import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setMaxLengthTitle, setTextContent } from './common'

// to use fromNow function
dayjs.extend(relativeTime)

// create function liElement
export function createLiElement(post) {
  if (!post) return

  // nếu sợ bị lỗi trong quá trình tạo liElement thì sử dụng try catch
  // tìm và clone template
  // update title, description, author..
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode(true)
  if (!liElement) return

  // sử dụng hàm để hạn chế việc lặp lại
  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="author"]', post.author)
  setTextContent(liElement, '[data-id="description"]', setMaxLengthTitle(100, post.description))

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl

    // nếu mà không có thumbnail thì sẽ trickger sự kiện error để lấy thumbnail mặc định
    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=Placeholder Image'
    })
  }
  // dayjs
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)
  // console.log('fromNow', dayjs(post.updatedAt).fromNow())

  // xử lý sự kiện : khi click vào item Post thì sẽ chuyển sang trang post detail
  const postItem = liElement.firstElementChild
  if (postItem) {
    postItem.addEventListener('click', () => {
      window.location.assign(`/post-detail.html?id=${post.id}`)
    })
  }

  return liElement
}

// create function render post list
export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList) || postList.length === 0) return

  const ulElement = document.getElementById(elementId)
  if (!ulElement) return

  // bài 245 : clear current list
  ulElement.textContent = ''

  // duyệt data và tạo thẻ liElement
  postList.forEach((post) => {
    const liElement = createLiElement(post)
    ulElement.appendChild(liElement)
  })
}
