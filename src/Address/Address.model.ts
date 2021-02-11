import { Schema, Document, Types } from 'mongoose';

export const AddressSchema = new Schema(
  {
    pinCode: {
      type: Number,
      required: [true, 'pincode is required'],
      validate: {
        validator(address: string) {
          return /^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$/.test(address);
        },
        message(message) {
          return `${message.value} is not valid pinoce`;
        },
      },
    },
    landMarks: {
      type: [String],
      required: [true, 'landmark is required'],
      validate: {
        validator(landMarks: string[]) {
          if (
            Array.isArray(landMarks) &&
            landMarks.length > 0 &&
            landMarks.length <= 2
          ) {
            for (let i = 0; i < landMarks.length; i++) {
              if (landMarks[i].length > 1) {
                continue;
              } else {
                return false;
              }
            }
            return true;
          } else {
            return false;
          }
        },
        message() {
          return `every landmarks should be more than one char`;
        },
      },
    },
    address: {
      type: String,
      required: [true, 'address is required '],
      validate: {
        validator(address: string) {
          return address.length > 2;
        },
        message() {
          return `address should have atleast 2 char`;
        },
      },
    },
    state: {
      type: String,
      required: [true, 'state is required '],
    },
    country: {
      type: String,
      required: [true, 'country is required '],
    },
    deliveredTo: {
      type: String,
      required: [true, 'name is required '],
      validate: {
        validator(name: string) {
          return name.length > 2;
        },
        message() {
          return `name should have atleast 2 char`;
        },
      },
    },
    userId: {
      type: Types.ObjectId,
      required: [true, 'userid is required'],
    },
  },
  {
    // to convert returning object as we want
    toJSON: {
      versionKey: false,
      transform(doc: Address, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

export interface AddressAttr {
  pinCode: number;
  userId: Types.ObjectId;
  deliveredTo: string;
  country: string;
  state: string;
  address: string;
  landMarks: string[];
}

export interface Address extends Document, AddressAttr {}
