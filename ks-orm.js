/*var sequelize = new Sequelize('ks', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});*/
var Sequelize = require('sequelize');

var sequelize = new Sequelize('mysql://root:root@localhost:3306/ks');

var Wiki = sequelize.import("./models/wikipedia");

function createWikiEntry(entry) {
    return Wiki.create(entry).then(function(wiki) {
        return wiki;
    }).catch(function(error) {
        console.log("Error inserting record in database" + error);
    });
}

function getWikiEntry(subject) {
    return Wiki.findAll({
      where: {
        subject: subject
      }
    }).then(function(wiki) {
        if (wiki != undefined) {
            return wiki[0].dataValues.content.toString('utf-8') ;

        }
    });
}

module.exports = {
    createWikiEntry,
    getWikiEntry    
}