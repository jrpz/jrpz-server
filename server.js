var config    = require('./config'),
    Hapi      = require('hapi'),
    server    = new Hapi.Server(3000, { cors: true }),
    instagram = require('instagram')
                .createClient(config.instagram.keys.id, config.instagram.keys.secret),
    twitter   = require('twitter'),
    twit      = new twitter(config.twitter);

var nameDrop = function (request, reply) {
  reply('<a href="http://jrpz.github.io">jrpz</a>');
}

var getInstagramFeed = function (request, reply) {
  // Grab Instagram Feed
  instagram.users.media(config.instagram.user.id, { count: 15 }, 
    function (images, err, pagination) {
      return reply(images);
    });
};

var getTwitterFeed = function (request, reply) {
  twit.get('/statuses/user_timeline.json', { screen_name: 'jrpz' }, 
  function (tweets, res) {
    return reply(tweets);
  });
};

// Routes
server.route({ method: 'GET', path: '/', handler: nameDrop });
server.route({ method: 'GET', path: '/instagram', handler: getInstagramFeed });
server.route({ method: 'GET', path: '/twitter', handler: getTwitterFeed });

// Start Server
server.start(function () {
  console.log('Server runnint at: ', server.info.uri);
});