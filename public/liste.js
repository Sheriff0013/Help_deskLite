let tickets = [ticket];
const ticket = {id, title, description, requester, priority, statu, createdAt, updatedAt};

const getTickets = () => {
  return tickets;
};

const addTicket = (ticket) => {
  tickets.push(ticket);
};

const deleteTicket = (id) => {
  tickets = tickets.filter(ticket => ticket.id !== id);
};


const updateTicket = (id, ticket) => {
};