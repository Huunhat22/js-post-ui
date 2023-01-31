// create function render pagination
export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId)
  if (!pagination || !ulPagination) return

  // calc totalPages
  const { _limit, _page, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)

  // save page and totalPages in ulPagination
  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  // check if enable/disable previous/next links
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')

  // check if enable/disable previous/next links
  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}

export function initPagination({ elementId, defaultParams, onChange }) {
  const ulPagination = document.getElementById(elementId)
  if (!ulPagination) return

  const preElement = ulPagination.firstElementChild?.firstElementChild
  const nextElement = ulPagination.lastElementChild?.lastElementChild

  if (preElement) {
    preElement.addEventListener('click', (e) => {
      e.preventDefault()
      //   console.log('previous Click')
      const page = Number.parseInt(ulPagination.dataset.page) || 1
      if (page > 2) onChange?.(page - 1)
    })
  }

  if (nextElement) {
    nextElement.addEventListener('click', (e) => {
      e.preventDefault()
      //   console.log('next Click')
      const page = Number.parseInt(ulPagination.dataset.page) || 1
      const totalPages = ulPagination.dataset.totalPages
      if (page < totalPages) onChange?.(page + 1)
    })
  }
}
