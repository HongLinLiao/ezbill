import { LoginType } from '../enums/LoginType';
import UserModel from '../models/mongodb/User';
import User from '../models/service/User';

export async function queryUserById(id: string) {
  const user = await UserModel.findById(id).exec();
  return user && User.toServiceModel(user);
}

export async function queryUserByThirdParty(
  loginType: LoginType,
  thirdPartyUid: string,
): Promise<User | null> {
  const user = await UserModel.findOne({ loginType, thirdPartyUid });
  return user && User.toServiceModel(user);
}

export async function createUser(user: User): Promise<User> {
  const newUser = await new UserModel({
    name: user.name,
    email: user.email,
    loginType: user.loginType,
    thirdPartyUid: user.thirdPartyUid,
    photoUrl: user.photoUrl,
    createTime: user.createTime,
  }).save();

  return User.toServiceModel(newUser);
}

export async function updateUserById(user: User): Promise<User | null> {
  const newUser = await UserModel.findByIdAndUpdate(user.id, user, {
    new: true,
  }).exec();
  return newUser && User.toServiceModel(newUser);
}
