
import { useEffect, useRef, FC, useState, useCallback } from 'react'
import Select from 'react-select'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { getCSS, getCSSVariableValue } from '../../../../_metronic/assets/ts/_utils'
import { useThemeMode } from '../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'
import { getChartInfo, getAllProducts } from './_request'
import { Order } from '../../models/order'
import { TableProductsOrders } from './TableProductOrders'
import { Product } from '../../models/product'

type Props = {
  className: string
}

const periods = [
  {
    value: '1',
    label: 'Last 12 months, by month'
  },
  {
    value: '2',
    label: 'Last 3 months, by week'
  },
  {
    value: '3',
    label: 'Last 30 days, by day'
  },
];

const getChartOptions = (height: number, series: string, categories: string): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')

  return {
    series: JSON.parse(series),
    chart: {
      fontFamily: 'inherit',
      stacked: false,
      height: height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 3,
      },
    },
    legend: {
      show: true,
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 5,
      hover: {
        size: 5,
      }
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: [0, 0, 2],
      colors: ['#fff', '#1bc5bd', '#f64e60'],
    },
    xaxis: {
      categories: JSON.parse(categories),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: [{
        formatter: function (val) {
          return `${val}`;
        },
      },{
        formatter: function (val) {
          return `${val}`;
        },
      },{
        formatter: function (val) {
          return `$${val}k`;
        },
      },]
    },
    colors: ['rgba(137,80,252,1)', 'rgba(27,197,189,1)', 'rgba(246,78,96,1)', 'rgba(105,147,255,1)'],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
  }
}

