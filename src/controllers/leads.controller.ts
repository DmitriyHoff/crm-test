import { Controller, Post, Body, Res } from '@nestjs/common';
import { AppService, EntityType, Lead } from '../app.service';
import type { Response } from 'express'

@Controller('leads')
export class LeadsController {
    constructor(private readonly appService: AppService) {}

    @Post()
    async createLead(@Body() leads: Array<Lead>, @Res({ passthrough: true }) res: Response): Promise<string> {
        return await this.appService.createEntity(EntityType.Leads, res, leads);
    }
}

