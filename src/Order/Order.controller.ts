import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ValidateId } from '../utils/pipes/idValidation.pipe';
import { OrderService } from './Order.service';
import { CreateOrderValidator } from '../utils/Validator/CreateOrder.validator';
import { Request } from 'express';
import { AuthenticatedGuard } from '../utils/Guards/Authenticated.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  async addAddress(
    @Body() productsInOrder: CreateOrderValidator,
    @Req() req: Request,
  ) {
    const order = await this.orderService.addOrderTotheDatabase(
      productsInOrder.products,
      req.user._id,
    );
    return { order };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async getOrder(@Param('id', ValidateId) id: string) {
    const order = await this.orderService.getOrder(id);
    return { order };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('all')
  async getAllOrder(@Req() req: Request) {
    const orders = await this.orderService.getAllOrdersFromDatabase(
      req.user._id,
    );
    return { orders };
  }
}
