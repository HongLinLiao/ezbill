import {
  getAccessToken,
  getLoginUri,
  getUserProfile,
  verifyIdToken,
} from '../utils/line';
import { LoginType } from '../enums/LoginType';
import { issueToken, JwtAttachment, ThirdPartyJwt } from '../utils/jwt';
import { createUser, queryUserByThirdParty, updateUserById } from './user';
import { LineServiceError } from '../models/service-error/line';
import { UserUpdateError } from '../models/service-error/user/UserUpdateError';

export async function lineLogin(code: string): Promise<ThirdPartyJwt> {
  const oauth = await getAccessToken(code);

  if (!oauth.id_token) {
    throw new LineServiceError('LINE id token not exist');
  }

  const jwtInfo = await verifyIdToken(oauth.id_token);
  const profile = await getUserProfile(oauth.access_token);

  return {
    uid: profile.userId,
    userName: profile.displayName,
    avatar: profile.pictureUrl,
    loginType: LoginType.LINE,
    email: jwtInfo.email,
  };
}

export async function login(thirdPartyInfo: ThirdPartyJwt): Promise<string> {
  const {
    uid: thirdPartyUid,
    loginType,
    userName,
    avatar,
    email,
  } = thirdPartyInfo;

  let user = await queryUserByThirdParty(loginType, thirdPartyUid);
  if (!user) {
    user = await createUser({
      name: userName,
      email: email,
      loginType: loginType,
      thirdPartyUid,
      photoUrl: avatar,
      createTime: new Date().getTime(),
    });
  } else {
    let diff = false;
    if (user.name !== userName) {
      diff = true;
      user.name = userName;
    }

    if (user.email !== email) {
      diff = true;
      user.email = email;
    }

    if (user.photoUrl !== avatar) {
      diff = true;
      user.photoUrl = avatar;
    }

    if (diff) {
      const newUser = await updateUserById(user);
      if (!newUser) {
        throw new UserUpdateError('Update user data error');
      }
      user = newUser;
    }
  }

  const jwtData: JwtAttachment = {
    uid: user.id!,
    userName: user.name,
    avatar: user.photoUrl,
    loginType: user.loginType,
    email: user.email,
    thirdPartyUid: user.thirdPartyUid,
  };
  return issueToken(jwtData);
}

export function getLineLoginEndpoint(): string {
  return getLoginUri();
}
