import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './components/user/user.module';
import { AdminModule } from './components/admin/admin.module';
import { EmailModule } from './components/email/email.module';
import { ResetPasswordModule } from './components/reset-password/reset-password.module';
import { SeederModule } from './seeder/seeder.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ExpertModule} from './components/expert/expert.module';
import { PartnerModule } from './components/partner/partner.module';
import { ProductModule } from './product/product.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { CustomerModule } from './customer/customer.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST') ?? 'localhost',
        port: config.get<number>('DB_PORT') ?? 3306,
        username: config.get<string>('DB_USERNAME'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    AdminModule,
    EmailModule,
    ResetPasswordModule,
    SeederModule,
    PartnerModule,
    ExpertModule,
    ProductModule,
    DeliveriesModule,
    CustomerModule,
    CartModule,
    WishlistModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
