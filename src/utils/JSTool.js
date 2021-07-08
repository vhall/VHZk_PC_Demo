/**
 * 删除所有匹配的存储
 * @param matchStr 要模糊匹配的字符串
 */
export function removeAllLocalKey(matchStr) {
  for (let key in localStorage) {
    // 判断，清除多余变量
    if (key.indexOf(matchStr) != -1) {
      localStorage.removeItem(key)
    }
  }
}
/**
 * 删除所有匹配的存储
 * @param matchStr 要模糊匹配的字符串
 */
export function removeAllSessionKey(matchStr) {
  for (let key in sessionStorage) {
    // 判断，清除多余变量
    if (key.indexOf(matchStr) != -1) {
      sessionStorage.removeItem(key)
    }
  }
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * 将page与page_size转化为偏移量pos
 * @param page 当前页
 * @param size 每页数量
 * @returns pos number
 */
export function convertPos (page, size) {
  return (page - 1) * size
}
