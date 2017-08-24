import { JsonTransport } from './http/json';
import { FilterInterface, HttpTransport } from './http/index';

export interface Api {
  uri: string;
  query(request: any, options: any): Promise<Response>;
  addFilter(filter: FilterInterface): Api;
  removeFilter(filter: FilterInterface): Api;
}

export class JsonAPI implements Api {
  public uri: string;
  private transport: HttpTransport;

  constructor(uri: string, transport = new JsonTransport(null)) {
    this.uri = uri;
    this.transport = transport;
  }

  public query(request: any, options: any): Promise<Response> {
    return this.transport.request(
      this.uri,
      'POST',
      null,
      {
        ...options,
        headers: {
          Accept: '*/*',
          ...options.headers as { [headerName: string]: string },
        },
      },
      JSON.stringify(request),
    );
  }

  public addFilter(filter: FilterInterface): Api {
    this.transport.addFilter(filter);
    return this;
  }

  public removeFilter(filter: FilterInterface): Api {
    this.transport.removeFilter(filter);
    return this;
  }
}
