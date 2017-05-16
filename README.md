# supplier
Supplier Microservice

This currently provides backend api and react components using the backend.
The components are being embedded in bnp service frontend SPA.

## Deployment
### Swarm
```
docker service create --publish mode=host,target=3001,published=3001 --dns-search service.consul --env NODE_ENV=production --env SERVICE_NAME=supplier --env PORT=3001 --env SERVICE_TAGS=kong --env SERVICE_3001_CHECK_HTTP=/api/suppliers --env SERVICE_3001_CHECK_INTERVAL=15s --env SERVICE_3001_CHECK_TIMEOUT=3s opuscapita/supplier:latest
```

## React Components
There are four react components. Look at how to use them [here](/wiki/rest-doc/Suppliers.react_components.md)

### Integration in Other Services

The react components are compiled and bundled into a library called `supplier` using webpack, with the help of the it's `externals` option. Integrate the library into your service as follows:

- Add supplier as an `externals` to your webpack config:

  ```
  externals: {
   'supplier': 'supplier',
  }
  ```
- Include bundle of supplier in the body tag of your main html:

  ```html
  <script type="application/javascript" src="/supplier/static/bundle.js"></script>
  ```

Read more about webpack externals [here](https://webpack.js.org/configuration/externals/)
