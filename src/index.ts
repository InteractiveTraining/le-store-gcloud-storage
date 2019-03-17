import {accountSetKeypair} from './accounts/accountSetKeypair';
import {accountCheckKeypair} from './accounts/accountCheckKeypair';
import {accountCheck} from './accounts/accountCheck';
import {accountSet} from './accounts/accountSet';
import {certificateSetKeypair} from './certificates/certificateSetKeypair';
import {certificateCheckKeypair} from './certificates/certificateCheckKeypair';
import {certificateCheck} from './certificates/certificateCheck';
import {certificateSet} from './certificates/certificateSet';
import {GCloudStorageOptions} from './GCloudStorageOptions';
import {IGCloudStoreOptions} from './interfaces';

export function GCloudStoreCreate(config: IGCloudStoreOptions) {
  
  if (!config || (config && (!config.bucketName || !config.dbFileName || !config.keyFilename || !config.projectId))) {
    throw new Error('le-store-gcloud-storage requires bucketName, projectId, keyFilename, and dbFileName.');
  }
  
  Object.keys(config).forEach((key) => {
    GCloudStorageOptions[key] = config[key];
  });
  
  return {
    getOptions: function () {
      return config;
    },
    accounts: {
      setKeypair: accountSetKeypair,
      checkKeypair: accountCheckKeypair,
      check: accountCheck,
      set: accountSet
    },
    certificates: {
      setKeypair: certificateSetKeypair,
      checkKeypair: certificateCheckKeypair,
      check: certificateCheck,
      set: certificateSet
    }
  }
}

