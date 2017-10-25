let ButtonLabel = {};
ButtonLabel.reject = 'Reject';
ButtonLabel.add = 'Accept';

let TableHeader = {};
TableHeader.fistName = 'First Name';
TableHeader.lastName = 'Last Name';
TableHeader.email = 'Email';
TableHeader.date = 'Date';
TableHeader.status = 'Status';
TableHeader.comment = 'Comment';
TableHeader.action = 'Action';

let Description = {};
Description.unavailable = 'Unavailable';
Description.noData = 'No pending requests';

const Messages = {};
Messages.loading = 'Loading...';
Messages.saved = 'Data is successfully saved';
Messages.failed = 'Data saving failed';

const Confirmation = {};
Confirmation.success = 'Your successfully'

export default {
  SupplierAccess: {
    Confirmation: Confirmation,
    TableHeader: TableHeader,
    Description: Description,
    ButtonLabel,
    Messages,
  },
};
