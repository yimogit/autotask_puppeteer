const helper = require('../utils/helper')
const puppeteer = require('puppeteer')
const config = helper.loadConfig(['url', 'uname', 'pwd', 'headless'], '--')
const exit_code = 'close browser'
;(async () => {
  console.log('启动浏览器')
  var br = await start(config)
  await br.page.click('body > div.header.clear.container > ul > li.m-right > a')
  await br.page.waitFor(1000)
  await br.page.click('#znlogin')
  await br.page.waitFor(1000)

  console.log('输入用户名')
  await br.page.type('#loginform-account', config.uname, {
    delay: 100 // 控制 keypress 也就是每个字母输入的间隔
  })
  console.log('输入密码')
  await br.page.type('#loginform-password', config.pwd, {
    delay: 100 // 控制 keypress 也就是每个字母输入的间隔
  })
  try {
    console.log('登录')
    await br.page.click('.submit')
    console.log('签到')
    await br.page.waitFor(10000)
    await br.page.click('.sign-but')
    await br.page.waitFor(2000)
    await br.page.click('.but')
    console.log('签到完成')
    await br.close()
  } catch (e) {
    console.log('退出')
    await br.browser.close()
  }
})()

async function start(params) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    // 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
    // executablePath: exepath,
    //设置超时时间
    timeout: 50000,
    //如果是访问https页面 此属性会忽略https错误
    ignoreHTTPSErrors: true,
    // 打开开发者工具, 当此值为true时, headless总为false
    devtools: false,
    // 关闭headless模式, 会打开浏览器
    headless: !!params.headless
  })
  const page = await browser.newPage()
  // 设置浏览器视窗
  page.setViewport({
    width: 1376,
    height: 768
  })
  if (params.url) await page.goto(params.url)
  return { browser, page }
}
