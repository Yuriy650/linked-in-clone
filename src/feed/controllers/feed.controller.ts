import {Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards} from '@nestjs/common';
import {FeedService} from "../services/feed.service";
import {FeedPost} from "../models/post.interface";
import {Observable} from "rxjs";
import {DeleteResult, UpdateResult} from "typeorm";
import {JwtGuard} from "../../auth/guards/jwt.guard";
import {Roles} from "../../auth/decorators/roles.decorator";
import {Role} from "../../auth/models/role.enum";
import {RolesGuard} from "../../auth/guards/roles.guard";
import {IsCreatorGuard} from "../guards/is-creator.guard";

@Controller('feed')
export class FeedController {
    constructor(private feedService: FeedService) {
    }

    @Roles(Role.ADMIN, Role.PREMIUM, Role.USER)
    @UseGuards(JwtGuard, RolesGuard)
    @Post()
    create(@Body() post: FeedPost, @Request() req): Observable<FeedPost> {
        return this.feedService.createPost(post, req.user);
    }

    /*@Get()
    getAll(): Observable<FeedPost[]> {
        return this.feedService.findAll();
    }*/

    @Get()
    findSelectedPost(@Query('take') take: number = 1, @Query('skip') skip: number = 1): Observable<FeedPost[]> {
        take = take > 20 ? 20 : take;
        return this.feedService.findPosts(take, skip);
    }

    @UseGuards(JwtGuard, IsCreatorGuard)
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() feedPost: FeedPost): Observable<UpdateResult> {
        return this.feedService.updatePost(id, feedPost)
    }

    @UseGuards(JwtGuard, IsCreatorGuard)
    @Delete(':id')
    delete(
        @Param('id') id: number
    ): Observable<DeleteResult> {
        return this.feedService.deleteOnePost(id);
    }

    @UseGuards(JwtGuard)
    @Get(':id')
    getCurrentPost(@Param('id') id: number): Observable<FeedPost> {
        return this.feedService.findPostById(id);
    }
}
