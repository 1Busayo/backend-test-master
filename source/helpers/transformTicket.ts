
import axios from "axios"
import {Ticket} from '../entities/ticket'

type TicketResults = {
  data: [Ticket]
}

export const cleanResponse = (results: any[]) => {
  return results.map(({image, _id, genre, ...result}) => {
    let cleanResult = {...result, imageUrl: image, genre: genre && genre.split('|')}
    return cleanResult
  })
}

export const queryAllData = async(skip = 0): Promise<Ticket[]> => {

  const limit = 100
  const results: TicketResults = await axios({
     url:'https://us-central1-bonsai-interview-endpoints.cloudfunctions.net:443/movieTickets?skip=0&limit=1',
    method: 'get',
    headers : {
      'Content-Type': 'application/json; charset=utf-8',
    }
  })
  
  if (!results.data.length) {
    return cleanResponse(results.data)
  }
  return cleanResponse(results.data).concat(await queryAllData(skip + limit))
}
