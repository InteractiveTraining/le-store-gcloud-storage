import {IGreenLockOptions} from '../interfaces';
import {createAccountIdFromPublicKey, db} from '../helpers';

export function accountCheckKeypair(opts: IGreenLockOptions, cb) {
  (async () => {
    let accountId;
    
    if ((opts.keypair && opts.keypair.publicKeyPem) || opts.email) {
      if (opts.email) {
        accountId = await new db().getAccountIndices(opts.email);
      } else {
        accountId = createAccountIdFromPublicKey(opts.keypair);
      }
    } else {
      cb(new Error("MUST supply email or keypair.publicKeyPem or keypair.publicKeyJwk"));
      return;
    }
    
    const accountKeyPair = await new db().getAccountKeyPair(accountId);
    
    cb(null, accountKeyPair);
  })();
}
