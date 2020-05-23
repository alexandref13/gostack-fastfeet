import * as yup from 'yup';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

export default {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().required(),
      avatar_id: yup.number().integer(),
    });

    try {
      await schema.validate(req.body);
    } catch ({ message }) {
      return res.status(400).json({ message });
    }

    const { email } = req.body;

    const checkExists = await Deliveryman.findOne({
      where: { email },
    });

    if (checkExists) {
      return res.status(401).json({ error: 'User already exists' });
    }

    await Deliveryman.create(req.body);

    const user = await Deliveryman.findOne({
      where: {
        email,
      },
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    return res.json(user);
  },
  async index(req, res) {
    const users = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    return res.json(users);
  },

  async update(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string(),
      avatar_id: yup.number().integer(),
    });

    try {
      await schema.validate(req.body);
    } catch ({ message }) {
      return res.status(400).json({ message });
    }
    const { deliveryman_id } = req.params;

    const user = await Deliveryman.findByPk(deliveryman_id);

    if (!user) {
      return res.status(400).json({ error: 'Sing up with a valid ID' });
    }

    if (req.body.email && req.body.email !== user.email) {
      const checkExists = await Deliveryman.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (checkExists) {
        return res.status(401).json({ error: 'User already exists' });
      }
    }

    if (req.body.email && req.body.email === user.email) {
      return res.status(401).json({ error: 'You must use a different email' });
    }

    await user.update(req.body);

    return res.json(user);
  },

  async delete(req, res) {
    const { deliveryman_id } = req.params;

    const user = await Deliveryman.findByPk(deliveryman_id);

    if (!user) {
      return res.status(400).json({ error: 'Sing up with a valid ID' });
    }

    await user.destroy();

    return res.json();
  },
};
