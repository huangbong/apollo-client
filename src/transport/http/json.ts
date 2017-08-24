import { BasicTransport } from './basic';

export class JsonTransport extends BasicTransport {
  public request(
    url: string,
    method: string,
    params: any,
    init: any,
    entity?: any,
  ) {
    init = init || {};
    if (!init.hasOwnProperty('headers')) {
      init.headers = new Headers();
    }
    if (!init.headers.has('Content-Type')) {
      init.headers.set('Content-Type', 'application/json');
    }
    if (entity && typeof entity !== 'string') {
      entity = JSON.stringify(entity);
    }
    return super.request(url, method, params, init, entity);
  }
}
