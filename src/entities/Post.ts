import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Post {
  @PrimaryKey()
  @Field()
  id!: number;

  @Property({ type: "date" })
  @Field()
  createdAt: Date = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  @Field()
  updatedAt: Date = new Date();

  @Property({ type: "text" })
  @Field()
  title!: string;
}
