import * as Yup from 'yup';

import Recipient from '../models/Recipient';

export default {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      street: Yup.string().required(),
      number: Yup.number().integer().required(),
      complement: Yup.string(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    try {
      await schema.validate(req.body);
    } catch ({ message }) {
      return res.status(400).json({ message });
    }
    const { email, zip_code } = req.body;

    const user = await Recipient.findOne({
      where: {
        email,
      },
    });

    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const match = zip_code.match(/\d{5}-\d{3}/g);

    if (!(match && match[0] === zip_code)) {
      return res.status(400).json({ error: 'Zip code does not match !' });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      city,
      state,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      email,
      street,
      number,
      complement,
      city,
      state,
      zip_code,
    });
  },

  async index(req, res) {
    const users = await Recipient.findAll();

    return res.json(users);
  },

  async show(req, res) {
    const { recipient_id } = req.params;

    const user = await Recipient.findByPk(recipient_id);

    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }

    const {
      name,
      email,
      street,
      number,
      complement,
      city,
      state,
      zip_code,
    } = user;

    return res.json({
      name,
      email,
      street,
      number,
      complement,
      city,
      state,
      zip_code,
    });
  },

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      street: Yup.string(),
      number: Yup.number().integer(),
      complement: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      zip_code: Yup.string(),
    });

    try {
      await schema.validate(req.body);
    } catch ({ message }) {
      return res.status(400).json({ message });
    }
    const { recipient_id } = req.params;

    const user = await Recipient.findByPk(recipient_id);

    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }

    if (req.body.email && req.body.email === user.email) {
      return res
        .status(401)
        .json({ error: 'You should change to a different email. ' });
    }

    const checkExists = await Recipient.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (checkExists) {
      return res.status(401).json({ error: 'Email alredy in use.' });
    }

    const {
      name,
      email,
      street,
      number,
      complement,
      city,
      state,
      zip_code,
    } = await user.update(req.body);

    return res.json({
      name,
      email,
      street,
      number,
      complement,
      city,
      state,
      zip_code,
    });
  },

  async delete(req, res) {
    const { recipient_id } = req.params;

    const user = await Recipient.findByPk(recipient_id);

    await user.destroy();

    return res.json();
  },
};
