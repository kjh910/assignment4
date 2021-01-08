import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PodcastsModule } from './podcast/podcasts.module';
import { Podcast } from './podcast/entities/podcast.entity';
import { Episode } from './podcast/entities/episode.entity';

@Module({
  imports: [PodcastsModule, 
    GraphQLModule.forRoot({ autoSchemaFile: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/assignment4.db',
      synchronize: true,
      logging: true,
      entities:[Podcast, Episode]
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
