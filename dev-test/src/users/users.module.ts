import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./users.model";

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [MongooseModule.forFeature([{ name: "user", schema: UserSchema }])],
  exports: [UsersService],
})
export class UsersModule {}
