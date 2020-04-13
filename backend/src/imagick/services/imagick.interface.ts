export interface IdentifyResult {
  width: number;
  height: number;
  format: string;
}

export interface ImagickInterface {

  resize(srcData: Buffer, width: number, height: number): Promise<Buffer>;

  thumbnail(srcData: Buffer, size: number): Promise<Buffer>;

  identify(srcData: Buffer): Promise<IdentifyResult>;

}
