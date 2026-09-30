import { Injectable,NotFoundException,OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
import { Cancion } from './cancion.entity';
import { CreateCancionDto } from './create-cancion.dto';

@Injectable()
export class PlaylistsService implements OnModuleInit {
 constructor(
  @InjectRepository(Playlist) private readonly playlists:Repository<Playlist>,
  @InjectRepository(Cancion) private readonly canciones:Repository<Cancion>,
 ){}

 async onModuleInit(){
   if(await this.playlists.count()===0){
     const playlist=await this.playlists.save(this.playlists.create({nombre:'Entrenamiento'}));
     await this.canciones.save(this.canciones.create({titulo:'Run Boy Run',artista:'Woodkid',playlist}));
   }
 }

 async findOne(id:number):Promise<Playlist>{
  // relations hace que TypeORM cargue también las canciones relacionadas.
  const playlist=await this.playlists.findOne({where:{id},relations:{canciones:true}});
  if(!playlist) throw new NotFoundException('Playlist no encontrada');
  return playlist;
 }

 async addSong(dto:CreateCancionDto):Promise<Cancion>{
  const playlist=await this.playlists.findOneBy({id:dto.playlistId});
  if(!playlist) throw new NotFoundException('Playlist no encontrada');
  return this.canciones.save(this.canciones.create({titulo:dto.titulo,artista:dto.artista,playlist}));
 }
}