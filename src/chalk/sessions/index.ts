import axios from 'axios';

import {Session} from '../domain';

const ENDPOINT_CREATE_SESSION = '/sessions';

type CreateSessionResponse = SessionResponse;
type GetSessionResponse = SessionResponse | ErrorResponse;

interface SessionResponse {
  error: undefined,
  session: {
    id: string,
    pages: ReadonlyArray<string>,
  },
}

interface ErrorResponse {
  error: string,
  session: undefined,
}

export async function createSession(apiUrl: string): Promise<Session> {
  const {data}: {data: CreateSessionResponse} = await axios.post(apiUrl + ENDPOINT_CREATE_SESSION);

  return {
    id: data.session.id,
  };
}

export async function getSession(apiUrl: string, sessionId: string): Promise<Session | null> {
  const safeSessionId = encodeURIComponent(sessionId);
  const {data}: {data: GetSessionResponse} = await axios.get(apiUrl + ENDPOINT_CREATE_SESSION + '/' + safeSessionId);
  if (data.error !== undefined) {
    return null;
  }

  return {
    id: data.session.id,
  };
}
