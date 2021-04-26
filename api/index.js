const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const JWTSECRET = 'jtsSc,j8}pCg,vLW9_9c;Qc@;L0jYpvy)q#P-Q0$8Ymgni8y5c';


const Game = require('./models/game.js');
const User = require('./models/user.js');

let { Op } = require('sequelize');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const auth = function (req, res, next) {
    const authToken = req.headers['authorization'];
    if (authToken) {
        const bearer = authToken.split(' ');
        let token = bearer[1];
        jwt.verify(token, JWTSECRET, (err, data) => {
            if (!err) {
                req.token = token;
                req.loggedUser = { id: data.id, email: data.email };
                next();
            } else {
                res.status(401).json({ error: 'Token Inválido' });
            }
        });
    } else {
        res.status(401).json({ error: 'Token inválido' });
    }
};

app.get('/games', auth, async (req, res) => {
    try {

        let games = await Game.findAll();
        res.status(200).json(games);
    } catch (err) {
        res.sendStatus(400);
    }
});

app.get('/game/:id', auth, async (req, res) => {
    try {
        if (isNaN(req.params.id)) {
            res.sendStatus(400);
        } else {
            let game = await Game.findByPk(req.params.id);
            res.status(200).json(game);
        }
    } catch (err) {
        res.sendStatus(400);
    }
});

app.post('/game', auth, async (req, res) => {
    let { title, year, price } = req.body;
    if (title == '' || isNaN(year) || isNaN(price)) {
        res.sendStatus(400);
    } else {
        try {
            await Game.create({ title, year, price });
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(404);
        }
    }
});

app.put('/game/:id', auth, async (req, res) => {
    let id = req.params.id
    let { title, year, price } = req.body;
    try {
        Game.update({
            title,
            year,
            price
        }, { where: { id } });
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(404);
    }
});

app.delete('/game/:id', auth, async (req, res) => {
    let id = req.params.id;
    try {
        await Game.destroy({ where: { id } });
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(404);
    }
});

app.post('/user', async (req, res) => {
    let { name, email, password } = req.body;
    if ((name == '' || !name) || (email == '' || !email) || (password == '' || !password)) {
        res.sendStatus(400);
    } else {
        try {
            User.create({ name, email, password });
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(404);
        }
    }
});

app.post('/auth', async (req, res) => {
    let { email, password } = req.body;
    if ((email == '' || !email) || (password == '' || !password)) {
        res.sendStatus(400);
    } else {
        try {
            let user = await User.findOne({
                where: {
                    email: {
                        [Op.eq]: email
                    }
                }
            });

            if (user) {
                if (user.password == password) {
                    try {
                        let token = jwt.sign({ id: user.id, email: user.email }, JWTSECRET, { expiresIn: '48h' });
                        res.status(200).json({ token });
                    } catch (err) {
                        res.sendStatus(404);
                    }
                } else {
                    res.status(401).json({ error: 'Senha incorreta' });
                }
            } else {
                res.status(404).json({ error: 'Email não encontrado' });
            }

        } catch (err) {
            res.sendStatus(404);
        }
    }
});

authenticateDatabase = async () => {
    try {
        connection.authenticate();
        console.log('database authenticate');
    } catch (err) {
        console.log('database error: ', err);
    }
}
authenticateDatabase();


app.listen(3030, () => {
    console.log('listen api');
});