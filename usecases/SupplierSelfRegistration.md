# Supplier Self Registration

## Prerequisite 
User is registered to Business Network already and has no tenant assigned yet

## Company Registration form

User can enter company information, including name and other details that help identifiying the company.

### Company not registered already

In case of no conflicts, user can create the supplier.
This is only allowed in case user is not already assigned to a tenant to avoid tenant flooding.

Once supplier is created the user creating it is permanently assigned to this supplier by setting user.supplierId.
This ensures user can only create one tenant in registration process and also prevents user from assigning to any tenant via api.

### Company already registered

User gets a on-screen message that a company with same Name, VATID, any other unique identifier has already been registered.
The user then gets an option to start an access workflow that will
* allow the requesting user to enter an access justification text
* create an access request for the user to the existing supplier in the system
* notify the `supplier-admin` user(s) of the existing supplier that a users is requesting access (via email including link)

The receiving supplier can then process the access request and finally deny or approve (see [User Access Request](UserAccessRequest.md) )

Once access is approved, the requesting user
* receives an email notification about the approval and info that he/she can now login to the system

The requesting user can then login and finish the access workflow that will
* is assigned the user to the supplier
* grant the user a `supplier` role
