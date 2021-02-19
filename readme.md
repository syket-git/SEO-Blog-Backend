// How to use bcrypt for hashing password

1. import the bcrypt in js file.
2. create a variable const salt = await bcrypt.genSalt(10)
3. create a variable hashPassword = await bcrypt.hash(req.body.password, salt)
4. thats it.
