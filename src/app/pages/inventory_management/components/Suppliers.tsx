import { useEffect, useState } from 'react'
import { Content } from '../../../../_metronic/layout/components/content'

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

  useEffect(() => {
    setSuppliers(fakeSuppliers)
  }, []);

  return (
    <Content>
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
                    <div className='symbol symbol-circle symbol-50px overflow-hidden me-3' style={{backgroundColor: ColorForAvatar[supplier.author[0].charCodeAt(0) % 4]['background']}}>
                      <div className='symbol-label fs-3' style={{color: ColorForAvatar[supplier.author[0].charCodeAt(0) % 4]['text']}}>
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
    </Content>
  )
}