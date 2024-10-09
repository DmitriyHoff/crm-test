import { Controller, Post, Body, Res, HttpException, HttpStatus } from '@nestjs/common';
import { AppService, Contact } from '../app.service';
import { InstanceAxios } from 'src/axiosInstance';
import type { Response } from 'express'

@Controller('contacts')
export class ContactsController {
    constructor(private readonly appService: AppService) {}

    @Post()
    async createContact(@Body() contacts: Array<Contact>, @Res({ passthrough: true }) res: Response): Promise<string> {
        try {
            // отправляем полученные сделки
            const response = await InstanceAxios.instance
                .post('/api/v4/contacts', contacts);

            // полученный статус устанавливаем как статус ответа
            // и отправляем полученные данные
            res.status(response.status)
            return response.data;
        } catch (error) {
            // в случае, если статус не 200
            if(error.response) {
                // полученный статус устанавливаем как статус ответа
                // и отправляем полученные данные
                res.status(error.response.status)
                return error.response.data;
            }
            // в остальных случаях отправим статус 500
            console.log(error);
            throw new HttpException(
                'Internal Server error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
