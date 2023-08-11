import { Table as AntTable, Col, Row, Spin } from 'antd';
import PropTypes from 'prop-types';
import '../less/table.less';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Input from 'components/base/components/Input';

function Table({
  className,
  columns,
  dataSource,
  totalCount,
  loadMoreFunc,
  rowClassName,
  type,
  height,
}) {
  const [hasMore, setHasMore] = useState(false);
  const [pagination, setPagination] = useState(1);

  useEffect(() => {
    setHasMore(dataSource.length < totalCount);
    setPagination(1);
  }, [dataSource, totalCount]);

  const loadMoreData = () => {
    const page = pagination + 1;
    loadMoreFunc('', page, 15);
    setPagination(page);
  };
  return (
    <div className={`${className}`}>
      <Row className="r-1">
        <Col span={24}>
          {type === 'search' && (
            <Input
              onSearch={(val) => loadMoreFunc(val, pagination, 15)}
              placeholder=""
              type="search"
            />
          )}
        </Col>
      </Row>
      <Row className="r-2">
        <InfiniteScroll
          dataLength={totalCount || 0}
          hasMore={hasMore}
          height={height}
          loader={
            <div style={{ textAlign: 'center', padding: '10px 0px' }}>
              <Spin />
            </div>
          }
          next={loadMoreData}
        >
          <AntTable
            className={className}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            rowClassName={rowClassName}
            scroll={{ x: 1000 }}
            showSorterTooltip={false}
            size="medium"
          />
        </InfiniteScroll>
      </Row>
    </div>
  );
}

Table.defaultProps = {
  className: '',
  rowClassName: () => {},
};

Table.propTypes = {
  dataSource: PropTypes.arrayOf(Object).isRequired,
  columns: PropTypes.arrayOf(Object).isRequired,
  totalCount: PropTypes.number.isRequired,
  className: PropTypes.string,
  rowClassName: PropTypes.func,
  loadMoreFunc: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
};

export default Table;
