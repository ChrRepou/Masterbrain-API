// const clarifai = require("clarifai");

// const handleImageUrl = (req, res) => {

// }
const PAT = process.env.PAT;
const USER_ID = process.env.USER_ID;
const APP_ID = process.env.APP_ID;
const MODEL_ID = process.env.MODEL_ID;

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

const handleClarifaiApi = (req, res) => {
  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      model_id: MODEL_ID,
      inputs: [
        { data: { image: { url: req.body.input, allow_duplicate_url: true } } },
      ],
    },
    metadata,
    (err, response) => {
      if (err || response.status.code !== 10000) {
        return res.status(400).json("unable to access api");
      }

      return res.json(response);
    }
  );
};

const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("*")
    .then((user) => {
      if (user.length) {
        return res.json(user[0]);
      } else return res.status(404).json("not found");
    })
    .catch((err) => res.status(400).json("unable to process the request"));
};
module.exports = {
  handleImage,
  handleClarifaiApi
};
