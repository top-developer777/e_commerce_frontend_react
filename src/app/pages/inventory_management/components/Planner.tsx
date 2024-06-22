
import { FC, useEffect, useState } from 'react'
import { Content } from '../../../../_metronic/layout/components/content'

const fakeTile = [
  {
    "title": "FBA + FBM",
    "units": 2910,
    "cost_of_goods": 10706.37,
    "potential_sales": 32936.90,
    "potential_profit": 20929.96
  },
  {
    "title": "Prep. stock",
    "units": 29790,
    "cost_of_goods": 87080.80,
    "potential_sales": 382167.10,
    "potential_profit": 200228.65
  },
  {
    "title": "Ordered",
    "units": 32407,
    "cost_of_goods": 77178.25,
    "potential_sales": 373659.93,
    "potential_profit": 171290.92
  },
  {
    "title": "Total",
    "units": 65107,
    "cost_of_goods": 174965.42,
    "potential_sales": 788763.93,
    "potential_profit": 392449.53
  }
]

const fakeProducts = [
  {
    "admin_user": "theinnovatorssrl@gmail.com",
    "part_number_key": "D33HD4MBM",
    "brand_name": "Elindor",
    "category_id": 3514,
    "brand": "Elindor",
    "name": "Lampa LED birou, incarcare wireless pentru IOS Android, 5 moduri lumina rece/calda si 10 intensitati, control tactil, ajustabila, USB, 450lm, Negru mat",
    "part_number": "1",
    "sale_price": "121.8400",
    "currency": "RON",
    "images": "[{\"url\": \"https://marketplace-static.emag.ro/resources/000/033/859/907/33859907.png\", \"display_type\": 1}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/039/066/170/39066170.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/038/123/849/38123849.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/038/123/862/38123862.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/038/123/865/38123865.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/038/123/868/38123868.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/038/123/869/38123869.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/038/123/897/38123897.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/038/123/901/38123901.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/036/424/415/36424415.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/034/576/427/34576427.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/034/192/379/34192379.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/744/313/33744313.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/714/109/33714109.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/714/110/33714110.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/661/692/33661692.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/661/700/33661700.png\", \"display_type\": 2}]",
    "url": "",
    "fba_fbm_stock": 39,
    "reserved": 0,
    "stock_value": 29.25,
    "sales_velocity": 9.07,
    "days_of_stock": 6,
    "sent_to_fba": 0,
    "production_time": 15,
    "ordered": 7,
    "days_until_next_order": -13,
    "recommended_quantity": 225,
    "recommended_shipping_mode": "train",
    "roi": 495,
    "comment": 6703,
    "imports": [
      "34 - Sea May #2 (Core)", "68 - Sea May #2 (Core)"
    ]
  },
  {
    "admin_user": "theinnovatorssrl@gmail.com",
    "part_number_key": "DRM054MBM",
    "brand_name": "OEM",
    "buy_button_rank": 1,
    "category_id": 3268,
    "brand": "OEM",
    "name": "Mini Umidificator de aer cu difuzor aromaterapie si lumini LED, portabil, USB, rezervor 220 ml, 2 moduri de functionare, lumini de noapte, umidificator camera si masina auto, Alb",
    "part_number": "85-2",
    "sale_price": "42.0100",
    "currency": "RON",
    "images": "[{\"url\": \"https://marketplace-static.emag.ro/resources/000/039/390/178/39390178.png\", \"display_type\": 1}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/946/33582946.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/947/33582947.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/948/33582948.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/949/33582949.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/950/33582950.png\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/951/33582951.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/952/33582952.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/953/33582953.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/954/33582954.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/955/33582955.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/956/33582956.jpg\", \"display_type\": 0}]",
    "url": "",
    "fba_fbm_stock": 39,
    "reserved": 0,
    "stock_value": 29.25,
    "sales_velocity": 9.07,
    "days_of_stock": 6,
    "sent_to_fba": 0,
    "production_time": 15,
    "ordered": 7,
    "days_until_next_order": -13,
    "recommended_quantity": 225,
    "recommended_shipping_mode": "air",
    "roi": 495,
    "comment": 6703,
    "imports": [
      "48 - Sea April #2 (SAM)",
      "120 - Sea April #2 (SAM)",
      "120 - Sea May #2 (Core)",
      "24 - Bella SEA"
    ]
  },
  {
    "admin_user": "theinnovatorssrl@gmail.com",
    "part_number_key": "D8VY54MBM",
    "brand_name": "OEM",
    "buy_button_rank": null,
    "category_id": 3255,
    "brand": "Elindor",
    "name": "Marsupiu ergonomic cu gluga detasabila pentru bebe, buzunar de depozitare, suport lombar, pozitii orientate in spate sau rucsac pentru nou-nascuti si copii mici",
    "part_number": "6",
    "sale_price": "193.2700",
    "currency": "RON",
    "images": "[{\"url\": \"https://marketplace-static.emag.ro/resources/000/039/228/604/39228604.png\", \"display_type\": 1}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/936/37599936.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/938/37599938.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/941/37599941.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/942/37599942.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/943/37599943.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/946/37599946.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/947/37599947.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/953/37599953.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/954/37599954.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/955/37599955.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/418/093/37418093.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/726/33637726.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/727/33637727.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/728/33637728.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/729/33637729.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/731/33637731.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/732/33637732.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/733/33637733.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/891/33582891.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/895/33582895.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/901/33582901.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/902/33582902.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/903/33582903.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/904/33582904.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/905/33582905.png\", \"display_type\": 2}]",
    "url": "",
    "fba_fbm_stock": 643,
    "reserved": 0,
    "stock_value": 38.25,
    "sales_velocity": 3.07,
    "days_of_stock": 123,
    "sent_to_fba": 0,
    "production_time": 30,
    "ordered": 0,
    "days_until_next_order": 133,
    "recommended_quantity": 0,
    "recommended_shipping_mode": "ship",
    "roi": 1100,
    "comment": 6703,
    "imports": [
      "72 - Sea April #2 (SAM)",
      "52 - Sea April #1",
      "30 - Sea May #2 (Core)",
    ]
  }
]

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const TileComponent: FC = props => (
  <div className="card card-custom card-stretch shadow cursor-pointer">
    <div className="card-header pt-4">
      <div className='row'>
        <h3 className="text-gray-800 card-title">{props.tile.title}</h3><br />
      </div>
    </div>
    <div className="card-body p-6">
      <div className='row mb-2'>
        <div className='col-md-6'>
          <span className='text-gray-700'>Units</span><br />
          <h4 className='text-gray-900 text-hover-primary'>
            {
              props.tile.units.toLocaleString()
            }
          </h4>
        </div>
        <div className='col-md-6'>
          <span className='text-gray-700'>Cost of goods</span><br />
          <h4 className='text-gray-900 text-hover-primary'>
            {
              formatCurrency(props.tile.cost_of_goods)
            }
          </h4>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <span className='text-gray-700'>Potential sales</span><br />
          <h4 className='text-gray-900 text-hover-primary'>
            {
              formatCurrency(props.tile.potential_sales)
            }
          </h4>
        </div>
        <div className='col-md-6'>
          <span className='text-gray-700'>Potential profit</span><br />
          <h4 className='text-gray-900 text-hover-primary'>
            {
              formatCurrency(props.tile.potential_profit)
            }
          </h4>
        </div>
      </div>
    </div>
  </div>
)

