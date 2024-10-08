import { Controller, Post, Body } from '@nestjs/common';
import { AppService, Lead } from '../app.service';

@Controller('leads')
export class LeadsController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createLead(@Body() lead: Lead): string {
    return this.appService.createLead(lead);
  }
}
