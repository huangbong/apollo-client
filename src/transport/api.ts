import { JsonTransport } from './http/json';
import { HttpTransport } from './http/index';

export interface Api {
  uri: string;
  query(request: any, options: any): Promise<Response>;
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
}
