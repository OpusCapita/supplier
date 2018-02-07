# supplier
Supplier Microservice

This currently provides backend api and react components using the backend.
The components are being embedded in bnp service frontend SPA.

## Development
### Running application

In supplier directory, run `docker-compose up`. After it is up and running, go to `localhost:8080/supplier` in browser.

## Deployment
### Swarm
```
docker service create --name supplier --log-driver gelf --log-opt gelf-address=udp://10.0.0.12:12201 --log-opt tag="supplier" --publish mode=host,target=3001,published=3001 --dns-search service.consul --env NODE_ENV=production --env SERVICE_NAME=supplier --env PORT=3001 --env SERVICE_TAGS=kong --env SERVICE_3001_CHECK_HTTP=/api/suppliers --env SERVICE_3001_CHECK_INTERVAL=15s --env SERVICE_3001_CHECK_TIMEOUT=3s opuscapita/supplier:dev
```

## React Components
There are four react components. Look at how to use them [here](/Suppliers.react_components.md)

The react components are compiled and bundled into libraries using webpack. These are:

| Component | Library Name | Bundle name |
|:-----|:----:|:--------:|
| SupplierRegistrationEditor | supplier-registration | registration-bundle |
| SupplierEditor | supplier-information | information-bundle |
| SupplierContactEditor | supplier-contact | contact-bundle |
| SupplierAddressEditor | supplier-address | address-bundle |

# Integration of a Service in Other Services

Libraries are dynamically loaded to Integrate the library into your service as follows:

## Config

- Add `scriptjs` as a dependcy in your `package.json` file, if not there.

- Make sure the output filename in webpack config of the library you are adding has prefix `components`, i.e. `components/bundle.js`.

- Add [opuscapita react-loaders](https://github.com/OpusCapita/react-loaders) to your `package.json` file - `"@opuscapita/react-loaders": "^0.1.5"`.

## Usage

- Import serviceComponent: `import serviceComponent from '@opuscapita/react-loaders/lib/serviceComponent';`.

- Preload the component using serviceCompment by adding the following to your `componentWillMount` function. For example:

  ```
  let serviceRegistry = (service) => ({ url: `http://localhost:3000/isodata` });
    const CountryField = serviceComponent({ serviceRegistry, serviceName: 'isodata' , moduleName: 'isodata-countries', jsFileName: 'countries-bundle' });

    this.externalComponents = { CountryField };
  ```

- Use the component as follows in your `render` function:

  ```
  const { CountryField } = this.externalComponents;

  ...

  <CountryField ... />
  ```


# Different versions for embeded services:

## Case studies

### React

- Minor version difference (e.g. react v15.4.2 and react v15.5.4) not a problem. Works fine.
- Major version difference a problem, because some for example some components of the new version which does not exist in the old version can be used.

### underscore

- Minor version difference (e.g. 1.8.3 and 1.6.0) not a problem. Works fine.
- Minor version difference (e.g. 1.8.3 and 0.6.0) not a problem. Works fine.

This post on [understanding npm dependency model](https://lexi-lambda.github.io/blog/2016/08/24/understanding-the-npm-dependency-model/) explains in detail how npm manages different versions and when it would result in problems as the case of React.

# Building Multi-part Library

Mult-part libraries can be built with webpack. See example [here](https://github.com/OpusCapita/supplier/blob/develop/webpack.production.config.js).

## Usage

`import (component) from 'supplier-alpha'` for `supplier-alpha` and `import (component) from 'supplier-beta'` for `supplier-beta`.


# CSS and Integration of Services

## Same CSS class names and/or ids in Services

When `css` is bundled with `webpack`, it does not scope the CSS classes to the scope of the bundle, so styles defined in both services having the same CSS class name or id will conflict.

A solution will be to scope/prefix all custom CSS class names and ids with the service name.
