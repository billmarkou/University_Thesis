export function storageSave(name, object) {
  if (!process.browser) throw "Local storage is only available in a browser"
  const item = JSON.stringify(object)
  window.localStorage.setItem(name, item)
  return true
}

export function storageLoad(name) {
  if (!process.browser) throw "Local storage is only available in a browser"
  const item = window.localStorage.getItem(name)
  if (item) {
    return JSON.parse(item)
  } else {
    return null
  }
}