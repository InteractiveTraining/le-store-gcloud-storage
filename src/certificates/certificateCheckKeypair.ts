import {IGreenLockOptions} from '../interfaces';
import {db} from '../helpers';

export function certificateCheckKeypair(opts: IGreenLockOptions, cb) {
  (async () => {
    // opts.domains
    if (!opts.domains || !opts.domains.length) {
      cb(new Error("MUST use domains when checking Keypair"));
      return;
    }
    
    let domain = opts.domains[0];
    let keyPair = await new db().getCertKeyPair(domain);
    
    cb(null, keyPair);
  })();
}
