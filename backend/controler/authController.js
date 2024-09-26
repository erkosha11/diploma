const User = require('../models/User');
const UserBasket = require('../models/userBasket');
const UserWallet = require('../models/Wallets');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

const generateAccessToken = (id) => {
    const payload = {
        id
    }
    return jwt.sign(payload, secret, { expiresIn: "24h" })
}

class authClass {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Ошибка при регистрации", errors })
            }
            const { userIIN, password } = req.body
            const candidate = await User.findOne({ userIIN })
            if (candidate) {
                return res.status(400).json({ message: "Пользователь с таким IIN уже существует" })
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const user = new User({ userIIN, password: hashPassword })
            await user.save()
            const document = await User.findOne({ userIIN })
            const userBasket = new UserBasket({ userid: document._id })
            await userBasket.save()
            if (!req.account) {
                return res.status(400).json("User key pair do not created")
            }
            const account = req.account;
            const privateKey = account[0].privateKey;
            const address = account[0].address;
            const userWallet = new UserWallet({ publicKey: address, privateKey: privateKey, userid: userBasket._id });
            await userWallet.save()
            return res.json('User succses created')
        } catch (error) {
            res.status(400).json("User don't registrated")
        }
    }

    async login(req, res) {
        try {
            const { userIIN, password } = req.body
            const user = await User.findOne({ userIIN });
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" })
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(404).json({ message: "Не правильный пороль" });
            }
            const userBasket = await UserBasket.findOne({ userid: user._id })
            const token = generateAccessToken(userBasket._id);
            return res.json(token);
        } catch (error) {
            res.status(404).json('Не удалось войти')
        }
    }

    async getUser(req, res) {
        try {
            const user = await User.find();
            return res.json(user)
        } catch (e) {
            return res.status(404).json('Не удалось войти')
        }
    }
}

module.exports = new authClass();