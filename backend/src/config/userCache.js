const NodeCache = require("node-cache");
// Kullanıcı bilgilerini almak için sürekli database'e gitmeden cache kaydererek almak daha mantıklı
const userCache = new NodeCache({ stdTTL: 0 });

module.exports.userCache=userCache;