export const ChartComponent: FC<Props> = ({ className }) => {
  const [series, setSeries] = useState<string>('[]');
  const [categories, setCategories] = useState<string>('[]');
  const [chartPeriod, setChartPeriod] = useState<string>('1');
  const [searchChartProducts, setSearchChartProducts] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [amount, setAmount] = useState<number>(1);
  const [isAllChecked, setIsAllChecked] = useState<boolean>(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [mappingCompleted, setMappingCompleted] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [orders, setOrders] = useState<Order[]>([]);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLUListElement | null>(null);
  const { mode } = useThemeMode()

  type Series = {
    name: string;
    type: string;
    data: number[];
  };

  const handleChartFilter = () => {
    const inputs = scrollRef.current?.querySelectorAll('li input[type="checkbox"]') as unknown as HTMLInputElement[];
    const productIds = [];
    if (inputs) for (const input of inputs) {
      if (input.checked) productIds.push(input.value);
    }
    setSelectedProducts(productIds);
    getChartInfo(parseInt(chartPeriod), productIds.join(','))
      .then(res => {
        if (res.status === 200) {
          const data = res.data.chart_data;
          const categories = [];
          const series: Series[] = [
            {
              name: 'Units sold',
              type: 'bar',
              data: [],
            },
            {
              name: 'Refunds',
              type: 'bar',
              data: [],
            },
            {
              name: 'Net Profit',
              type: 'line',
              data: [],
            },
          ];
          for (const datum of data) {
            categories.push(datum.date_string);
            series[0].data.push(parseFloat(datum.total_units));
            series[1].data.push(parseFloat(datum.total_refund));
            series[2].data.push(parseFloat((parseFloat(datum.total_net_profit) / 1000).toPrecision(2)));
          }
          setSeries(JSON.stringify(series));
          setCategories(JSON.stringify(categories));
        } else {
          console.error(res);
        }
      });
  }
  const checkSelected = () => {
    const inputs = scrollRef.current?.querySelectorAll('li input[type="checkbox"]') as unknown as HTMLInputElement[];
    const productIds = [];
    if (inputs) for (const input of inputs) {
      if (input.checked) productIds.push(input.value);
    }
    setSelectedProducts(productIds);
  }
  const clearSelection = () => {
    setSelectedProducts([]);
    const inputs = scrollRef.current?.querySelectorAll('li input[type="checkbox"]') as unknown as HTMLInputElement[];
    if (inputs) for (const input of inputs) {
      input.checked = false;
    }
  }
  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }
    const height = parseInt(getCSS(chartRef.current, 'height'))
    const chart = new ApexCharts(chartRef.current, getChartOptions(height, series, categories))
    if (chart) {
      chart.render()
    }
    return chart
  }
  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setAmount(amount + 1);
      }
    }
  }, [amount]);
  const checkAll = () => {
    const inputs = scrollRef.current?.querySelectorAll('li input[type="checkbox"]') as unknown as HTMLInputElement[];
    if (inputs) for (const input of inputs) {
      if (!isAllChecked) {
        input.checked = true;
        setIsAllChecked(true);
      } else {
        input.checked = false;
        setIsAllChecked(false);
      }
      checkSelected();
    }
  }

  useEffect(() => {
    getAllProducts(1, 1000)
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    const chart = refreshChart()
    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, mode, series, categories]);
  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => {
        element.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);
  useEffect(() => {
    if (mappingCompleted) handleChartFilter();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappingCompleted]);

  return (
    <div className="tab-pane fade" id="dashboard-chart" role="tabpanel">
      <div className="row">
        <div className="col-md-7">
          <div className="dropdown">
            <div className="input-group" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
              <span className="input-group-text" id="products"><i className="bi bi-search"></i></span>
              <input type="text" className="form-control" onChange={(e) => setSearchChartProducts(e.target.value)} name='products' autoComplete='false' placeholder="Search products by name, tag, SKU, ASIN" />
              {selectedProducts.length === 0 && <></>}
              {selectedProducts.length === 1 && <div className='d-absolute bg-white' style={{ top: '2px', right: '2px', bottom: '2px', width: '200px' }}>
                <div className="d-flex align-items-center h-100 w-100">
                  <span className='d-flex'>
                    <img src={products[parseInt(selectedProducts[0])].image_link} alt="" width={30} height={30} />
                  </span>
                  <span className='overflow-hidden text-nowrap ps-2' style={{ textOverflow: 'ellipsis', width: 'calc(100% - 36px - 22px)' }}>{products.find(product => parseInt(selectedProducts[0]) === product.id)?.product_name}</span>
                  <span onClick={clearSelection}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#999' }}>
                      <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </span>
                </div>
              </div>}
              {selectedProducts.length > 1 && <div className='d-absolute bg-white' style={{ top: '2px', right: '2px', bottom: '2px', width: '200px' }}>
                <div className="d-flex align-items-center h-100 w-100">
                  <span className='d-flex ps-2' style={{ width: 'calc(100% - 22px)' }}>
                    Selected: {selectedProducts.length} products
                  </span>
                  <span onClick={clearSelection}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#999' }}>
                      <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </span>
                </div>
              </div>}
            </div>
            <form className="dropdown-menu p-4 w-100">
              <div className='text-end'>
                <button className="btn btn-primary btn-sm" type='button' onClick={checkAll}>{isAllChecked ? 'Unselect All' : 'Select All'}</button>
              </div>
              <ul className="list-group overflow-auto" ref={scrollRef} style={{ maxHeight: '400px', minWidth: '400px' }}>
                {products.length === 0 && <li className='list-group-item cursor-not-allowed'>No product</li>}
                {products.length > 0 && products.map((product, index) => {
                  if (index === products.length - 1 && !mappingCompleted) setTimeout(() => setMappingCompleted(true), 0);
                  return (
                    <li className="list-group-item" key={`product${index}`} style={{ display: ([product.model_name, product.product_name].join('').toLowerCase().indexOf(searchChartProducts.toLowerCase()) < 0) ? 'hidden' : 'block' }}>
                      <label className='d-flex align-items-center flex-row'>
                        <div className="d-flex pe-3">
                          <input type="checkbox" value={product.id ?? 0} onClick={checkSelected} defaultChecked={index < 30} />
                        </div>
                        <div className="d-flex">
                          <img src={product.image_link} className='rounded-lg' alt='' style={{ width: '36px' }} />
                        </div>
                        <div className="d-block text-nowrap ps-3 overflow-hidden" style={{ textOverflow: 'ellipsis', flex: 1 }}>
                          {product.product_name} / {product.model_name}
                        </div>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </form>
          </div>
        </div>
        <div className="col-md-3 border">
          <Select
            className='react-select-styled react-select-solid react-select-sm'
            onChange={(e) => setChartPeriod(e?.value ?? '')}
            options={periods}
            defaultValue={{ value: '1', label: 'Last 12 months, by month' }}
            isSearchable={false}
          />
        </div>
        <div className="col-md-2">
          <button type='button' className='btn btn-primary' onClick={handleChartFilter}>
            <i className="bi bi-funnel"></i>
            Filter
          </button>
        </div>
      </div>
      <div className={`card ${className}`}>
        {/* <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Recent Orders</span>
          </h3>
          <div className='card-toolbar' data-kt-buttons='true'>
            <a
              className='btn btn-sm btn-color-muted btn-active btn-active-primary active px-4 me-1'
              id='kt_charts_widget_6_sales_btn'
            >
              Sales
            </a>
            <a
              className='btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1'
              id='kt_charts_widget_6_expenses_btn'
            >
              Expenses
            </a>
          </div>
        </div> */}
        <div className='card-body'>
          <div ref={chartRef} id='kt_charts_widget_6_chart' style={{ height: '350px' }}></div>
        </div>
      </div>
      {orders.length ? <div className='row'>
        <TableProductsOrders orders={orders} />
      </div> : <></>}
    </div>
  )
}