export class Cours {
  _id?: string;  // Adding _id as an optional property
  name: string;
  description: string;
  duration: number;
  intensityLevel: 'Débutant' | 'Intermédiaire' | 'Avancé';
  createdAt: Date;
  price: number;

  constructor(
    name: string,
    description: string,
    duration: number,
    price: number,
    intensityLevel: 'Débutant' | 'Intermédiaire' | 'Avancé' = 'Débutant',
    createdAt: Date = new Date(),
    _id?: string   
  ) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.duration = duration;
    this.intensityLevel = intensityLevel;
    this.createdAt = createdAt;
    this.price = price;
  }
}
