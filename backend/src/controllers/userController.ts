import type { Request, Response, NextFunction } from 'express';
import { UserModel } from '../db/models/index.js';
import { toUserDto } from '../db/mappers.js';

export async function getDemoUser(_req: Request, res: Response, next: NextFunction) {
  try {
    const user = await UserModel.findOne().sort({ createdAt: 1 });
    if (!user) {
      res.status(404).json({ error: 'No seeded user. Run npm run seed' });
      return;
    }
    res.json(toUserDto(user));
  } catch (e) {
    next(e);
  }
}
