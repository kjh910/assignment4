import { Injectable } from '@nestjs/common';
import { CreateEpisodeDto } from './dtos/create-episode.dto';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { CoreOutput } from './dtos/output.dto';
import {
  PodcastOutput,
  PodcastSearchInput,
  EpisodesOutput,
  EpisodesSearchInput,
} from './dtos/podcast.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ok } from 'assert';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast) private readonly podcasts:Repository<Podcast>,
    @InjectRepository(Episode) private readonly episode:Repository<Episode>
  ){}

  async getAllPodcasts(): Promise<Podcast[]> {
    return await this.podcasts.find();
  }

  createPodcast({ title, category }: CreatePodcastDto): CoreOutput {
    this.podcasts.save(
      this.podcasts.create({
        title,
        category,
        rating: 0,
        episodes: [],
      })
    );

    return { ok: true, error: null };
  }

  async getPodcast(id: number): Promise<PodcastOutput> {
    const podcast = await this.podcasts.findOne(id);

    if (!podcast) {
      return {
        ok: false,
        error: `${id} id podcast doesn't exist!`,
      };
    }
    return {
      ok: true,
      podcast,
    };
  }

  async deletePodcast(id: number): Promise<CoreOutput> {
    const { ok, error } = await this.getPodcast(id);
    if (!ok) {
      return { ok, error };
    }
    await this.podcasts.delete(id);
    return { ok };
  }

  async updatePodcast({ id, ...rest }: UpdatePodcastDto): Promise<CoreOutput> {
    const { ok, error, podcast } = await this.getPodcast(id);
    if (!ok) {
      return { ok, error };
    }

    if(rest.title !== ''){
      podcast.title = rest.title;
    } 
    if(rest.category !== ''){
      podcast.category = rest.category;
    } 
    if(rest.rating !== null){
      podcast.rating = rest.rating;
    } 
    if(rest.episodes){
      podcast.episodes = rest.episodes;
    } 
    await this.podcasts.save(podcast);
    // this.podcasts = this.podcasts.filter((p) => p.id !== id);
    // this.podcasts.push({ ...podcast, ...rest });
    return { ok };
  }

  async getEpisodes(podcastId: number): Promise<EpisodesOutput> {
    const episodes = await this.episode.find(
      { 
        relations: ['podcast'],

        where: {
          podcastId: podcastId
        }
      }
    );
    if(!episodes){
      return{
        ok: false,
        error: 'Not Found Episodes'
      }
    }

    return { ok: true, episodes };
  }

  async createEpisode({
    id: podcastId,
    title,
    category
    
  }: CreateEpisodeDto): Promise<CoreOutput> {

    const { podcast, ok, error } = await this.getPodcast(podcastId);

    await this.episode.save(
      this.episode.create({
        title,
        category,
        podcast
      })
    );

    if (!ok) {
      return { ok, error };
    }

    return { ok: true };
  }

  async deleteEpisode({ podcastId, episodeId }: EpisodesSearchInput): Promise<CoreOutput> {
    const { error, ok } = await this.getEpisodes(podcastId);
    if (!ok) {
      return { ok, error };
    }

    await this.episode.delete(episodeId);
    return { ok };
  }

  async updateEpisode({
    podcastId,
    episodeId,
    ...rest
  }: UpdateEpisodeDto): Promise<CoreOutput> {
    // const { error, ok, episodes } = await this.getEpisodes(podcastId);
    const episode = await this.episode.findOne(episodeId);
    if (!episode) {
      return { ok:false, error:'Not Found Episode' };
    }

    if(rest.title !== ''){
      episode.title = rest.title;
    } 
    if(rest.category !== ''){
      episode.category = rest.category;
    } 

    await this.episode.save(episode);

    return { ok: true };
  }
}
