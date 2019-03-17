import {IGreenLockOptions} from '../interfaces';
import {createAccountIdFromPublicKey, db} from '../helpers';

export function accountCheck(opts: IGreenLockOptions, cb) {
  // opts.email // optional
  // opts.accountId // optional
  // opts.domains // optional
  
  (async () => {
    let index;
    let accountId;
    let account;
    
    if (opts.accountId) {
      index = opts.accountId;
    } else if (opts.keypair && opts.keypair.publicKeyPem) {
      index = createAccountIdFromPublicKey(opts.keypair);
    } else if (opts.email) {
      index = opts.email;
    } else if (opts.domains && opts.domains[0]) {
      index = opts.domains[0];
    } else {
      cb(new Error("MUST supply email or keypair.publicKeyPem or keypair.publicKeyJwk"));
      return;
    }
    
    accountId = await new db().getAccountIndices(index);
    if (!accountId) {
      cb(null, null);
      return;
    }
    
    account = await new db().getAccount(accountId);
    account.keypair = await new db().getAccountKeyPair(accountId);
    
    cb(null, account);
  })()
}
