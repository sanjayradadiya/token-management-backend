import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginService } from './login.service';
import {
  CreateOTPDto,
  CreateOTPType,
  LoginDto,
  SignUpType,
  UserLoginDto,
  UserLoginType,
} from './dto/login.dto';
import { BusinessSignupInput } from './dto/signup.dto';

@Resolver()
export class LoginResolver {
  constructor(private loginService: LoginService) {}

  @Mutation(() => SignUpType, { name: 'businessSignUp' })
  async signup(@Args('input') body: BusinessSignupInput) {
    return this.loginService.signup(body);
  }

  @Mutation(() => SignUpType, { name: 'businessLogin' })
  async login(@Args('input') body: LoginDto) {
    return this.loginService.login(body);
  }

  @Mutation(() => UserLoginType, { name: 'userLogin' })
  async userLogin(@Args('input') body: UserLoginDto) {
    return this.loginService.userLogin(body);
  }

  @Mutation(() => CreateOTPType, { name: 'createotp' })
  async createotp(@Args('input') body: CreateOTPDto) {
    return this.loginService.createOTP(body);
  }

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
}
