import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";

@InputType()
class UsernamePasswordType {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@Resolver()
export class UserResolver {
  @Mutation((_returns) => UserResponse)
  async register(
    @Arg("input", () => UsernamePasswordType)
    { password, username }: UsernamePasswordType,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "username must be greater than or equal to 2",
          },
        ],
      };
    }
    if (password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "password must be greater than or equal to 3",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(password);
    const user = em.create(User, { username, password: hashedPassword });
    try {
      await em.persistAndFlush(user);
    } catch (e) {
      if (e.code === "23505") {
        return {
          errors: [{ field: "username", message: "username already exists" }],
        };
      }
    }
    return {
      user,
    };
  }

  @Mutation((_returns) => UserResponse)
  async login(
    @Arg("input", () => UsernamePasswordType)
    { password, username }: UsernamePasswordType,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username });
    if (!user) {
      return {
        errors: [{ field: "username", message: "no user fond" }],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          { field: "password", message: "please check your credentials" },
        ],
      };
    }
    return {
      user,
    };
  }
}
