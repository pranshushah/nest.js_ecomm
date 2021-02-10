import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './Product/Product.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://pranshu_44:pranshu4496@cluster0.gqun0.mongodb.net/ecomm_dev?retryWrites=true&w=majority',
    ),
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
