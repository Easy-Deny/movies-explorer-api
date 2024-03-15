const helmet = require('helmet');

const helmetModule = helmet({
  contentSecurityPolicy: false,
  xDownloadOptions: false,
});

module.exports = helmetModule;
