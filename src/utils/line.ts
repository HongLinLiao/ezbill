import { v4 as uuid } from 'uuid';
import { Env } from './env';
import axios from 'axios';

const LINE_LOGIN_ENDPOINT = 'https://access.line.me/oauth2/v2.1';
const LINE_API_ENDPOINT = 'https://api.line.me';
const REQUEST_CONTENT_TYPE = 'application/x-www-form-urlencoded';
const SCOPE = 'profile%20openid%20email';

export function getLoginUri(): string {
  const { lineClientId, lineRedirectUri } = Env;

  const queryStrings: { key: string; value: string }[] = [
    { key: 'response_type', value: 'code' },
    { key: 'client_id', value: lineClientId },
    { key: 'redirect_uri', value: lineRedirectUri },
    { key: 'state', value: uuid() },
    { key: 'scope', value: SCOPE },
  ];

  return `${LINE_LOGIN_ENDPOINT}/authorize?${queryStrings.map((e) => `${e.key}=${e.value}`).join('&')}`;
}

export async function getAccessToken(code: string): Promise<LineOAuth> {
  const { lineClientId, lineClientSecret, lineRedirectUri } = Env;

  const res = await axios.request({
    method: 'POST',
    url: `${LINE_API_ENDPOINT}/oauth2/v2.1/token`,
    headers: { 'Content-Type': REQUEST_CONTENT_TYPE },
    data: {
      grant_type: 'authorization_code',
      code,
      redirect_uri: lineRedirectUri,
      client_id: lineClientId,
      client_secret: lineClientSecret,
    },
  });

  return res.data as LineOAuth;
}

export async function getUserProfile(
  accessToken: string,
): Promise<LineUserProfile> {
  const res = await axios.request({
    method: 'GET',
    url: `${LINE_API_ENDPOINT}/v2/profile`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data as LineUserProfile;
}

export async function verifyIdToken(
  idToken: string,
  nonce?: string,
  userId?: string,
): Promise<LineJwt> {
  const { lineClientId } = Env;

  const res = await axios.request({
    url: `${LINE_API_ENDPOINT}/oauth2/v2.1/verify`,
    method: 'POST',
    headers: {
      'Content-Type': REQUEST_CONTENT_TYPE,
    },
    data: {
      id_token: idToken,
      client_id: lineClientId,
      nonce,
      user_id: userId,
    },
  });

  return res.data as LineJwt;
}

interface LineOAuth {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  id_token?: string;
}

interface LineUserProfile {
  userId: string;
  displayName: string;
  pictureUrl: string;
  statusMessage: string;
}

interface LineJwt {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  nonce: string;
  amr: string[];
  name: string;
  picture: string;
  email: string;
}
