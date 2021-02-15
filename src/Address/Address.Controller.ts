import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { CreateAddress } from '../utils/Validator/CreateAddress.validator';
import { AddressTrim } from '../utils/pipes/Addresstrim.pipe';
import { Request } from 'express';
import { AuthenticatedGuard } from '../utils/Guards/Authenticated.guard';
import { AddressService } from './Address.service';
import { ValidateIdInObject } from '../utils/pipes/idValidationInObject.pipe';
import { EditAddress } from '../utils/Validator/EditAddress.validation';
import { ValidateId } from '../utils/pipes/idValidation.pipe';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  async addAddress(
    @Body(AddressTrim) addressObj: CreateAddress,
    @Req() req: Request,
  ) {
    const address = await this.addressService.addAddressToDatabase(
      addressObj,
      req.user,
    );
    return { address };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch()
  async editAddress(
    @Body(AddressTrim, ValidateIdInObject) addressObj: EditAddress,
    @Req() req: Request,
  ) {
    const updatedaddress = await this.addressService.editAddressToDatabase(
      addressObj,
      req.user,
    );
    return { address: updatedaddress };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('all')
  async getAllAddress(@Req() req: Request) {
    const addresses = await this.addressService.getAllAddressFromDatabase(
      req.user.id,
    );
    return { addresses };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async getAddress(@Req() req: Request, @Param('id', ValidateId) id: string) {
    const address = await this.addressService.getAddressfromDatabase(
      id,
      req.user.id,
    );
    return { address };
  }
}
