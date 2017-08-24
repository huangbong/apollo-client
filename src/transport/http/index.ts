import { BasicTransport } from './basic';
import { JsonTransport } from './json';
export interface FilterInterface {
  (this: HttpTransport, request: Request, next: Function): Promise<Response>;
}
export interface HttpTransport {
  addFilter(filter: FilterInterface): HttpTransport;
  removeFilter(filter: FilterInterface): HttpTransport;
  request(
    url: string,
    method: string,
    params: any,
    init: any,
    entity: any,
  ): Promise<Response>;
}
export { BasicTransport, JsonTransport };
