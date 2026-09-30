import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sneaker } from './sneaker.entity';
import { CreateSneakerDto } from './create-sneaker.dto';
import { UpdateSneakerDto } from './update-sneaker.dto';

@Injectable()
export class SneakersService {
 constructor(@InjectRepository(Sneaker) private readonly repository:Repository<Sneaker>){}
 findAll(){return this.repository.find();}
 findOne(id:number){return this.repository.findOneBy({id});}
 create(dto:CreateSneakerDto){return this.repository.save(this.repository.create(dto));}
 async update(id:number,dto:UpdateSneakerDto){
   const sneaker=await this.repository.findOneBy({id});
   if(!sneaker) throw new NotFoundException();
   this.repository.merge(sneaker,dto);
   return this.repository.save(sneaker);
 }
 async remove(id:number){await this.repository.delete(id);}
}