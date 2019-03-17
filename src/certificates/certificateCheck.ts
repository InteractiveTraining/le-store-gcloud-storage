import {IGreenLockOptions} from '../interfaces';
import {db} from '../helpers';

export function certificateCheck(opts: IGreenLockOptions, cb) {
  (async () => {
    // You will be provided one of these (which should be tried in this order)
    // opts.domains
    // opts.email // optional
    // opts.accountId // optional
    let subject;
    let subjects;
    
    if (opts.domains) {
      subject = await new db().getCertIndices(opts.domains[0]);
      const cert = await new db().getCertificates(subject);
      cb(null, cert);
      return;
    }
    
    let accountId = (opts.accountId) ? opts.accountId : (await new db().getAccountIndices(opts.email));
    
    subjects = (await new db().getAccountCerts(accountId)) || [];
    
    let returnCerts = [];
    
    await Promise.all(subjects.map(async (subject) => {
      subject = await new db().getCertIndices(subject);
      returnCerts.push(await new db().getCertificates(subject));
    }));
    
  
    cb(null, returnCerts);
    
  })();
}
