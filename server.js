const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const express = require('express');
const { error } = require('console');

const app = express();

const port = 3000;
pathToFile = path.join(__dirname, "user.json");
let uniqueId = 1;

app.use(express.json());

const schema = Joi.object({
    firstName: Joi.string()
        .min(3)
        .max(30)
        .required(),
    lastName: Joi.string()
        .min(3)
        .max(30)
        .required(),
    age: Joi.number()
        .min(0)
        .max(130)
        .required(),
    city: Joi.string()
        .min(2)
        .max(20),
});

app.get('/users', (req, res) => {
    res.send(fs.readFileSync(pathToFile))
});

app.get('/users/:id', (req, res) => {
    const users = JSON.parse(fs.readFileSync(pathToFile));
    const user = users.find((user) => user.id === Number(req.params.id));
    if (user) {
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.post('/users', (req, res) => {
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(404).send({ errror: result.error.details });
    }
    const users = JSON.parse(fs.readFileSync(pathToFile));
    uniqueId += 1;
    users.push({
        id: uniqueId,
        ...req.body
    });
    fs.writeFileSync(pathToFile, JSON.stringify(users, null, 2));
    res.send({
        id: uniqueId,
    });
});

app.put('/users/:id', (req, res) => {
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(404).send({ errror: result.error.details });
    }
    const users = JSON.parse(fs.readFileSync(pathToFile));
    let user = users.find((user) => user.id === Number(req.params.id));
    if (user) {
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.age = req.body.age;
        user.city = req.body.city;
        fs.writeFileSync(pathToFile, JSON.stringify(users, null, 2));
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.delete('/users/:id', (req, res) => {
    const users = JSON.parse(fs.readFileSync(pathToFile));
    let user = users.find((user) => user.id === Number(req.params.id));
    if (user) {
        const userIndex = users.indexOf(user);
        users.splice(userIndex, 1);
        fs.writeFileSync(pathToFile, JSON.stringify(users, null, 2));
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
})

app.listen(port, () => {
    console.log(`Server is on port: ${port}`);
});