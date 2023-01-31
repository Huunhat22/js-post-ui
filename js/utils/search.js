import debounce from 'lodash.debounce'

// create function initSearch
// onChange là tham số (Hàm)
export function initSearch({ elementId, defaultParams, onChange }) {
  const searchInput = document.getElementById(elementId)
  if (!searchInput) return

  // set default values from query params

  if (defaultParams && defaultParams.get('title_like')) searchInput.value = defaultParams.get('title_like')

  // title_like
  const deboundceSearch = debounce((event) => onChange?.(event.target.value), 500)

  searchInput.addEventListener('input', deboundceSearch)
}
