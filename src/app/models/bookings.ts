import { ScheduledSession } from './scheduledSession';

export class Booking {
  id?: string; // Virtual field for the MongoDB ObjectId
  scheduledSession: ScheduledSession; // Reference to the ScheduledSession
  user: {
    _id?: string;
    fullname: string;
    email?: string;
  };  
  status: 'confirmé' | 'annulé'; // Enum for booking status
  createdAt?: Date;  

  constructor(
    scheduledSession: ScheduledSession,
    user: { fullname: string },
    status: 'confirmé' | 'annulé' = 'confirmé',
    id?: string,
    createdAt?: Date
  ) {
    this.scheduledSession = scheduledSession;
    this.user = user;
    this.status = status;
    this.id = id;
    this.createdAt = createdAt || new Date(); // Default to the current date
  }
}
