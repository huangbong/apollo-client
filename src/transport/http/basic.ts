import 'whatwg-fetch';
import * as utils from './utils';
import { HttpTransport, FilterInterface } from './index';

export class BasicTransport implements HttpTransport {
  public _uri: string | null;
  public _filterChain: Function[];
  public _opts: RequestInit;
  constructor(baseUrl: string | null, opts: RequestInit = {}) {
    this._uri = baseUrl;
    this._opts = opts;
    this._filterChain = [];
  }
  public addFilter(filter: FilterInterface): HttpTransport {
    this._filterChain.push(filter);
    return this;
  }
  public removeFilter(filter: FilterInterface): HttpTransport {
    let index = this._filterChain.indexOf(filter);
    if (index !== -1) {
      this._filterChain.splice(index, 1);
    }
    return this;
  }
  public get(url: string, params: any, init: any): Promise<Response> {
    return this.request(url, 'GET', params, init);
  }
  public post(url: string, entity: any, init: any): Promise<Response> {
    return this.request(url, 'POST', null, init, entity);
  }
  public put(url: string, entity: any, init: any): Promise<Response> {
    return this.request(url, 'PUT', null, init, entity);
  }
  public patch(url: string, entity: any, init: any) {
    return this.request(url, 'PATCH', null, init, entity);
  }
  public del(url: string, init: any) {
    return this.request(url, 'DELETE', null, init);
  }
  public request(
    url: string,
    method: string,
    params: any,
    init: any,
    entity?: any,
  ) {
    init = {
      ...this._opts,
      ...init,
    };
    init.method = method;
    if (!init.hasOwnProperty('headers')) {
      init.headers = new Headers();
    }
    if (!init.headers.has('Content-Type')) {
      if (init.method === 'GET') {
        init.headers.set('Content-Type', 'text/plain;charset=UTF-8');
      } else if (['POST', 'PUT', 'PATCH'].indexOf(init.method) !== -1) {
        init.headers.set('Content-Type', 'application/x-www-form-urlencoded');
      }
    }
    if (params) {
      url += `?${utils.queryString(params)}`;
    }
    if (entity) {
      if (entity instanceof FormData || typeof entity === 'string') {
        init.body = entity;
      } else {
        if (
          init.headers.get('Content-Type') ===
          'application/x-www-form-urlencoded'
        ) {
          init.body = utils.queryString(entity);
        } else if (init.headers.get('Content-Type') === 'application/json') {
          init.body = JSON.stringify(entity);
        } else {
          init.body = entity;
        }
      }
    }
    if (typeof url === 'string' && !utils.isURL(url) && this._uri) {
      url = utils.joinPaths([this._uri, url]);
    }
    return this._request(new Request(url, init));
  }
  public resendRequest(request: Request): Promise<Response> {
    return this._request(request.clone());
  }
  private _request(request: Request): Promise<Response> {
    return this._filterChain.reduce((acc: Function, next: FilterInterface) => {
      return (modifiedRequest: Request) =>
        next.apply(this, [modifiedRequest, acc]);
    }, fetch)(request);
  }
}
