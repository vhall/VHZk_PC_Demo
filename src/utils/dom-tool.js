export function isTargetEle (event, classStr) {
  const e = event || window.event
  let targetEle = e.target
  let b = true
  let result = false
  try {
    while (b) {
      if (targetEle) {
        let targetClass = targetEle.getAttribute('class') || ''
        if (targetEle.nodeName.toLowerCase() === 'body') {
          b = false
          result = false
          targetEle = null
        } else {
          if (targetClass.indexOf(classStr) === -1) {
            targetEle = targetEle.parentNode
          } else {
            b = false
            result = true
          }
        }
      } else {
        b = false
        result = false
      }
    }
  } catch (e) {
    return false
  }
  return result
}

export function downloadIamge (url, name) {
  let image = new Image()
  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous')
  image.onload = function () {
    let canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    let context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    let ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase()
    ext = ext.split('?')[0]
    let imgData = canvas.toDataURL('image/' + ext)
    let a = document.createElement('a')
    let event = new MouseEvent('click')
    a.download = (name || '下载图片名称') + '.png'
    a.href = imgData
    a.dispatchEvent(event)
  }
  image.src = url
}

export function isEleInViewport (el) {
  let parentEle = el.parentNode.parentNode
  let prect = parentEle.getBoundingClientRect()
  let rect = el.getBoundingClientRect()
  let eleLeft = rect.left + rect.width
  let peleLeft = prect.left + prect.width
  if (eleLeft > peleLeft) {
    return eleLeft - peleLeft
  }
  if (rect.left < prect.left) {
    return rect.left - prect.left
  }
  return 0
}
