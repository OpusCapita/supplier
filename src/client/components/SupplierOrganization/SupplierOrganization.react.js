import React, { PropTypes, Component } from 'react';
import { Supplier } from '../../api';
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import './SupplierOrganization.css';

const MyNodeComponent = ({node}) => {
  const activeClass = node.activeClass ? 'active' : '';
  return (
    <div className={`initechNode ${activeClass}`} onClick={() => null }>{ node.name }</div>
  );
};

export default class SupplierOrganization extends Component {
  constructor(props) {
    super(props);
    this.state = { org: {} };
    this.supplierApi = new Supplier();
  }

  static propTypes = {
    supplierId: PropTypes.string.isRequired
  };

  componentDidMount() {
    this.supplierApi.getOrganization(this.props.supplierId).then(suppliers => {
      this.setState({ org: this.transformData(suppliers) })
    });
  }

  transformData(suppliers) {
    if (suppliers.length === 0) return {};

    const suppliersById = suppliers.reduce((acc, supplier) => {
      acc[supplier.id] = supplier;
      acc[supplier.id].activeClass = supplier.id === this.props.supplierId;
      return acc;
    }, {});

    suppliers.forEach(supplier => {
      const parentId = supplier.parentId;
      if (parentId) {
        if (!suppliersById[parentId].children) suppliersById[parentId].children = [];

        suppliersById[parentId].children.push(supplier);
      }
    });

    return suppliers[0];
  }

  render() {
    if (Object.keys(this.state.org).length === 0) return null;

    return <OrgChart tree={this.state.org} NodeComponent={MyNodeComponent} />;
  }
};
