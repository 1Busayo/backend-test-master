import axios from "axios"
import { Arg, Mutation, Query, Resolver } from "type-graphql"

import MovieModel, { Movie } from "../entities/movie"
import TicketModel, { Ticket } from "../entities/ticket"

import { AddMovieInput } from "./types/Movie.input"

@Resolver(() => Movie)
export class MovieResolver {

  // Creating movies with matching tickets
  @Query(() => [Movie])
  public async addmoviesmatchedwithTickets(): Promise<Movie[]> {
    const tickets = await TicketModel.find()
    const links = tickets.map((ticket :any) => {
        const movieUrl = `http://www.omdbapi.com/?t=${ticket.title}&apikey=e724221e`
      return () => axios.get(movieUrl)
    });

    const movies: Movie[] = []
    links.forEach(async (link) => {
      const movie = await link()
      if(movie.data.Response === "True") {
        let movieModelInput = new AddMovieInput()
        movieModelInput = {...movieModelInput, ...movie.data}
        const newMovie = await this.addMovie(movieModelInput)
        movies.push(newMovie)
      }
    })

    return movies
  }

  @Mutation(() => Movie)
  public async addMovie(@Arg("input") movieInput: AddMovieInput): Promise<Movie> {
    const ticket = new MovieModel(movieInput)
    return ticket.save()
  }
}
