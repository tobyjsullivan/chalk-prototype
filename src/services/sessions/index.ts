import {Session} from '../../chalk/domain';
import ChalkClient from '../../chalk/ChalkClient';

const SESSION_KEY = 'chalk-session';

export async function getActiveSession(chalk: ChalkClient): Promise<Session> {
  const sessionId = window.localStorage.getItem(SESSION_KEY);
  if (sessionId !== null) {
    // Try getting previous session
    const session = await chalk.getSession(sessionId);
    if (session !== null) {
      return session;
    }

    console.warn(`error fetching prior session ${sessionId}`);
    // Fall through and create a new session
  }

  // create a new session
  const newSession = await chalk.createSession();
  window.localStorage.setItem(SESSION_KEY, newSession.id);
  return newSession;
}


