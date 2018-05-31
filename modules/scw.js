const helper = require('../utils/helper')
const puppeteer = require('puppeteer')
const config = helper.loadConfig(['url', 'uname', 'pwd'], '--')
const exit_code = 'close browser'
start(config.url).then(res => {
  const page = res.page
  const browser = res.browser
  page.on('console', msg => {
    if (msg._text === exit_code) {
      browser.close()
    }
  })
  page
    .evaluate(
      function(params) {
        $('body > div.header.clear.container > ul > li.m-right > a').click()
        $('#znlogin').click()
        $('#loginform-account').val(params.username)
        $('#loginform-password').val(params.password)
        $('.submit').click()
      },
      { username: config.uname, password: config.pwd }
    )
    .then(() => {
      page.waitFor(10000).then(() => {
        page.tap('.sign-but').then(res => {
          $('.but').click()
          browser.close()
        })
      })
    })
})

async function start(url) {
  const browser = await puppeteer.launch({
    // 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
    // executablePath: exepath,
    //设置超时时间
    timeout: 50000,
    //如果是访问https页面 此属性会忽略https错误
    ignoreHTTPSErrors: true,
    // 打开开发者工具, 当此值为true时, headless总为false
    devtools: false,
    // 关闭headless模式, 会打开浏览器
    headless: true
  })
  const page = await browser.newPage()
  // 设置浏览器视窗
  page.setViewport({
    width: 1376,
    height: 768
  })
  await page.goto(url)
  return { browser, page }
}
