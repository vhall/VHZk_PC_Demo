module.exports = {
  tabWidth: 2, // 缩进字节数
  semi: false, // 句尾添加分号
  singleQuote: true, // 使用单引号代替双引号
  trailingComma: 'none' // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号） all/none/es5
  // printWidth: 120, // 超过最大值换行  不能开启!!!与eslint的配置冲突
  // useTabs: false, // 缩进不使用tab，使用空格
  // proseWrap: "preserve", // 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
  // arrowParens: "avoid", //  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
  // bracketSpacing: true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
  // disableLanguages: ["vue"], // 不格式化vue文件，vue文件的格式化单独设置
  // endOfLine: "auto", // 结尾是 \n \r \n\r auto
  // eslintIntegration: false, //不让prettier使用eslint的代码格式进行校验
  // htmlWhitespaceSensitivity: "ignore", //<css|strict|ignore>
  // ignorePath: ".prettierignore", // 不使用prettier格式化的文件填写在项目的.prettierignore文件中
  // jsxBracketSameLine: false, // 在jsx中把'>' 单独放一行
  // jsxSingleQuote: false, // 在jsx中使用单引号代替双引号
  // parser: "babylon", // 格式化的解析器，默认是babylon
  // requireConfig: false, // Require a 'prettierconfig' to format prettier
  // stylelintIntegration: false, //不让prettier使用stylelint的代码格式进行校验
  // tslintIntegration: false, // 不让prettier使用tslint的代码格式进行校验
  // vueIndentScriptAndStyle: false // 是否在vue 文件中的script和css缩进
}

// 参考链接：
// https://prettier.io/docs/en/options.html
