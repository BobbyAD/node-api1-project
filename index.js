// implement your API here
const express = require("express");

const db = require("./data/db.js");

const server = express();

server.use(express.json());

// SANITY
server.get("/", (req, res) => {
    res.send({ message: "Server is running" });
});

// GET
server.get("/api/users", (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ errorMessage: "Error getting Users" });
        });
});

server.get("/api/users/:id", (req, res) => {
    db.findById(req.params.id)
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).send({
                    errorMessage: "User with specified ID not found"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ errorMessage: "Error getting User" });
        });
});

// POST
server.post("/api/users", (req, res) => {
    if (req.body["name"] && req.body["bio"]) {
        db.insert(req.body)
            .then(user => {
                db.findById(user.id)
                    .then(userDoc => {
                        res.status(201).json(userDoc);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send({
                            errorMessage: "Error finding user after creation"
                        });
                    });
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({
                    errorMessage: "Error creating the user"
                });
            });
    } else {
        res.status(400).send({
            errorMessage: "Please provide name and bio for the user"
        });
    }
});

//DELETE
server.delete("/api/users/:id", (req, res) => {
    db.findById(req.params.id)
        .then(user => {
            if (user) {
                db.remove(req.params.id)
                    .then(user => {
                        console.log(user);
                        res.status(200).send({
                            message: "User successfully deleted"
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send({
                            errorMessage: "Error deleting the user"
                        });
                    });
            } else {
                res.status(404).send({
                    errorMessage: "User with specified ID not found"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                errorMessage: "Error finding user to delete"
            });
        });
});

//PUT
server.put("/api/users/:id", (req, res) => {
    if (req.body["name"] && req.body["bio"]) {
        db.findById(req.params.id)
            .then(user => {
                if (user) {
                    db.update(req.params.id, req.body)
                        .then(user => {
                            db.findById(req.params.id)
                                .then(user => {
                                    res.status(200).json(user);
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).send({
                                        errorMessage:
                                            "Error finding user after updating"
                                    });
                                });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send({
                                errorMessage: "Error updating the user"
                            });
                        });
                } else {
                    res.status(404).send({
                        errorMessage: "Could not find the specified user"
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({
                    errorMessage: "Error finding user"
                });
            });
    } else {
        res.status(400).send({
            errorMessage: "Please include a name and bio for the user"
        });
    }
});

const port = 4000;
server.listen(port, () => {
    console.log(`\n SERVER RUNNING ON PORT ${port}`);
});
