import {IGreenLockOptions, IKeypair} from '../interfaces';
import {db} from '../helpers';

export function certificateSetKeypair(opts: IGreenLockOptions, keypair: IKeypair, cb) {
  (async () => {
    // opts.domains
    
    if (!opts.domains || !opts.domains.length) {
      cb(new Error("MUST use domains when setting Keypair"));
      return;
    }
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
    
    
    let subject = opts.domains[0];
    
    await new db().setCertIndices(subject, ...opts.domains);
    
    let certKeyPair = await new db().setCertKeyPair(subject, keypair);
    
    cb(null, certKeyPair);
  })();
}
