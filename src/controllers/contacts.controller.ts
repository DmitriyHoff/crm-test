import { Controller, Post, Body } from '@nestjs/common';
import { AppService, Contact } from '../app.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createContact(@Body() contact: Contact): string {
    return this.appService.createContact(contact);
  }
}
