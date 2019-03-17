import {IGreenLockOptions, IKeypair} from '../interfaces';
import {createAccountIdFromPublicKey, db} from '../helpers';

export function accountSetKeypair(opts: IGreenLockOptions, keypair: IKeypair, cb) {
  (async () => {
    if (!opts.email) {
      cb(new Error("MUST use email when setting Keypair"));
      return;
    }
    
    if (!keypair.privateKeyJwk) {
      cb(new Error("MUST use privateKeyJwk when setting Keypair"));
      return;
    }
    if (!keypair.privateKeyPem) {
      cb(new Error("MUST use privateKeyPem when setting Keypair"));
      return;
    }
    if (!keypair.publicKeyPem) {
      cb(new Error("MUST use publicKeyPem when setting Keypair"));
      return;
    }
    
    let accountId = createAccountIdFromPublicKey(keypair);
    
    await new db().setAccountIndices(accountId, opts.email, opts.domains[0]);
    await new db().setAccountKeyPair(accountId, keypair);
    
    cb(null, keypair);
  })();
}
