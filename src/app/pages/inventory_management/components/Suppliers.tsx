import { useEffect, useState } from 'react'
import { Content } from '../../../../_metronic/layout/components/content'
import { countSuppliers, getAllSuppliers } from './_request';

const fakeSuppliers = [
  {
    "name": "ABC",
    "currency": "RON",
    "email": "abc@test.com",
    "wechat": "wxid_1234567890",
    "website": "http://localhost:8000",
    "numOfproducts": 10,
    "numOfOrders": 100,
    "author": "Victor Sava",
    "author_email": "victor@admin.com",
  },
  {
    "name": "BBB",
    "currency": "RON",
    "email": "BBB@test.com",
    "wechat": "wxid_1234567890",
    "website": "http://localhost:8000",
    "numOfproducts": 10,
    "numOfOrders": 100,
    "author": "Admin",
    "author_email": "admin@dev.com",
  },
]

const ColorForAvatar = [
  {
    "background": "#302024",
    "text": "#e42855"
  },
  {
    "background": "#242320",
    "text": "#c59a00"
  },
  {
    "background": "#172331",
    "text": "#006ae6"
  },
  {
    "background": "#25202f",
    "text": "#dd00e9"
  }
]

interface Supplier {
  name: string;
  currency: string;
  email: string;
  wechat: string;
  website: string;
  numOfproducts: number;
  numOfOrders: number;
  author: string;
  author_email: string;
}

export function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [totalSuppliers, setTotalSuppliers] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    getAllSuppliers(currentPage, limit)
      .then(res => {
        // setSuppliers(res.data);
        setSuppliers(fakeSuppliers)
      })
      .catch(e => console.error(e));
    countSuppliers()
      .then(res => {
        const len = parseInt(res.data);
        setTotalSuppliers(len);
        setTotalPages(len ? Math.ceil(len / limit) : 1);
      })
      .catch(e => console.error(e));
  });

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
    pageNumbers.push(
      <button key='page1' type='button' className={`btn ${currentPage === 1 ? 'btn-primary' : 'btn-light'} p-2 px-3 mx-1 fs-7`} onClick={() => setCurrentPage(1)}>1</button>
    );
    if (startPage > 2) {
      pageNumbers.push(<>...</>);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button key={`page${i}`} type='button' className={`btn ${currentPage === i ? 'btn-primary' : 'btn-light'} p-2 px-3 mx-1 fs-7`} onClick={() => setCurrentPage(i)}>{i}</button>
      );
    }
    if (endPage < totalPages - 1) {
      pageNumbers.push(<>...</>);
    }
    if (totalPages > 1) {
      pageNumbers.push(
        <button key={`page${totalPages}`} type='button' className={`btn ${currentPage === totalPages ? 'btn-primary' : 'btn-light'} p-2 px-3 mx-1 fs-7`} onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
      );
    }
    return pageNumbers;
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
            <th className='col-md-2'>Name</th>
            <th className='col-md-1'>Currency</th>
            <th className='col-md-2'>Email</th>
            <th className='col-md-2'>WeChat</th>
            <th className='col-md-2'>Website</th>
            <th className='col-md-2'>Author</th>
            <th className='col-md-1 text-center'>Number<br />(Products)</th>
            <th className='col-md-1 text-center'>Number<br />(Orders)</th>
          </tr>
        </thead>
        <tbody>
          {
            suppliers.map((supplier, index) =>
              <tr key={index}>
                <td className='align-content-center'>
                  {
                    supplier.name
                  }
                </td>
                <td className='align-content-center'>
                  {
                    supplier.currency
                  }
                </td>
                <td className='align-content-center'>
                  {
                    supplier.email
                  }
                </td>
                <td className='align-content-center'>
                  {
                    supplier.wechat
                  }
                </td>
                <td className='align-content-center'>
                  {
                    supplier.website
                  }
                </td>
                <td className='align-content-center p-2'>
                  <div className='d-flex align-items-center'>
                    <div className='symbol symbol-circle symbol-50px overflow-hidden me-3' style={{ backgroundColor: ColorForAvatar[supplier.author[0].charCodeAt(0) % 4]['background'] }}>
                      <div className='symbol-label fs-3' style={{ color: ColorForAvatar[supplier.author[0].charCodeAt(0) % 4]['text'] }}>
                        {
                          supplier.author.split(' ').length > 1 ?
                            supplier.author.split(' ')[0][0] + supplier.author.split(' ')[1][0]
                            :
                            supplier.author[0]
                        }
                      </div>
                    </div>
                    <div className='d-flex flex-column text-gray-800'>
                      <span className='text-gray-800'><b>{supplier.author}</b></span>
                      <span>{supplier.author_email}</span>
                    </div>
                  </div>
                </td>
                <td className='text-center align-content-center'>
                  {
                    supplier.numOfproducts
                  }
                </td>
                <td className='text-center align-content-center'>
                  {
                    supplier.numOfOrders
                  }
                </td>
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
                      <input type="text" className="form-control" name='product_name' defaultValue={'name'} placeholder="Supplier Name" aria-label="Supplier Name" aria-describedby="supplier-name" required />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
}