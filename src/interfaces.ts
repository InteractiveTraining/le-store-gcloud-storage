export interface IGCloudStoreOptions {
  bucketName: string;
  projectId: string;
  keyFilename: string;
  dbFileName: string;
}

export interface IKeypair {
  privateKeyJwk: any;
  publicKeyJwk: any;
  
  privateKeyPem: any;
  publicKeyPem: any;
}

export interface IGCloudStoreDB {
  certKeypairs: IKeypair[];
  accountKeypairs: IKeypair[];
  certificateKeypairs: any;
  accountIndices: any;
  certIndices: any;
  certificates: any;
  accounts: IAccount[];
  accountCerts: any;
}

export interface IGreenLockCertOptions {
  expires?: string;
  identifiers?: any[];
  cert?: any;
  chain?: any;
  privkey?: any;
  subject: string;
  altnames: string[];
  _issuedAt?: Date;
  _expiresAt?: Date;
  issuedAt?: number;
  expiresAt?: number;
}

export interface IGreenLockOptions {
  certs: IGreenLockCertOptions;
  agreeTos: boolean;
  accountId: string;
  email: string;
  keypair: IKeypair;
  domains: string[];
  getOptions: () => IGreenLockOptions;
  pems?: {
    cert: any;
    chain: any;
  }
}

export interface IAccount extends IGreenLockOptions {
  id: string;
}
