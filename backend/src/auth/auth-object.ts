import { Session } from './schema/session.schema';
import { User } from './../user';

export interface AuthObject {
  session: Session,
  user: User
}
