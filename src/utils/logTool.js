/*
 * @Description: 控制台打印辅助函数
 * @Author: Odyssey
 * @Date: 2020-11-25 15:31:33
 */

const isProd = process.env.NODE_ENV === 'production'

function noop() {}
const tipBgColor = '#FFD021'
const wordColor = '#4B5AFE'

function prtGroup(args) {
  const params = Array.from(arguments)
  if (!params.length) return
  console.group(
    params[1] ? `%c ${params[1]}` : '%c vh-console-tool',
    `color: #fff; font-size: 13px; background:${tipBgColor};border-radius:2px;padding: 0 50px`
  )
  params.forEach((param, idx) => {
    if (typeof param === 'object' && param !== null) {
      const isArray = Array.isArray(param)
      const valType = isArray ? 'Array' : 'Object'
      console.group(
        `%c [${idx}]: (${valType})`,
        `color: #555; font-size: 12px;font-weight:bold`
      )
      Object.keys(param).forEach((key) => {
        const val = JSON.stringify(param[key])
        console.log(`%c ${key}: ${val}`, `color: ${wordColor};font-size: 12px`)
        // console.log(`${key}: `, val);
      })
      console.groupEnd()
    } else {
      // console.log(
      //   `%c [${idx}]: ${param}`,
      //   `color: ${wordColor};font-size: 12px`
      // );
      console.log(`[${idx}]: `, param)
    }
  })
  console.log('id:', Math.random(1))
  console.groupEnd()
}

export const $log = isProd ? noop : prtGroup
export const $logTable = isProd
  ? noop
  : function (args) {
    const param = JSON.parse(JSON.stringify(args))
    console.table(param)
  }
