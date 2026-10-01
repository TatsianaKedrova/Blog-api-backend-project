export class ApiCallsDBType {
  public ip: string;
  public url: string;
  public date: Date;
  constructor(ip: string, url: string, date: Date) {
    this.ip = ip;
    this.date = date;
    this.url = url;
  }
}
