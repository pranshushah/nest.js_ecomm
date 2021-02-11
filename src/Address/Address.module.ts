import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressSchema } from './Address.model';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Address', schema: AddressSchema }]),
  ],
})
export class AddressModule {}
