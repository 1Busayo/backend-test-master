import axios from "axios"
import { Arg, Int, Mutation, Query , Resolver} from "type-graphql"

import MovieModel from "../entities/movie"
import TicketModel, { Ticket } from "../entities/ticket"

import { AddTicketInput, AddTicketInputs, ListTicketsInput, TicketInput} from "./types/Ticket.input"

// tslint:disable-next-line:interface-name
interface TicketResults {
  data: [Ticket]
}
// cleaning the response fetching from the API
const cleanresp = (results: any[]) => {
  return results.map(({image, _id, genre, ...result}) => {
    const cleanresults = {...result, imageUrl: image, genre: genre && genre.split('|')}
    return cleanresults
  })
}

// fetching the movietickets data from an external Api
const getallData = async(skip = 0): Promise<Ticket[]> => {
  const limit = 100
  const getresult: TicketResults = await axios.get(`https://us-central1-bonsai-interview-endpoints.cloudfunctions.net/movieTickets?skip=${skip}&limit=${limit}`)
  if (!getresult.data.length) {
    return cleanresp(getresult.data)
  }
  return cleanresp(getresult.data).concat(await getallData(skip + limit))
}

@Resolver(() => Ticket)
export class TicketResolver {
  @Query(() => Ticket, { nullable: true })
  public async ticket(@Arg("input") ticketInput: TicketInput): Promise<Ticket> {
    const ticket = await TicketModel.findById(ticketInput.id)
    if (!ticket) {
      throw new Error("No ticket found!")
    }
    return ticket
  }

  @Query(() => [Ticket])
  public async listTickets(@Arg("input") input: ListTicketsInput): Promise<Ticket[]> {
    const tickets = await TicketModel.find({})
    const result = tickets
      .filter(ticket => ticket.date.getTime() < input.cursor.getTime())
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, input.limit)
    return result
  }




  
// Fetch and store the clean tickets
  @Query(() => [Ticket])
  public async getandstoreTickets(): Promise<AddTicketInput []> {
    const tickets = await getallData()

    const formattedTickets = tickets.filter(ticket => {
      return ticket.title && ticket.imageUrl
    })

    const ticketInputs: AddTicketInput[] = formattedTickets.map(x => {
      const y = new AddTicketInput()
      return {...y, ...x}
    })

    const d = new AddTicketInputs()
    d.tickets = ticketInputs

    this.savemassTickets(d)

    return formattedTickets
  }

  @Mutation(() => Ticket)
  public async addTicket(@Arg("input") ticketInput: AddTicketInput): Promise<Ticket> {
    const ticket = new TicketModel(ticketInput)
    return ticket.saveFields()
  }
// for saving bulk tickets fetched from the API
  @Mutation(() => [Ticket])
  public async savemassTickets(@Arg("tickets") ticket: AddTicketInputs): Promise<Ticket[]> {
    return TicketModel.insertMany(ticket.tickets)
  }
  // ticket with no matching movies
  @Query(() => [Ticket])
  public async nomatchingticketMovies(@Arg("limit", type => Int, { defaultValue: 10 }) limit: number, @Arg("limit", type => Int, { defaultValue: 1 }) page: number): Promise<Ticket[]> {
    const tickets = await TicketModel.find()
    const ticketsWithoutMovies: Ticket[] = []
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i]
      const movie = await MovieModel.find({Title: ticket.title})
      if (movie.length < 1) {
        ticketsWithoutMovies.push(ticket)
      }
    }
    return ticketsWithoutMovies.slice(page*limit, (page * limit) + limit)
  }
}
