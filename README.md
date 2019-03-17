# le-store-gcloud-storage
**ALPHA** - USE AT YOUR OWN RISK - PRs are welcome!


```typescript
import {GCloudStoreCreate} from '@interactivetraining/le-store-gcloud-storage'

require('greenlock-express').create({
  store: GCloudStoreCreate({
    bucketName: 'my-certs',
    projectId: 'google-cloud-project-id',
    keyFilename: '/path/to/google-cloud-key-file.json',
    dbFileName: 'my-certs-db.json'
  })
}).listen(80, 443, () => console.log(`Listening...`));
```
