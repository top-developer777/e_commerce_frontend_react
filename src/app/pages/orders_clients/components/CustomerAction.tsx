import { useEffect, useState } from 'react'
import Select from 'react-select';
import { Content } from '../../../../_metronic/layout/components/content'
import { Replacements } from '../../models/replacement';
import { Product } from '../../models/product';
import { getAllProducts } from '../../inventory_management/components/_request';
import { getAllReplaces, getReplaceAmount } from './_request';
// import { formatCurrency } from '../../dashboard/components/_function';

// const TypeBadge: React.FC<{
//   type: string,
// }> = props => (
//   <>
//     {
//       props.type == "Replacement" ?
//         <div>
//           <span className="badge badge-light-primary fw-bold fs-7 p-2">
//             {/* <i className='bi bi-check2-circle text-primary fw-bold'></i>&nbsp; */}
//             {props.type}
//           </span>
//         </div>
//         : props.type == "Exchange" ?
//           <div>
//             <span className="badge badge-light-success fw-bold fs-7 p-2">
//               {/* <i className='bi bi-slash-circle text-success fw-bold'></i>&nbsp; */}
//               {props.type}
//             </span>
//           </div>
//           : <div>

//           </div>
//     }
//   </>
// )

export const CustomerAction = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState<number>(50);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalReplaces, setTotalReplaces] = useState<number>(0);
  const [replaces, setReplaces] = useState<Replacements[]>([]);
  const [products, setProducts] = useState<{ value: string, label: string }[]>([]);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
    pageNumbers.push(
      <button key='page1' type='button' className={`btn ${currentPage === 1 ? 'btn-primary' : 'btn-light'} p-2 px-3 mx-1 fs-7`} onClick={() => setCurrentPage(1)}>1</button>
    );
    if (startPage > 2) {
      pageNumbers.push(<span key='start-elipsis'>...</span>);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button key={`page${i}`} type='button' className={`btn ${currentPage === i ? 'btn-primary' : 'btn-light'} p-2 px-3 mx-1 fs-7`} onClick={() => setCurrentPage(i)}>{i}</button>
      );
    }
    if (endPage < totalPages - 1) {
      pageNumbers.push(<span key='end-elipsis'>...</span>);
    }
    if (totalPages > 1) {
      pageNumbers.push(
        <button key={`page${totalPages}`} type='button' className={`btn ${currentPage === totalPages ? 'btn-primary' : 'btn-light'} p-2 px-3 mx-1 fs-7`} onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
      );
    }
    return pageNumbers;
  };
  const handleRequest = () => {

  }

  useEffect(() => {
    getAllProducts()
      .then(res => {
        const products = res.data.map((data: Product) => {
          return { value: data.ean, label: data.product_name }
        });
        setProducts(products);
      })
      .catch(e => console.error(e))
  }, []);
  useEffect(() => {
    getAllReplaces(currentPage, limit)
      .then(res => setReplaces(res.data))
      .catch(e => console.error(e));
    getReplaceAmount()
      .then(res => {
        const n = res.data;
        setTotalPages(n > 0 ? Math.ceil((n + 1) / limit) : 1);
        setTotalReplaces(n);
      })
      .catch(e => console.error(e));
  }, [currentPage, limit])
  return (
    <Content>
      <div className="d-flex w-100">
        <div className="d-flex py-2">
          <button type='button' key={-1} className='btn btn-light p-2 px-3 mx-1 fs-7' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            <i className="bi bi-chevron-double-left"></i>
          </button>
          {renderPageNumbers()}
          <button type='button' key="+1" className='btn btn-light p-2 px-3 mx-1 fs-7' onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            <i className="bi bi-chevron-double-right"></i>
          </button>
          <div className='align-content-center mx-10'>
            Total: {totalReplaces}
          </div>
        </div>
        {/* <div className="d-flex ms-auto me-0">
          <button type='button' className='btn btn-light btn-light-primary btn-sm mx-1 fs-7' data-bs-toggle="modal" data-bs-target="#requestModal">
            <i className="bi bi-cart-plus"></i>
            Request Replacement
          </button>
        </div> */}
      </div>
      <div className="row">
        <div className="col-md-12 table-responsive">
          <table className="table table-rounded table-row-bordered border gy-7 gs-7 text-center table-bordered">
            <thead>
              <tr>
                <th>Date of Request</th>
                <th>Order ID</th>
                <th>Product Name</th>
                <th>Status</th>
                <th>Replacement Reason</th>
                <th>Customer Name</th>
              </tr>
            </thead>
            <tbody>
              {replaces.map(replace => (
                <tr>
                  <td>{(new Date(replace.date)).toLocaleString()}</td>
                  <td>{replace.order_id}</td>
                  <td>{products.find(product => product.value === replace.product_ean)?.label ?? 'None'}</td>
                  <td>{replace.reason}</td>
                  <td>{replace.status}</td>
                  <td>{replace.customer_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="modal fade" id='requestModal' tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Request Replacement</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form action="" method='post' id='requestForm'>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Order ID:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="number" className="form-control" name='order_id' placeholder="Order ID" min={0} max={9999999999} required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Product:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-chat-dots-fill"></i></span>
                      <Select
                        className='react-select-styled react-select-solid react-select-sm flex-grow-1'
                        name='product_id'
                        options={products}
                        placeholder='Select product'
                        noOptionsMessage={e => `No more products including "${e.inputValue}"`}
                        defaultValue={products[0]}
                        menuPlacement='auto'
                        menuPortalTarget={document.querySelector('#requestModal') as HTMLElement}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Reason:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <textarea className='form-control' rows={3} />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><i className='bi bi-trash'></i>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleRequest}><i className='bi bi-save'></i>Request Replacement</button>
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
}