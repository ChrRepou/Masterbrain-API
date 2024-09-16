const handleRegister = (db, bcrypt) => (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json("incorrect form submission");
  }

  const hash = bcrypt.hashSync(password, 10);

  db.transaction((trx) => {
    trx
      .insert({
        hash,
        email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            username,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("unable to register"));
};

module.exports = {
  handleRegister,
};
