import {IGreenLockOptions} from '../interfaces';
import {createAccountIdFromPublicKey, db} from '../helpers';

export function accountSet(opts: IGreenLockOptions, reg: IGreenLockOptions, cb) {
  // opts.email
  // reg.keypair
  // reg.receipt // response from acme server
  (async () => {
    let keypair = reg.keypair || opts.keypair;
    let accountId;
    let index;
    
    if (keypair.publicKeyPem) {
      index = createAccountIdFromPublicKey(keypair);
    } else if (opts.email) {
      index = opts.email;
    } else {
      cb(new Error("MUST supply email or keypair.publicKeyPem or keypair.publicKeyJwk"));
      return;
    }
    
    accountId = await new db().getAccountIndices(index) || createAccountIdFromPublicKey(keypair);
    
    if (!accountId) {
      cb(new Error("keypair was not previously set with email and keypair.publicKeyPem"));
      return;
    }
    
    const account = await new db().setAccount(accountId, {
      id: accountId,
      accountId: accountId,
      email: opts.email,
      keypair: keypair,
      agreeTos: opts.agreeTos || reg.agreeTos,
      ...reg
    });
    
    cb(null, account);
  })();
}
