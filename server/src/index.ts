import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import cors from 'cors';
import { ParsedQs } from 'qs';

console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'yes' : 'no');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['Authorization'],
}));

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET not set in environment');
}

interface User {
  id: number;
  username: string;
  passwordHash?: string;
}

const MOCK_USER: User & { passwordHash: string } = {
  id: 1,
  username: 'user',
  passwordHash: '$2b$10$EDJlFe.KLOcwsff4e9r14eHi6ywy1QuFIx2GndryQY3ZaRAvkN.zu',
};

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} Authorization:`, req.headers.authorization ?? '(none)');
  next();
});


passport.use(new LocalStrategy(
  async (username: string, password: string, done: (err: any, user?: any, info?: any) => void) => {
    try {
      if (username !== MOCK_USER.username) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const isMatch = await bcrypt.compare(password, MOCK_USER.passwordHash);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      const user = { id: MOCK_USER.id, username: MOCK_USER.username };
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (payload: JwtPayload, done: (err: any, user?: any) => void) => {
    try {
      const sub = payload?.sub;
      const subNum = typeof sub === 'string' ? Number(sub) : sub;
      if (subNum === MOCK_USER.id) {
        const user = { id: MOCK_USER.id, username: MOCK_USER.username };
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }
));

app.use(passport.initialize());

function getTokenFromReq(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  const q = req.query.token
  if (Array.isArray(q)) {
    return typeof q[0] === 'string' ? q[0] : null;
  }
  if (typeof q === 'string') {
    return q;
  }
  return null;
}


app.post('/login', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info?.message || 'Authentication failed' });
    }

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Generated token (first 50 chars):', token.substring(0, 50) + '...');
    res.setHeader('Authorization', `Bearer ${token}`);
    return res.json({ token });
  })(req, res, next);
});

app.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    res.json({ user: (req as any).user });
  }
);

app.get('/token-info', (req: Request, res: Response) => {
  const token = getTokenFromReq(req);
  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }

  const decoded = jwt.decode(token, { complete: true });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    return res.json({ decoded, verified });
  } catch (e: unknown) {
    const verifyError = e instanceof Error ? e.message : String(e);
    return res.status(401).json({ decoded, verifyError });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});