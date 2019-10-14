import {cleanResponse, queryAllData} from '../../helpers/transformTicket'
const ticket = {
  _id: {
      $oid: "5b8701a1fc13ae6569000000"
  },
  title: "Long Live Death (Viva la muerte)",
  genre: "Drama|War",
  price: 28.704,
  inventory: 4,
  image: "http://dummyimage.com/1459x751.png/cc0000/ffffff",
  date: "2017-09-27T05:06:56Z"
}

const cleanTicket = {
  title: "Long Live Death (Viva la muerte)",
  genre: ["Drama", "War"],
  price: 28.704,
  inventory: 4,
  imageUrl: "http://dummyimage.com/1459x751.png/cc0000/ffffff",
  date: "2017-09-27T05:06:56Z"
}


describe('transformTicket()', () => {
  describe('cleanResponse', () => {
    test("returns clean response", () => {
      expect(cleanResponse([ticket])[0]).toMatchObject(cleanTicket)
    })
  })
})
