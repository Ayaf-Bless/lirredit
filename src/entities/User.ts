import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @PrimaryKey()
  @Field()
  id!: number;

  @Property({ type: "date" })
  @Field()
  createdAt: Date = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  @Field()
  updatedAt: Date = new Date();

  @Property({ type: "text", unique: true })
  @Field()
  username: string;

  @Property({ type: "text" })
  password: string;
}
