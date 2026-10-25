export interface Reloj {
  now(): Date;
}

export class FixedReloj implements Reloj {
  private readonly currentInstant: Date;

  constructor(initialInstant: Date) {
    this.currentInstant = new Date(initialInstant.getTime());
  }

  now(): Date {
    return new Date(this.currentInstant.getTime());
  }
}
