import { Schema, Document, Types } from 'mongoose';

export const AddressSchema = new Schema(
  {
    pincode: {
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
      validate: {
        validator(landMarks: string[]) {
          if (
            Array.isArray(landMarks) &&
            landMarks.length > 0 &&
            landMarks.length <= 2
          ) {
            for (let i = 0; i < landMarks.length; i++) {
              if (landMarks[i].length > 1 && landMarks[i].length < 45) {
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
          return address.length > 2 && address.length < 120;
        },
        message() {
          return `address should have atleast 2 char`;
        },
      },
    },
    state: {
      type: String,
      required: [true, 'state is required '],
      validate: {
        validator(state: string) {
          return state.length > 1 && state.length < 75;
        },
        message() {
          return `state should be between 2 and 74`;
        },
      },
    },
    city: {
      type: String,
      required: [true, 'city is required '],
      validate: {
        validator(city: string) {
          return city.length > 1 && city.length < 75;
        },
        message() {
          return `city should be between 2 and 74`;
        },
      },
    },
    country: {
      type: String,
      required: [true, 'country is required '],
      validate: {
        validator(country: string) {
          return country.length > 1 && country.length < 75;
        },
        message() {
          return `state should be between 2 and 74`;
        },
      },
    },
    deliveredTo: {
      type: String,
      required: [true, 'name is required '],
      validate: {
        validator(name: string) {
          return name.length > 1 && name.length < 45;
        },
        message() {
          return `name should be between 2 and 44 char`;
        },
      },
    },
    // userId: {
    //   type: Types.ObjectId,
    //   required: [true, 'userid is required'],
    // },
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

export interface AddressAttrWithoutUserID {
  pincode: number;
  deliveredTo: string;
  country: string;
  state: string;
  city: string;
  address: string;
  landMarks: string[];
}

export interface AddressAttr extends AddressAttrWithoutUserID {
  userId: Types.ObjectId;
}

export interface Address extends Document, AddressAttr {}
