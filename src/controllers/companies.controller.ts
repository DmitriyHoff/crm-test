import { Controller, Post, Body } from '@nestjs/common';
import { AppService, Company } from '../app.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createCompany(@Body() company: Company) {
    return this.appService.createCompany(company);
  }
}
