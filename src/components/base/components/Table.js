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
      <Row>
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
      <Row style={{ maxHeight: '700px', marginTop: '19px' }}>
        <InfiniteScroll
          className="border-primary-100 br-2px border-1px mb-30"
          dataLength={totalCount || 0}
          hasMore={hasMore}
          height={550}
          loader={
            <div className="text-center mt-1">
              <Spin />
            </div>
          }
          next={loadMoreData}
          scrollableTarget="scrollableDiv"
          style={{ overflowY: 'scroll' }}
        >
          <AntTable
            className={className}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            rowClassName={rowClassName}
            scroll={{ x: 1000 }}
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
};

export default Table;
