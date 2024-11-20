export class Coach {
    id?: string;         // Optional because it will be populated when fetched from the backend
    name!: string;       // Required field
    bio?: string;        // Optional
    expertise?: string;  // Optional
    image?: string;      // Optional
  
    constructor(
      name: string,
      bio?: string,
      expertise?: string,
      image?: string,
      id?: string
    ) {
      this.id = id;
      this.name = name;
      this.bio = bio;
      this.expertise = expertise;
      this.image = image;
    }
  }
  