const Icon = props => (
  <>
    {
      props.value > 10 ?
      <div>
        <span className="badge badge-light-success fw-bold fs-5 p-2">
          <i className='bi bi-check2-circle text-success fw-bold fs-5'></i>&nbsp;
          {props.value.toLocaleString()}
        </span>
      </div>
      : props.value > 0 ?
      <div>
        <span className="badge badge-light-warning fw-bold fs-5 p-2">
          <i className='bi bi-slash-circle text-warning fw-bold fs-5'></i>&nbsp;
          {props.value.toLocaleString()}
        </span>
      </div>
      : <div>
        <span className="badge badge-light-danger fw-bold fs-5 p-2">
          <i className='bi bi-x-circle text-danger fw-bold fs-5'></i>&nbsp;
          {props.value.toLocaleString()}
        </span>
      </div>
    }
  </>
)

const ShippingMode = props => (
  <>
    {
      props.mode == "air" ? 
        <i className="fa-sharp fa-solid fa-plane fw-bold fs-1 text-success"></i>
      : props.mode == "train" ?
        <i className="fa-solid fa-train-tram fw-bold fs-1 text-warning"></i>
      : props.mode == "ship" ?
        <i className="fa-sharp fa-solid fa-ship fw-bold fs-1 text-primary"></i>
      : "No Mode"
    }
  </>
)

