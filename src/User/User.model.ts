import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'email is required'],
      validate: {
        validator(email: string) {
          return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email,
          );
        },
        message(message) {
          return `${message.value} is not valid email`;
        },
      },
    },
    name: {
      type: String,
      required: [true, 'name is required '],
    },
    imageURL: {
      type: String,
      required: [true, 'imageurl  is required '],
    },
    googleId: {
      type: String,
      required: true,
    },
  },
  {
    // to convert returning object as we want
    toJSON: {
      versionKey: false,
      transform(doc: UserDoc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

export interface userAttr {
  googleId: string;
  email: string;
  name: string;
  imageURL: string;
}
export interface userInfo extends userAttr {
  id: string;
}
// this will be type of document when create with new User();
export interface UserDoc extends Document, userAttr {}
