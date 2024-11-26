export class Abonnement {
    id?: string;  
    name: string;  
    sessionCount: number;  
    duration: number;  
    price: number;  
    userCount?: number; // Optional field for user count

  
    constructor(data: Partial<Abonnement> = {}) {
      this.id = data.id;
      this.name = data.name || '';
      this.sessionCount = data.sessionCount || 0;
      this.duration = data.duration || 0;
      this.price = data.price || 0;
      this.userCount = data.userCount
    }
  }
  