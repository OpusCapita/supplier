# User Access Request

Supplier admin receives access request email notification

see ( [Supplier Self Registration](SupplierSelfRegistration.md) )

Email contains a link to the approval request.
The supplier can always navigate to access requests via supplier master data editor, access request tab.
On the access request tab, all open access requests are display as table by default.
Columns contain First Name, Last Name, Email (=userId), Date, Status, Comment (=justification) and Actions

The table allows to modify the default filter in order to show also previously approved requests.
Paging /Sorting are supported, too.

Supplier admin can inspect the requesting user id, first name, last name and justification text.

Supplier admin can then decide on possible workflow transitions:
* deny
* approve

## Deny

Request status is set to denied, requesting user is notified (via notification service) about the denial.

## Approve

Request status is set to approved, requesting user is notified (via notification service) about the approval and asked to log in to the Business Network Portal.
