const helper = require('./utils/helper')
const config = helper.loadConfig(['module', 'url', 'uname', 'pwd'], '--')
require('./modules/' + config.module)
