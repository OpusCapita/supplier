# Supplier User Management

## Prerequisites

User is supplier admin

## View Users

Supplier admin sees a menu item Company/User Management
This will bring up the user admin editor (user service), which basically allows the supplier admin to manage the supplier's users.
see [User Management](https://github.com/OpusCapita/user/blob/develop/usecases/UserManagement.md)

## Turn contact into a user

The Supplier admin can create contacts via the Company/Profile editor.
Each contact can have two states:
* linked to user
* not linked to user

If linked to user, the contact is read-only. Deleting is still possible, but the user remains and has to be deactivated separately.
This is shown as warning to the user when deleting contact.
Next to linked user, the supplier admin sees a button "Manage" to jump to user manager, filtered on this user's userid.

If contact is not linked to user yet, supplier-admin sees a button "Create User" that allows to create a user based on the contact information and link that user to the supplier contact.
The linked user is initially created with role supplier-user and assigned to same supplier as supplier-admin.

