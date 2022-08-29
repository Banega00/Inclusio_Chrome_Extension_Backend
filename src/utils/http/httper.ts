import axios, { AxiosInstance, AxiosResponse } from "axios";
import fetch, { Response } from 'node-fetch'
export type HttpMethod =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK';

//AXIOS Implementation
export class Httper {

    private baseURL: string;

    private instance: AxiosInstance;
    constructor(baseURL: Httper['baseURL']) {
        this.baseURL = baseURL;
        this.instance = axios.create({
            baseURL: baseURL,
            headers: {
                'Content-type': 'application/json',
                Accept: 'application/json',
            }
        })
    }

    public async get<T = any>(path: string, headers?: { [key: string]: any }, queryParams?: { [key: string]: any }, options?: any):Promise<T>{
        const response = await this.sendRequest<T>(path, 'GET', null, headers, queryParams, options);
        return response.data;
    }

    public async post<T = any>(path: string, data:any , headers?: { [key: string]: any }, queryParams?: { [key: string]: any }, options?: any):Promise<T>{
        const response = await this.sendRequest<T>(path, 'POST', data, headers, queryParams, options);
        return response.data;
    }

    public async sendRequest<T>(path: string, method: HttpMethod, data?:any, headers?: { [key: string]: any }, queryParams?: { [key: string]: any }, options?: any ):Promise<AxiosResponse<T>> {

        const response:AxiosResponse<T> = await this.instance.request({
            url: path,
            method,
            data,
            headers: {
                ...(headers ?? {})
            },
            params: queryParams ?? {},
            ...(options ?? {})
        })
        return response;
    }

}

//Node-fetch implementation

// export class Httper {

//     private baseURL: string;

//     constructor(baseURL: Httper['baseURL']) {
//         this.baseURL = baseURL;
//     }

//     public async get<T = any>(path: string, headers?: { [key: string]: any }, queryParams?: { [key: string]: any }, options?: any):Promise<T>{
//         const response = await this.sendRequest<T>(path, 'GET', null, headers, queryParams, options);
//         return response.body as any;
//     }

//     public async post<T = any>(path: string, data:any , headers?: { [key: string]: any }, queryParams?: { [key: string]: any }, options?: any):Promise<T>{
//         const response = await this.sendRequest<T>(path, 'POST', data, headers, queryParams, options);
//         return response as any;
//     }

//     public async sendRequest<T>(path: string, method: HttpMethod, data?:any, headers?: { [key: string]: any }, queryParams?: { [key: string]: any }, options?: any ):Promise<any> {
//         const response = await fetch(`${this.baseURL}${path}`)

//         return await response.text();
//     }

// }