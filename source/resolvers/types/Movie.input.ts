import { Field, InputType } from "type-graphql"

import { Movie } from "../../entities/Movie"

@InputType()
export class RatingInput {
  @Field()
  public Source: string;

  @Field()
  public Value: string;
}

@InputType()
export class AddMovieInput implements Partial<Movie> {
  @Field()
  public Title: string

  @Field()
  public Year: string

  @Field()
  public Rated: string

  @Field()
  public Released: Date

  @Field()
  public Runtime: string

  @Field(() => [String])
  public Genre: string[]

  @Field()
  public Director: string

  @Field()
  public Writer: string

  @Field(() => [String])
  public Actors: string[]

  @Field()
  public Plot: string

  @Field(() => [String])
  public Language: string[]

  @Field()
  public Country: string

  @Field()
  public Awards: string

  @Field()
  public Poster: string
  
  @Field(type => [RatingInput])
  public Ratings: RatingInput[]

  @Field()
  public Metascore: string

  @Field()
  public imdbRating: string

  @Field()
  public imdbVotes: string

  @Field()
  public imdbID: string

  @Field()
  public Type: string

  @Field()
  public DVD: string

  @Field()
  public BoxOffice: string

  @Field()
  public Production: string

  @Field()
  public Website: string

  @Field()
  public Response: string
}
