declare namespace Express {
  export interface Request {
    auth?: import('./auth/auth-object').AuthObject
  }
}
