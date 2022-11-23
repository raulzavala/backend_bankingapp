const MongoClient = require("mongodb").MongoClient;
const user = process.env.USER;
const pwd = process.env.PASSWORD;
const url = `mongodb+srv://${user}:${pwd}@cluster0.rrr6efc.mongodb.net/`;
let db = null;

// connect to mongo
MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
  console.log("Connected successfully to db server");

  // connect to myproject database
  db = client.db("users");
});

// create user account using the collection.insertOne function
function create(name, email, password) {
  // TODO: populate this function based off the video
  return new Promise((resolve, reject) => {
    const collection = db.collection("users");
    const doc = {
      name,
      email,
      password,
      balance: 0,
      transactions: [{ transactionType: "Deposit", amount: "0" }],
    };
    collection.insertOne(doc, { w: 1 }, function (err, result) {
      err ? reject(err) : resolve(doc);
    });
  });
}

// find user account
function find(email) {
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("users")
      .find({ email: email })
      .toArray(function (err, docs) {
        err ? reject(err) : resolve(docs);
      });
  });
}

// find user account
function findOne(email) {
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("users")
      .findOne({ email: email })
      .then((doc) => resolve(doc))
      .catch((err) => reject(err));
  });
}

// update - deposit/withdraw amount
function update(email, amount, transaction) {
  if (transaction == "Deposit") {
    return new Promise((resolve, reject) => {
      // Add Operation
      db.collection("users").findOneAndUpdate(
        { email: email },
        {
          $push: {
            transactions: { transactionType: transaction, amount: amount },
          },
        },
        { returnOriginal: false },
        function (err, documents) {
          err ? reject(err) : resolve(documents);
        }
      );

      //Increment
      db.collection("users").findOneAndUpdate(
        { email: email },
        { $inc: { balance: amount } },
        { returnOriginal: false },
        function (err, documents) {
          err ? reject(err) : resolve(documents);
        }
      );
    });
  } else {
    return new Promise((resolve, reject) => {
      // Add Operation
      db.collection("users").findOneAndUpdate(
        { email: email },
        {
          $push: {
            transactions: { transactionType: transaction, amount: amount },
          },
        },
        { returnOriginal: false },
        function (err, documents) {
          err ? reject(err) : resolve(documents);
        }
      );

      //Decrement
      db.collection("users").findOneAndUpdate(
        { email: email },
        { $inc: { balance: -amount } },
        { returnOriginal: false },
        function (err, documents) {
          err ? reject(err) : resolve(documents);
        }
      );
    });
  }
}

// return all users by using the collection.find method
function all() {
  // TODO: populate this function based off the video'
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("users")
      .find({})
      .toArray(function (err, docs) {
        err ? reject(err) : resolve(docs);
      });
  });
}

module.exports = { create, findOne, find, update, all };
