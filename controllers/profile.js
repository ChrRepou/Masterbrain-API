const handleProfileGet = (db) => (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) return res.json(user[0]);
      else return res.status(404).json("not found");
    })
    .catch((err) => {
      res.status(400).json("unable to get profile");
    });
};

module.exports = {
  handleProfileGet,
};
