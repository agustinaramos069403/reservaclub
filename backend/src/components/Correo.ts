export interface Correo {
  send(noticeType: string, recipient: string, instant: Date): void;
}

export class FakeCorreo implements Correo {
  send(_noticeType: string, _recipient: string, _instant: Date): void {
    // No-op: does not connect to a real email server.
  }
}
