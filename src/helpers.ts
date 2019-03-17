import {IAccount, IGCloudStoreDB, IGreenLockCertOptions, IKeypair} from './interfaces';
import * as crypto from "crypto";
import {Storage} from '@google-cloud/storage';
import * as fs from "fs";
import {GCloudStorageOptions} from './GCloudStorageOptions';

export class db {
  
  async setAccountKeyPair(accountId: string, keyPair: IKeypair) {
    let dbFile = await readCloudFile();
    dbFile.accountKeypairs[accountId] = keyPair;
    return (await saveCloudFile(dbFile)).accountKeypairs[accountId];
  }
  
  async getAccountKeyPair(accountId: string): Promise<IKeypair> {
    let dbFile = await readCloudFile();
    return dbFile.accountKeypairs[accountId];
  }
  
  async setAccountIndices(accountId: string, ...others: string[]) {
    let dbFile = await readCloudFile();
    
    if (others && others.length > 0) {
      others.map(v => {
        dbFile.accountIndices[v] = accountId;
      })
    }
    
    dbFile.accountIndices[accountId] = accountId;
    return (await saveCloudFile(dbFile)).accountIndices[accountId];
  }
  
  async getAccountIndices(value: string): Promise<string> {
    let dbFile = await readCloudFile();
    return dbFile.accountIndices[value];
  }
  
  
  async setAccount(accountId: string, account: IAccount): Promise<IAccount> {
    let dbFile = await readCloudFile();
    dbFile.accounts[accountId] = account;
    return (await saveCloudFile(dbFile)).accounts[accountId];
  }
  
  async getAccount(accountId: string): Promise<IAccount> {
    let dbFile = await readCloudFile();
    return dbFile.accounts[accountId];
  }
  
  
  async setAccountCerts(accountId: string, data: any): Promise<IGreenLockCertOptions> {
    let dbFile = await readCloudFile();
    dbFile.accountCerts[accountId] = data;
    return (await saveCloudFile(dbFile)).accountCerts[accountId];
  }
  
  async getAccountCerts(accountId: string) {
    let dbFile = await readCloudFile();
    return dbFile.accountCerts[accountId];
  }
  
  async setCertificates(id: string, cert: IGreenLockCertOptions): Promise<IGreenLockCertOptions> {
    let dbFile = await readCloudFile();
    dbFile.certificates[id] = cert;
    return (await saveCloudFile(dbFile)).certificates[id];
  }
  
  async getCertificates(id: string): Promise<IGreenLockCertOptions> {
    let dbFile = await readCloudFile();
    return dbFile.certificates[id];
  }
  
  
  async setCertIndices(accountId: string, ...others: string[]) {
    let dbFile = await readCloudFile();
    
    dbFile.certIndices[accountId] = accountId;
    if (others && others.length > 0) {
      others.map(v => {
        dbFile.certIndices[v] = accountId;
      })
    }
    
    await saveCloudFile(dbFile);
    return accountId;
  }
  
  async getCertIndices(value: string): Promise<string> {
    let dbFile = await readCloudFile();
    return dbFile.certIndices[value];
  }
  
  async setCertKeyPair(accountId: string, keyPair: IKeypair) {
    let dbFile = await readCloudFile();
    dbFile.certKeypairs[accountId] = keyPair;
    return (await saveCloudFile(dbFile)).certKeypairs[accountId];
  }
  
  async getCertKeyPair(accountId: string): Promise<IKeypair> {
    let dbFile = await readCloudFile();
    return dbFile.certKeypairs[accountId];
  }
  
}

export function createAccountIdFromPublicKey(keyPair: Partial<IKeypair>) {
  return crypto.createHash('sha256').update(keyPair.publicKeyPem).digest('hex');
}

export function readCloudFile(): Promise<IGCloudStoreDB> {
  return new Promise(async (resolve) => {
    let buffer = '';
    const storage = new Storage({
      projectId: GCloudStorageOptions.projectId,
      keyFilename: GCloudStorageOptions.keyFilename
    });
    const exists = (await storage.bucket(GCloudStorageOptions.bucketName).file(GCloudStorageOptions.dbFileName).exists())[0];
    if (exists) {
      storage.bucket(GCloudStorageOptions.bucketName).file(GCloudStorageOptions.dbFileName)
        .createReadStream().on('data', d => buffer += d)
        .on('end', () => {
          resolve(JSON.parse(buffer));
        });
    } else {
      resolve({
        accountKeypairs: {},
        certificateKeypairs: {},
        accountIndices: {},
        certIndices: {},
        certificates: {},
        accounts: {},
        accountCerts: {},
        certKeypairs: {}
      } as any);
    }
  })
}

export async function saveCloudFile(dataObj: IGCloudStoreDB): Promise<IGCloudStoreDB> {
  fs.writeFileSync(GCloudStorageOptions.dbFileName, JSON.stringify(dataObj), {encoding: 'utf-8'});
  const storage = new Storage({
    projectId: GCloudStorageOptions.projectId,
    keyFilename: GCloudStorageOptions.keyFilename
  });
  await storage.bucket(GCloudStorageOptions.bucketName).upload(GCloudStorageOptions.dbFileName);
  fs.unlinkSync(GCloudStorageOptions.dbFileName);
  return dataObj;
}
