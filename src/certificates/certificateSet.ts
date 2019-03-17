import {IGreenLockOptions} from '../interfaces';
import {db} from '../helpers';

export function certificateSet(opts: IGreenLockOptions, cb) {
  (async () => {
    // opts.domains
    // opts.email // optional
    // opts.accountId // optional
    
    // opts.certs.privkey
    // opts.certs.cert
    // opts.certs.chain
    
    let index;
    let accountId;
    let account;
    let certs = opts.certs;
    let subject = certs.subject || opts.domains[0];
    let altnames = certs.altnames || opts.domains;
    let accountCerts;
    
    if (opts.domains[0]) {
      index = opts.domains[0];
    } else if (opts.accountId) {
      index = opts.accountId;
    } else if (opts.email) {
      index = opts.email;
    } else {
      cb(new Error("MUST supply email or accountId"));
      return;
    }
    
    
    await new db().setCertIndices(subject, ...altnames);
    
    await new db().setAccountCerts(subject, certs);
    
    await new db().setCertificates(subject, certs);
    
    // SAVE to the database, index the email address, the accountId, and alias the domains
    cb(null, certs);
  })();
}
