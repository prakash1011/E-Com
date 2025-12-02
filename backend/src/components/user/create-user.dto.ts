import { IsEmail, IsIn, IsInt, IsOptional, MinLength } from "class-validator";
import { Cart } from "src/cart/entities/cart.entity";
import { OneToOne } from "typeorm";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsInt()
  role_id: number;

  @IsOptional()
  @IsIn([0, 1])
  active?: number;

  @OneToOne(() => Cart, (cart) => cart.customer)
  cart: Cart;
}