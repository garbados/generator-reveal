var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/<%= _.slugify(presentationTitle) %>',
    rewrites: [{
      from: '',
      to: 'index.html',
      method: 'GET',
      query: {}
    },{
      from: '/*',
      to: '/*'
    }],
    views: {},
    lists: {},
    shows: {}
};

couchapp.loadAttachments(ddoc, path.join(__dirname, '_attachments'));

module.exports = ddoc;