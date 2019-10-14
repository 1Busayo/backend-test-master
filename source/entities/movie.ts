import { ObjectId } from "mongodb"
import { Field, ObjectType } from "type-graphql"
import {
  arrayProp as ArrayProperty,
  ModelType,
  prop as Property,
  staticMethod as StaticMethod,
  Typegoose,
} from "typegoose"

@ObjectType()
class Rating {
  @Field()
  public Source: string;

  @Field()
  public Value: string;
}

@ObjectType()
export class Movie extends Typegoose {
  @StaticMethod
  public static findById(this: ModelType<Movie>, id: any) {
    return this.findOne({ _id: id})
  }

  @Field()
  public readonly _id: ObjectId

  @Field()
  @Property({ required: true })
  public Title: string

  @Field()
  @Property()
  public Year: string

  @Field()
  @Property()
  public Rated: string

  @Field()
  @Property()
  public Released: Date

  @Field()
  @Property()
  public Runtime: string

  @Field(() => [String])
  @ArrayProperty({ items: String, default: [] })
  public Genre: string[]

  @Field()
  @Property()
  public Director: string

  @Field()
  @Property()
  public Writer: string

  @Field(() => [String])
  @ArrayProperty({ items: String, default: [] })
  public Actors: string[]

  @Field()
  @Property()
  public Plot: string

  @Field(() => [String])
  @ArrayProperty({ items: String, default: [] })
  public Language: string[]

  @Field()
  @Property()
  public Country: string

  @Field()
  @Property()
  public Awards: string

  @Field()
  @Property()
  public Poster: string

  @Field(type => [Rating])
  @ArrayProperty({ items: Rating, default: [] })
  public Ratings: Rating[]

  @Field()
  @Property()
  public Metascore: string

  @Field()
  @Property()
  public imdbRating: string

  @Field()
  @Property()
  public imdbVotes: string

  @Field()
  @Property()
  public imdbID: string

  @Field()
  @Property()
  public Type: string

  @Field()
  @Property()
  public DVD: string

  @Field()
  @Property()
  public BoxOffice: string

  @Field()
  @Property()
  public Production: string

  @Field()
  @Property()
  public Website: string
}

export const MovieModel = new Movie().getModelForClass(Movie)

export default MovieModel
