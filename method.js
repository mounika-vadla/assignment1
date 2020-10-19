const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const Promise = require('bluebird');
Promise.promisifyAll(MongoClient);
const DB_URL = "mongodb://localhost:27017/test"; //Use mlab.com to get started without setting up mongo.

/**
 * Method to count documents based on query
 * @param {string} collectionName Name of the collection
 * @param {object} query Query object
 * @returns {number} the count of documents based on a given query
 */
var countDocumentsByQuery = function countDocumentsByQuery(collectionName, query) {
  var dbHandleForShutDowns;
  return MongoClient.connect(DB_URL, {promiseLibrary: Promise})
    .then(function (db) {
      dbHandleForShutDowns = db;
      return db.collection(collectionName).find(query).count()
        .finally(db.close.bind(db));
    })
    .catch(function catchErrors(err) {
      if (dbHandleForShutDowns) {
        dbHandleForShutDowns.close();
      }
      throw err;
    });
};

/**
 * Method to insert documents in a given collection
 * @param {string} collectionName Name of the collection
 * @param {array} documents - Array of documents that will be inserted.
 * @returns {object} A document with `acknowledged: true` and an array of successfully inserted _id's
 */
var insertIntoDb = function insertIntoDb(collectionName, documents) {
  var dbHandleForShutDowns;
  if (documents.length < 1) {
    return Promise.resolve();
  }
  return MongoClient.connect(DB_URL, {promiseLibrary: Promise})
    .then(function insertData(db) {
      dbHandleForShutDowns = db;
      return db.collection(collectionName).insertMany(documents, {w: 1})
        .finally(db.close.bind(db));
    })
    .catch(function catchErrors(err) {
      if (dbHandleForShutDowns) {
        dbHandleForShutDowns.close();
      }
      throw err;
    });
};

module.exports = {
  insertMany: insertIntoDb,
  countDocuments: countDocumentsByQuery
};