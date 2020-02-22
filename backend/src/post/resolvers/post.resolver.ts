import { Resolver, Query, Args, ResolveProperty } from '@nestjs/graphql';
import { PostSearcher } from '../services/post-searcher';
import { Post } from '../schema/post.schema';
import { AppConfig } from 'src/common/app-config/app-config';
import { ObjectID } from 'bson';
import { TagService } from 'src/tag/services/tag.service';

@Resolver('Post')
export class PostResolver {

  constructor(private readonly PostServer: PostSearcher,
    private readonly TagService: TagService,
    private readonly AppConfig: AppConfig) {}

  @ResolveProperty()
  id(post: Post) {
    return post._id;
  }

  @ResolveProperty()
  imageUrl(post: Post) {
    return this.buildImageUrl(post, 'image');
  }

  @ResolveProperty()
  sampleUrl(post: Post) {
    if (post.sampleWidth) {
      return this.buildImageUrl(post, 'sample');
    } else {
      return this.imageUrl(post);
    }
  }

  @ResolveProperty()
  sampleWidth(post: Post) {
    return post.width;
  }

  @ResolveProperty()
  sampleHeight(post: Post) {
    return post.height;
  }

  @ResolveProperty()
  previewUrl(post: Post) {
    return this.buildImageUrl(post, 'preview');
  }

  @ResolveProperty()
  thumbnailUrl(post: Post) {
    return this.buildImageUrl(post, 'thumbnail');
  }

  @ResolveProperty()
  tags(post: Post) {
    return this.TagService.findAll(post.tags);
  }

  @Query()
  async posts(@Args('first') first: number,
    @Args('page') page: number,
    @Args('query') query: string) {

    const posts = await this.PostServer.search(first, query, page);

    return {
      edges: posts.map(p => ({
        node: p
      }))
    };
  }

  @Query()
  post(@Args('id') id: ObjectID) {
    return this.PostServer.findById(id);
  }

  private buildImageUrl(post: Post, type: string) {
    return `${this.AppConfig.env.URL}/image/${type}/${post.md5}.jpg`;
  }
}
