import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InstanceAxios } from './axiosInstance';
import { Response } from 'express';
interface BaseTag {
    /** ID тега для добавления. Важно передать или id или name. */
    id?: number;
    /** Название тега для добавления. Важно передать или id или name. */
    name?: string;
}

interface TagWithId extends BaseTag {
    id: number;
    name?: string;
}

interface TagWithName extends BaseTag {
    id?: number;
    name: string;
}

// обязательно одно из полей
type Tag = TagWithId | TagWithName;

interface EmbeddedContact {
    /** ID контакта */
    id: number;
    /** Флаг, показывающий, является контакт главным или нет */
    is_main?: string;
}

/** Модель компании, добавляемой к сделке. */
interface EmbeddedCompany {
    /** ID компании */
    id: number;
}

interface EmbeddedSource {
    /** Внешний ID источника. Источник можно добавить с помощью API Источников.
     * Если передан external_id источника и не передан pipeline_id,
     * сделка будет добавлена в воронку, в которой находится источник. */
    externail_id: number;
    /** Тип источника. Для сделок, добавляемых интеграциями, поддерживается только `widget` */
    type: string;
}

interface Embedded {
    /** Данные тегов */
    tags: Array<Tag> | null;
}

interface LeadEmbedded {
    /** Данные тегов, добавляемых к сделке */
    tags: Array<Tag> | null;
    /* 	Данные контактов, которые будет прикреплены к сделке */
    contacts?: Array<EmbeddedContact>;
    /** Данные компании, которая будет прикреплена к сделке */
    companies?: Array<EmbeddedCompany>; //
    source?: EmbeddedSource;
}

export interface Lead {
    /** Название сделки. */
    name?: string;
    /** Бюджет сделки. */
    price?: number;
    /** ID статуса, в который добавляется сделка., по-умолчанию – первый этап главной воронки */
    status_id?: number;
    /** ID воронки, в которую добавляется сделка. */
    pipeline_id?: number;
    /** ID пользователя, создающий сделку. При передаче значения 0, сделка будет считаться созданной роботом. */
    created_by?: number;
    /** ID пользователя, изменяющий сделку. При передаче значения 0, сделка будет считаться измененной роботом. */
    updated_by?: number;
    /** Дата закрытия сделки, передается в Unix Timestamp. */
    closed_at?: number;
    /** Дата создания сделки, передается в Unix Timestamp. */
    created_at?: number;
    /** Дата изменения сделки, передается в Unix Timestamp. */
    updated_at?: number;
    /** ID причины отказа. */
    loss_reason_id?: number;
    /** ID пользователя, ответственного за сделку. */
    responsible_user_id?: number;
    /** Массив, содержащий информацию по дополнительным полям, заданным для данной сделки.*/
    custom_fields_values?: Array<any>;
    /** Массив тегов для добавления. */
    tags_to_add?: Array<Tag>;
    /** Данные вложенных сущностей, при создании и редактировании можно передать только теги. */
    _embedded?: LeadEmbedded;
}

export interface Contact {
    /** 	Название контакта */
    name?: string;
    /** Имя контакта */
    first_name?: string;
    /** Фамилия контакта */
    last_name?: string;
    /** ID пользователя, ответственного за контакт */
    responsible_user_id?: number;
    /** ID пользователя, создавший контакт */
    created_by?: number;
    /** ID пользователя, изменивший контакт */
    updated_by?: number;
    /** Дата создания контакта, передается в Unix Timestamp */
    created_at?: number;
    /** Дата изменения контакта, передается в Unix Timestamp */
    updated_at?: number;
    /** Массив, содержащий информацию по значениям дополнительных полей, заданных для данного контакта */
    custom_fields_values?: Array<any>;
    /** Массив тегов для добавления. */
    tags_to_add?: Array<Tag>;
    /** Данные вложенных сущностей */
    _embedded?: Embedded;
    /** Поле, которое вернется вам в ответе без изменений и не будет сохранено. */
    request_id?: string;
}

export interface Company {
    /** Название компании */
    name?: string;
    /** ID пользователя, ответственного за компанию */
    responsible_user_id?: number;
    /** ID пользователя, создавшего компанию */
    created_by?: number;
    /** ID пользователя, изменившего компанию */
    updated_by?: number;
    /** Дата создания компании, передается в Unix Timestamp */
    created_at?: number;
    /** Дата изменения компании, передается в Unix Timestamp */
    updated_at?: number;
    /** Массив, содержащий информацию по значениям дополнительных полей, заданных для данной компании. */
    custom_fields_values?: Array<any>;
    /** Массив тегов для добавления. */
    tags_to_add?: Array<Tag>;
    /** Данные вложенных сущностей */
    _embedded?: Embedded;
    /** Поле, которое вернется вам в ответе без изменений и не будет сохранено. */
    request_id?: string;
}

export enum EntityType {
    Leads = 'leads',
    Companies = 'companies',
    Contacts = 'contacts'
}

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello!';
    }

    async createEntity(type: EntityType, res: Response, entities: Array<Lead|Company|Contact>) {
        try {
            const url = `/api/v4/${type}`;

            // отправляем полученные сделки
            const response = await InstanceAxios.instance.post(url, entities);

            // полученный статус устанавливаем как статус ответа
            res.status(response.status)
            if(response.status === 200) {
                // если статус 200 возвращаем только идентификаторы
                const { [type]:entities } = response.data?._embedded || {}
                return entities.map((item: { id: number; }) => item.id);
            } else {
                // в остальных случаях данные полностью
                return response.data;
            }
        } catch (error) {
            // в случае, если статус не 2ХХ
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
