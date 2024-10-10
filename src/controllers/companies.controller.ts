import { Controller, Post, Body, Res } from '@nestjs/common';
import { AppService, Company, EntityType } from '../app.service';
import type { Response } from 'express'

@Controller('companies')
export class CompaniesController {
    constructor(private readonly appService: AppService) {}

    @Post()
    async createCompany(@Body() companies: Array<Company>, @Res({ passthrough: true }) res: Response): Promise<string> {
        return await this.appService.createEntity(EntityType.Companies, res, companies);
    }
}
