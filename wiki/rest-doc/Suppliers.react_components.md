# Supplier Service (supplier) React Components Documentation

## Supplier Editor

### Props

| Name | Type | Required | Description |
|:-----|:----:|:--------:|------------:|
| supplierId | string | true | ID of Supplier |
| username | string | true | User (customer) name |
| userRoles | array | true | User (customer) roles |
| onUnauthorized | function | false | Callback fired when unauthorized |
| onChange | function | false | Callback fired on input change `(event) => {}` |
| onUpdate | function | false | Callback fired on supplier update `(supplier) => {}` |
| onLogout | function | false | Callback fired on logout |

### Context

| Name | Type | Required | Description |
|:-----|:----:|:--------:|------------:|
| i18n | object | true | internationalization fro translation |
| showNotification | function | false | UI notification |

### Basic Example

```
import { SupplierEditor } from 'supplier-information';

<SupplierEditor
  key='company'
  supplierId='hard001'
  username='Marlon Wayans'
  userRoles={['supplier-admin']}
/>
```

![supplier_editor_example](https://user-images.githubusercontent.com/1188617/33657873-eedafe1c-da7a-11e7-9594-4f4cac18d4f3.png)

## Supplier Registration Editor

### Props

| Name | Type | Required | Description |
|:-----|:----:|:--------:|------------:|
| supplier | object | false | Supplier object |
| user | object | true | User object. Should contain attributes `id`, `firstName`, `lastName` and `email` |
| onUnauthorized | function | false | Callback fired when unauthorized |
| onChange | function | false | Callback fired on input change `(event) => {}` |
| onUpdate | function | false | Callback fired on supplier create `(supplier) => {}` |
| onLogout | function | false | Callback fired on logout |

### Context

| Name | Type | Required | Description |
|:-----|:----:|:--------:|------------:|
| i18n | object | true | internationalization fro translation |
| showNotification | function | false | UI notification |

### Basic Example

```
import { SupplierRegistrationEditor } from 'supplier-registration';

const newSupplier = {
  supplierName: 'Test AG',
  cityOfRegistration: 'Hamburg',
  countryOfRegistration: 'DE',
  taxIdentificationNo: '123-343-12',
  vatIdentificationNo: 'DE72342359',
  dunsNo: '12345',
  commercialRegisterNo: 'HRB 12873243'
};

<SupplierRegistrationEditor
  key='company'
  supplier={newSupplier}
  user={{ id: 'john.doe@example.com', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' }}
/>
```

![supplier_registration_editor_example](https://user-images.githubusercontent.com/1188617/33658156-01b72028-da7c-11e7-9334-9c1330cd0a57.png)


## Supplier Address Editor

### Props

| Name | Type | Required | Description |
|:-----|:----:|:--------:|------------:|
| supplierId | string | true | ID of Supplier |
| username | string | true | User (customer) name |
| userRoles | array | true | User (customer) roles |
| onUnauthorized | function | false | Callback fired when unauthorized |
| onChange | function | false | Callback fired on input change `(event) => {}` |

### Context

| Name | Type | Required | Description |
|:-----|:----:|:--------:|------------:|
| i18n | object | true | internationalization fro translation |
| showNotification | function | false | UI notification |

### Basic Example

```
import { SupplierAddressEditor } from 'supplier-address';

<SupplierAddressEditor
  key='address'
  supplierId='hard001'
  username='Marlon Wayans'
  userRoles={['supplier-admin']}
/>
```

![supplier_address_editor_example](https://cloud.githubusercontent.com/assets/1188617/26353634/a8df8800-3fc1-11e7-8fc3-37fbff330805.png)

## Supplier Contact Editor

### Props

| Name | Type | Required | Description |
|:-----|:----:|:--------:|------------:|
| supplierId | string | true | ID of Supplier |
| username | string | true | User (customer) name |
| userRoles | array | true | User (customer) roles |
| onUnauthorized | function | false | Callback fired when unauthorized |
| onChange | function | false | Callback fired on input change `(event) => {}` |

### Context

| Name | Type | Required | Description |
|:-----|:----:|:--------:|------------:|
| i18n | object | true | internationalization fro translation |
| showNotification | function | false | UI notification |

### Basic Example

```
import { SupplierContactEditor } from 'supplier-contact';

<SupplierContactEditor
  key='contact'
  supplierId='hard001'
  username='Marlon Wayans'
  userRoles={['supplier-admin']}
/>
```

![supplier_contact_editor_example](https://user-images.githubusercontent.com/1188617/33658332-a724be12-da7c-11e7-9f81-fa47655e79e2.png)

## Supplier Bank Account Editor

### Props

| Name | Type | Required | Description |
|:-----|:----:|:--------:|------------:|
| supplierId | string | true | ID of Supplier |
| username | string | true | User (customer) name |
| userRoles | array | true | User (customer) roles |
| onUnauthorized | function | false | Callback fired when unauthorized |
| onChange | function | false | Callback fired on input change `(event) => {}` |

### Context

| Name | Type | Required | Description |
|:-----|:----:|:--------:|------------:|
| i18n | object | true | internationalization fro translation |
| showNotification | function | false | UI notification |

### Basic Example

```
import { SupplierBankAccountEditor } from 'supplier-bank_accounts';

<SupplierBankAccountEditor
  key='bank_account'
  supplierId='hard001'
  username='Marlon Wayans'
  userRoles={['supplier-admin']}
/>
```

![supplier_bank_account_editor_example](https://user-images.githubusercontent.com/1188617/33658738-0e6c4878-da7e-11e7-9edb-2400f30cc021.png)

## Supplier Access Approval

### Props

| Name | Type | Required | Description |
|:-----|:----:|:--------:|------------:|
| supplierId | string | true | ID of Supplier |

### Context

| Name | Type | Required | Description |
|:-----|:----:|:--------:|------------:|
| i18n | object | true | internationalization fro translation |
| showNotification | function | false | UI notification |

### Basic Example

```
import { SupplierApproval } from 'supplier-access_approval';

<SupplierApproval
  key='access_approval'
  supplierId='hard001'
/>
```

![supplier_access_approval_example](https://user-images.githubusercontent.com/1188617/33659362-384bfd76-da80-11e7-9867-9f09e088a833.png)

## Supplier Search

### Context

| Name | Type | Required | Description |
|:-----|:----:|:--------:|------------:|
| i18n | object | true | internationalization fro translation |

### Basic Example

```
import { SupplierSearch } from 'supplier-directory';

<SupplierSearch
  key='directory'
/>
```

![supplier_search_example](https://user-images.githubusercontent.com/1188617/33659593-01345bf2-da81-11e7-980e-17878f286e59.png)

## Supplier Profile Strength

### Props

| Name | Type | Required | Description |
|:-----|:----:|:--------:|------------:|
| supplierId | string | true | ID of Supplier |

### Basic Example

```
import { SupplierProfileStrength } from 'supplier-profile_strength';

<SupplierProfileStrength
  key='profile_strength'
  supplierId='hard001'
/>
```

![supplier_profile_strength_example](https://user-images.githubusercontent.com/1188617/27228558-642bc468-52a8-11e7-8b1f-7bd02165ebc0.png)

## Supplier Autocomplete

### Props

| Name | Type | Required | Description |
|:-----|:----:|:--------:|------------:|
| onChange | function | false | Callback fired when the value changes |
| onBlur | function | false | Callback fired when the component loose focus |

### Context

| Name | Type | Required | Description |
|:-----|:----:|:--------:|------------:|
| i18n | object | true | internationalization fro translation |

### Basic Example

```
import { SupplierAutocomplete } from 'supplier-autocomplete';

<SupplierAutocomplete
  key='autocomplete'
/>
```
