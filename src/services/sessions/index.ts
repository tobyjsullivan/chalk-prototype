import {Session} from '../../chalk/domain';
import ChalkClient from '../../chalk/ChalkClient';

const SESSION_KEY = 'chalk-session';

export async function getActiveSession(chalk: ChalkClient): Promise<Session> {
  const sessionId = window.sessionStorage.getItem(SESSION_KEY);
  if (sessionId === null) {
    // create a new session
    const newSession = await chalk.CreateSession();
    window.sessionStorage.setItem(SESSION_KEY, newSession.id);
    return newSession;
  }

  return chalk.GetSession(sessionId);
}


