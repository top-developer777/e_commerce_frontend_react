import { useEffect, useState } from 'react'
import { Content } from '../../../../_metronic/layout/components/content'

const fakeReplacements = [
  {
    "date": "2024-06-15",
    "order_id": "ORD123456",
    "mkp": "Amazon",
    "type": "Replacement",
    "cost": 15.99,
    "address": "123 Main St, Springfield, IL, 62704",
    "ordered_products": [
      {
        "name": "Laptop",
        "image_url": "https://marketplace-static.emag.ro/resources/000/033/859/907/33859907.png"
      },
      {
        "name": "Mouse",
        "image_url": "https://example.com/images/mouse.jpg"
      }
    ],
    "ship_products": [
      {
        "name": "Laptop",
        "image_url": "https://marketplace-static.emag.ro/resources/000/039/228/604/39228604.png"
      }
    ],
    "comment": "Customer reported a faulty laptop.",
    "ship_other": "No",
    "awb": "AWB123456789",
    "return_awb": "R-AWB987654321",
    "order_date": "2024-06-01"
  },
  {
    "date": "2024-06-17",
    "order_id": "ORD789012",
    "mkp": "eBay",
    "type": "Exchange",
    "cost": 7.50,
    "address": "456 Elm St, Metropolis, NY, 10101",
    "ordered_products": [
      {
        "name": "Headphones",
        "image_url": "https://marketplace-static.emag.ro/resources/000/039/390/178/39390178.png"
      }
    ],
    "ship_products": [{
      "name": "Charger",
      "image_url": "https://marketplace-static.emag.ro/resources/000/033/859/907/33859907.png"
    }],
    "comment": "Customer requested an exchange for a different model.",
    "ship_other": "No",
    "awb": "AWB345678901",
    "return_awb": "R-AWB765432109",
    "order_date": "2024-06-05"
  },
  {
    "date": "2024-06-18",
    "order_id": "ORD345678",
    "mkp": "Shopify",
    "type": "Replacement",
    "cost": 10.00,
    "address": "789 Oak St, Gotham, NJ, 07001",
    "ordered_products": [
      {
        "name": "Smartphone",
        "image_url": "https://marketplace-static.emag.ro/resources/000/039/228/604/39228604.png"
      },
      {
        "name": "Charger",
        "image_url": "https://example.com/images/charger.jpg"
      }
    ],
    "ship_products": [
      {
        "name": "Smartphone",
        "image_url": "https://marketplace-static.emag.ro/resources/000/039/390/178/39390178.png"
      }
    ],
    "comment": "Tablet screen was cracked on arrival.",
    "ship_other": "Yes",
    "awb": "AWB456789012",
    "return_awb": "R-AWB654321098",
    "order_date": "2024-06-07"
  }
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const TypeBadge: React.FC<{
  type: string,
}> = props => (
  <>
    {
      props.type == "Replacement" ?
        <div>
          <span className="badge badge-light-primary fw-bold fs-7 p-2">
            {/* <i className='bi bi-check2-circle text-primary fw-bold'></i>&nbsp; */}
            {props.type}
          </span>
        </div>
        : props.type == "Exchange" ?
          <div>
            <span className="badge badge-light-success fw-bold fs-7 p-2">
              {/* <i className='bi bi-slash-circle text-success fw-bold'></i>&nbsp; */}
              {props.type}
            </span>
          </div>
          : <div>

          </div>
    }
  </>
)

interface Replacement {
  date: string;
  order_id: string;
  mkp: string;
  type: string;
  cost: number;
  address: string;
  ordered_products: { name: string; image_url: string; }[];
  ship_products: { name: string; image_url: string; }[];
  comment: string;
  ship_other: string;
  awb: string;
  return_awb: string;
  order_date: string;
}

const TableReplacement: React.FC<{
  replacements: Replacement[],
}> = props => {
  return (
    <div>
      <table className="table table-rounded table-row-bordered border gy-7 gs-7 cursor-pointer table-hover">
        <thead>
          <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
            <th className='col-md-1 text-center px-1'>Date</th>
            <th className='col-md-1 text-center px-1'>Order ID</th>
            <th className='w-100px text-center px-1'>Type</th>
            <th className='col-md-1 text-center px-1'>Cost</th>
            <th className='col-md-2 px-1'>Address</th>
            <th className='col-md-1 text-center px-1'>Products<br />Ordered</th>
            <th className='col-md-1 text-center px-1'>Products<br />to ship</th>
            <th className='col-md-2 px-1'>Comment</th>
            <th className='text-center px-1'>Ship to<br />other<br />address</th>
            <th className='col-md-1 text-center px-1'>AWB</th>
            <th className='col-md-1 text-center px-1'>Return AWB</th>
            <th className='col-md-1 text-center px-1'>Order Date</th>
          </tr>
        </thead>
        <tbody>
          {
            props.replacements.map((replacement: Replacement, index: number) =>
              <tr key={`replacement-${index}`}>
                <td className='align-content-center text-center p-1 m-0'>
                  {
                    replacement.date
                  }
                </td>
                <td className='align-content-center text-center p-1 m-0'>
                  {
                    replacement.order_id
                  }
                </td>
                <td className='align-content-center text-center p-1 m-0'>
                  <TypeBadge type={replacement.type} />
                </td>
                <td className='align-content-center text-center p-1 m-0'>
                  {
                    formatCurrency(replacement.cost)
                  }
                </td>
                <td className='align-content-center p-1'>
                  {
                    replacement.address
                  }
                </td>
                <td className='align-content-center text-center p-1 py-2'>
                  <div>
                    <img className='w-60px h-60px' src={replacement.ordered_products[0].image_url} alt='Product Image' />
                    <br />
                    <a className='text-primary'>
                      {
                        replacement.ordered_products.length
                      } Products
                    </a>
                  </div>
                </td>
                <td className='align-content-center text-center p-1'>
                  <div>
                    <img className='w-60px h-60px' src={replacement.ship_products[0].image_url} alt='Product Image' />
                    <br />
                    <a className='text-primary'>
                      {
                        replacement.ship_products.length
                      } Products
                    </a>
                  </div>
                </td>
                <td className='align-content-center p-1'>
                  {
                    replacement.comment
                  }
                </td>
                <td className='align-content-center p-1 text-center'>
                  {
                    replacement.ship_other
                  }
                </td>
                <td className='align-content-center p-1 text-center'>
                  {
                    replacement.awb
                  }
                </td>
                <td className='align-content-center p-1 text-center'>
                  {
                    replacement.return_awb
                  }
                </td>
                <td className='align-content-center p-1 text-center'>
                  {
                    replacement.order_date
                  }
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
  )
}

export function CustomerAction() {
  const [replacements, setReplacements] = useState<Replacement[]>([]);

  useEffect(() => {
    setReplacements(fakeReplacements);
  }, [])

  return (
    <Content>
      <div className="card card-custom card-stretch shadow cursor-pointer mb-4">
        <div className="card-header pt-4 w-full">
          <div>
            <h3 className="text-gray-800 card-title align-content-center">Products Replacement</h3>
          </div>
        </div>
        <div className="card-body p-6">
          <div className="d-flex flex-row justify-content-end mb-2">
            <button type='button' className='btn btn-light btn-light-primary p-2 px-3 mx-1 fs-7'>
              <i className="bi bi-cart-plus"></i>
              Add Replacement
            </button>
          </div>
          <TableReplacement replacements={replacements} />
        </div>
      </div>
    </Content>
  )
}

