import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from './Address.model';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel('Adress') private readonly addressModel: Model<Address>,
  ) {}
}
