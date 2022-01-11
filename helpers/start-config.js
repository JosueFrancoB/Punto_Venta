const path = require('path');
const fs = require('fs');
let config = {};

const startConfig = async () => {

    let urlConfig = path.join(__dirname, '../config/config.json');
    if (fs.existsSync(urlConfig)) {
        config =   await fs.readFileSync(urlConfig, 'utf-8');
        config = JSON.parse(config);
    }

    if (!config.app) {
        config.app = {
            port: 5000
        }
    }
    global.app = config.app;
    return global

}

module.exports = startConfig;
