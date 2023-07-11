import { Table as AntTable } from 'antd';
import PropTypes from 'prop-types';

import '../less/table.less';

function Table({
  className,
  columns,
  dataSource,
  // onRowClick,
  pagination,
  rowClassName,
}) {
  return (
    <AntTable
      className={className}
      columns={columns}
      dataSource={dataSource}
      // onRow={(record) => ({ onClick: () => onRowClick(record) })}
      pagination={pagination}
      rowClassName={rowClassName}
      scroll={{ x: 1000 }}
      size="medium"
    />
  );
}

Table.defaultProps = {
  className: '',
  pagination: false,
  rowClassName: () => {},
};

Table.propTypes = {
  dataSource: PropTypes.arrayOf(Object).isRequired,
  columns: PropTypes.arrayOf(Object).isRequired,
  className: PropTypes.string,
  pagination: PropTypes.bool,
  rowClassName: PropTypes.func,
  // onRowClick: PropTypes.func.isRequired,
};

export default Table;
