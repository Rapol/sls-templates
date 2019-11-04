# sls-reusable-apim

> Deployes two serverless projects that reuse a previously deployed APIM

## Guide


## Installation

Run `npm i`

## Deployment

If using rbac, make sure the following environment variables are set:

```
AZURE_SUBSCRIPTION_ID
AZURE_TENANT_ID
AZURE_CLIENT_ID
AZURE_CLIENT_SECRET
```

If not, sls will ask you to login to the portal.

Before deploying you must update the package.json scripts to use the correct resource groups and subscribtion id 

`"azure:deploy:cats": "SLS_DEBUG=* sls deploy --config serverless-cats.yml --rg EDIT_ME --subid EDIT_ME",`
Update EDIT_ME accordingly

To deploy both service, run the following commands indepdently:

```
npm run azure:deploy:cats
npm run azure:deploy:dogs
```