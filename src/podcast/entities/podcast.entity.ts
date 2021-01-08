import { Episode } from './episode.entity';
import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';
import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@InputType('PodcastInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Podcast {

  @PrimaryGeneratedColumn()
  @Field((_) => Number)
  @IsNumber()
  id: number;

  @Column()
  @Field((_) => String)
  @IsString()
  title: string;

  @Column()
  @Field((_) => String)
  @IsString()
  category: string;

  @Column()
  @Field((_) => Number)
  @IsNumber()
  rating: number;

  @OneToMany(
    type => Episode,
    episode => episode.podcast
  )
  @Field((_) => [Episode])
  episodes: Episode[];
}
