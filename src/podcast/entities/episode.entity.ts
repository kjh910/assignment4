import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, RelationId } from 'typeorm';
import { Podcast } from './podcast.entity';

@InputType('EpisodeInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Episode {

  @PrimaryGeneratedColumn()
  @Field((_) => Number)
  id: number;

  @Column()
  @Field((_) => String)
  title: string;

  @Column()
  @Field((_) => String)
  category: string;

  @ManyToOne(
    type => Podcast,
    episode => episode.episodes
  )
  // @Field(type => Podcast)
  podcast: Podcast;

  @Column()
  @RelationId((episode: Episode) => episode.podcast)
  @Field(type => Number)
  podcastId: number;
}
