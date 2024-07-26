import { useEffect, useState } from 'react'
import { Content } from '../../../../_metronic/layout/components/content'
import { countSuppliers, createSupplier, getAllSuppliers } from './_request';
import { type Suppliers as InterSuplier } from '../../models/supplier';

interface ShowSupplers extends InterSuplier {
  numOfproducts: number,
  numOfOrders: number
}

export const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<ShowSupplers[]>([]);
  const [totalSuppliers, setTotalSuppliers] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [toast, setToast] = useState<{ msg: string, status: string }>({ msg: '', status: '' });

  const modal = document.querySelector('#addProductModal');
  const toastBtn = document.querySelector('#toastBtn') as HTMLElement;
  const toastClose = document.querySelector('#toast button') as HTMLElement;

  useEffect(() => {
    getAllSuppliers(currentPage, limit)
      .then(res => {
        setSuppliers(res.data);
      })
      .catch(e => console.error(e));
    countSuppliers()
      .then(res => {
        const len = parseInt(res.data);
        setTotalSuppliers(len);
        setTotalPages(len ? Math.ceil(len / limit) : 1);
      })
      .catch(e => console.error(e));
  }, [currentPage, limit]);

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
  }
  const handleSave = () => {
    const nameEle = document.querySelector('#addSupplierModal input[name="name"]') as HTMLInputElement;
    const groupEle = document.querySelector('#addSupplierModal input[name="group"]') as HTMLInputElement;
    const wechatEle = document.querySelector('#addSupplierModal input[name="wechat"]') as HTMLInputElement;
    const name = nameEle.value;
    const group = groupEle.value;
    const wechat = wechatEle.value;
    const data = { name, group, wechat };
    createSupplier(data)
      .then(() => {
        modal?.classList.remove('show');
        setToast({ msg: 'Successfully created.', status: 'success' });
        toastBtn.click();
        modal?.classList.add('show');
        setTimeout(() => {
          if (document.querySelector('#toast')?.classList.contains('show')) toastClose.click();
        }, 5000);
      })
      .catch(e => console.error(e));
  }

  return (
    <Content>
      <div className='d-flex flex-row justify-content-between mb-4'>
        <div className='d-flex flex-row '>
          <button type='button' key={-1} className='btn btn-light p-2 px-3 mx-1 fs-7' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            <i className="bi bi-chevron-double-left"></i>
          </button>
          {renderPageNumbers()}
          <button type='button' key="+1" className='btn btn-light p-2 px-3 mx-1 fs-7' onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            <i className="bi bi-chevron-double-right"></i>
          </button>
          <div className='align-content-center mx-10'>
            Total: {totalSuppliers}
          </div>
        </div>
        <div>
          <button type='button' className='btn btn-light btn-light-primary p-2 px-3 mx-1 fs-7' data-bs-toggle="modal" data-bs-target="#addSupplierModal">
            <i className="bi bi-cart-plus"></i>
            Add Supplier
          </button>
        </div>
      </div>
      <table className="table table-rounded table-row-bordered border gy-7 gs-7">
        <thead>
          <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
            <th className='text-center'>No</th>
            <th className='text-center'>Name</th>
            <th className='text-center'>Group</th>
            <th className='text-center'>WeChat</th>
            <th className='text-center'>Number<br />(Products)</th>
            <th className='text-center'>Number<br />(Orders)</th>
          </tr>
        </thead>
        <tbody>
          {
            suppliers.map((supplier, index) =>
              <tr key={index}>
                <td className='text-center align-content-center'>{index + 1}</td>
                <td className='text-center align-content-center'>{supplier.name}</td>
                <td className='text-center align-content-center'>{supplier.group}</td>
                <td className='text-center align-content-center'>{supplier.wechat}</td>
                <td className='text-center align-content-center'>{supplier.numOfproducts ?? 123}</td>
                <td className='text-center align-content-center'>{supplier.numOfOrders ?? 456}</td>
              </tr>
            )
          }
        </tbody>
      </table>
      <div className="modal fade" id='addSupplierModal' tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Add Supplier</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form action="" method='post' id='editProductForm'>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Supplier Name:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="supplier-name"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='name' placeholder="Supplier Name" autoComplete='off' />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Supplier Group:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="supplier-group"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='group' placeholder="Supplier Group" autoComplete='off' />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Supplier WeChat:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="supplier-wechat"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='wechat' placeholder="Supplier Wechat" autoComplete='off' />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><i className='bi bi-x'></i>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}><i className='bi bi-save'></i>Save changes</button>
            </div>
          </div>
        </div>
      </div>
      <a className='d-none' href="#" id='toastBtn' data-bs-toggle="modal" data-bs-target="#toast"></a>
      <div className="modal fade" id='toast' tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog rounded">
          <div className="modal-content">
            <div className={`modal-body text-white text-bg-${toast.status} rounded`}>{toast.msg}</div>
            <button type="button" className="btn btn-secondary d-none" data-bs-dismiss="modal"></button>
          </div>
        </div>
      </div>
    </Content>
  )
}