const TableProductPlanner: FC = props => (
  <table className="table table-rounded table-row-bordered border gy-7 gs-7">
    <thead>
        <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
            <th className='col-md-4 align-content-center'>Product</th>
            <th className='text-end align-content-center px-1'>FBA/FBM<br />stock</th>
            <th className='text-end align-content-center px-1'>Stock value</th>
            <th className='text-end align-content-center px-1'>Sales<br />Velocity<br />(units/day)</th>
            <th className='text-end align-content-center px-1'>Days of<br />stock left</th>
            <th className='text-end align-content-center px-1'>Sent to<br />FBA</th>
            <th className='text-end align-content-center px-1'>Production Time<br />(day)</th>
            <th className='text-end align-content-center px-1'>Ordered</th>
            <th className='text-center align-content-center px-1'>Days until<br />next order</th>
            <th className='text-end align-content-center px-1'>Recommended<br />quantity for<br />reordering</th>
            <th className='text-center align-content-center px-1'>Recommended<br />shipping mode</th>
            <th className='text-center align-content-center px-1'>Imports</th>
            <th className='text-center align-content-center px-1'>ROI</th>
            <th className='align-content-center px-1'>Actions</th>
        </tr>
    </thead>
    <tbody>
      {
        props.products.map((product, index) => 
          <tr className='py-1'>
            <td className='align-content-center py-3 px-0'>
              <div className='d-flex'>
                <div className='p-2 align-content-center'>
                  {
                    JSON.parse(product.images).length > 0 ? <img width={60} height={60} src={JSON.parse(product.images)[0]["url"]} alt={product.name} />
                    : 
                    <div>
                      No Image
                    </div>
                  }
                </div>
                <div className='align-content-center'>
                  <span>{product.part_number_key}</span><br />
                  <span className='two-line-text'>{product.name}</span>
                  <span>{formatCurrency(product.sale_price)}</span>
                </div>
              </div>
            </td>
            <td className='text-end align-content-center'>
              {
                product.fba_fbm_stock
              }
            </td>
            <td className='text-end align-content-center'>
              {
                formatCurrency(product.stock_value)
              }
            </td>
            <td className='text-end align-content-center'>
              {
                product.sales_velocity.toLocaleString()
              }
            </td>
            <td className='text-end align-content-center'>
              <Icon value={product.days_of_stock} />
            </td>
            <td className='text-end align-content-center'>
              {
                product.sent_to_fba.toLocaleString()
              }
            </td>
            <td className='text-end align-content-center'>
              {
                product.production_time.toLocaleString()
              }
            </td>
            <td className='text-end align-content-center'>
              {
                product.ordered.toLocaleString()
              }
            </td>
            <td className='text-end align-content-center'>
              <Icon value={product.days_until_next_order} />
            </td>
            <td className='text-end align-content-center'>
              {
                product.recommended_quantity.toLocaleString()
              }
            </td>
            <td className='text-center align-content-center'>
              <ShippingMode mode={product.recommended_shipping_mode} />
            </td>
            <td className='text-center align-content-center'>
              <div className='row'>
                {
                  product.imports.map(_import => <span className='two-line-text'>
                    {_import}
                  </span>)
                }
              </div>
            </td>
            <td className='text-end align-content-center'>
              {
                product.roi.toLocaleString()
              }%
            </td>
            <td className='text-center align-content-center align-item-center'>
              <a
                href='#'
                className='btn btn-light btn-active-light-primary btn-sm'
                data-kt-menu-trigger='click'
                data-kt-menu-placement='top-end'
              >
                ...
              </a>
              <div
                className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-200px py-1'
                data-kt-menu='true'
              >
                <div className='menu-item px-1'>
                  <a className='menu-link px-3'>
                    Edit
                  </a>
                </div>
                <div className='menu-item px-1'>
                  <a
                    className='menu-link px-3'
                    data-kt-users-table-filter='delete_row'
                  >
                    Create purchase order
                  </a>
                </div>
              </div>
            </td>
          </tr>
        )
      }
    </tbody>
  </table>
)

export function Planner() {
  const [tiles, setTiles] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    setTiles(fakeTile)
    setProducts(fakeProducts)
  }, [])

  return (
    <Content>
      <div className='row'>
        {
          tiles.map(tile =>
            <div className='col-xl-3'>
              <TileComponent tile={tile} />
            </div>
          )
        }
      </div>
      <div className='row'>
        <TableProductPlanner products={products} />
      </div>
    </Content>
  )
}