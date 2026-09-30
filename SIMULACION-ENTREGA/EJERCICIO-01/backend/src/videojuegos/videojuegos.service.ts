import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Videojuego } from './videojuego.entity';
@Injectable()
export class VideojuegosService {
 constructor(@InjectRepository(Videojuego) private readonly repository:Repository<Videojuego>){}
 findAll(){ return this.repository.find({order:{puntuacion:'DESC'}}); }
}