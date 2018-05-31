const helper = require('./utils/helper')
const config = helper.loadConfig(['module'], '--')
require('./modules/' + config.module)
