import {BadRequestException, ForbiddenException, Injectable} from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "./users.model";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private readonly userModel: Model<UserDocument>) {}

  async insertUser(userName: string, password: string) {
    const user = await this.getUser(userName);

    if (user) {
      throw new ForbiddenException(`user with the ${userName} username already exists`);
    }

    const newUser = new this.userModel({
      username: userName,
      password: await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_OR_ROUNDS)),
    });
    await newUser.save();

    return newUser;
  }

  async getUser(userName: string) {
    return this.userModel.findOne({ username: userName });
  }

  async updateUserPassword(userName: string, oldPassword: string, newPassword: string) {
    const user = await this.getUser(userName);

    console.log('user ', user);

    if (!await bcrypt.compare(oldPassword, user.password)) {
      throw new BadRequestException('invalid old password')
    }

    return this.userModel.updateOne(
      { username: userName },
      { password: await bcrypt.hash(newPassword, Number(process.env.BCRYPT_SALT_OR_ROUNDS)) }
    );
  }
}
