import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { LeadsController } from './controllers/leads.controller';
import { ContactsController } from './controllers/contacts.controller';
import { CompaniesController } from './controllers/companies.controller';

@Module({
    imports: [],
    controllers: [
        AppController,
        LeadsController,
        ContactsController,
        CompaniesController,
    ],
    providers: [AppService],
})
export class AppModule {}
