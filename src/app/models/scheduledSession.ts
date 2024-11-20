export class ScheduledSession {
  name?: string;
  id?: string;
  cours: {
    _id?: string;
    name: string;
    description?: string;
    duration?: number;
    intensityLevel?: string;
  };
  coach: {
    _id?: string;
    name: string;
    bio?: string;
    expertise?: string;
  };
  date: Date;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentCapacity?: number;
  createdAt?: Date;

  constructor(
    cours: { name: string },
    coach: { name: string },
    date: Date,
    startTime: string,
    endTime: string,
    maxCapacity: number,
    currentCapacity?: number
  ) {
    this.name = cours.name;
    this.cours = cours;
    this.coach = coach;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.maxCapacity = maxCapacity;
    this.currentCapacity = currentCapacity || 0;
  }
}
