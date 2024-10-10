import { Controller, Post, Body, Res } from '@nestjs/common';
import { AppService, Contact, EntityType } from '../app.service';
import type { Response } from 'express'

@Controller('contacts')
export class ContactsController {
    constructor(private readonly appService: AppService) {}

    @Post()
    async createContact(@Body() contacts: Array<Contact>, @Res({ passthrough: true }) res: Response): Promise<string> {
        return await this.appService.createEntity(EntityType.Contacts, res, contacts);
    }
}
