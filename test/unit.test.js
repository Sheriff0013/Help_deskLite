const {
  addTicketToDatabase, getAllTicketsASC, getAllTicketsDESC, updateTicket, deleteTicket, getTicketByStatus, getTicketByPriority, getTicketByRequester, getTicketByTitle, getTicketById }
  = require('../src/fonctionnalitesTickets')

//fausse BDD
const mockDb = {
  run: jest.fn(),
  all: jest.fn(),
  get: jest.fn(),

}
