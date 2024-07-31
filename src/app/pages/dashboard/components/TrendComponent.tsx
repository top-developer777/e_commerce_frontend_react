import { useEffect, useRef, useState } from "react";
import Select from 'react-select';
import { Product } from "../../models/product";
import { getAllProducts, getTrendInfo } from "./_request";

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
const getCategories = (type = 1) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const today = new Date();
  const result: string[] = [];
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();
  if (type === 1) {
    result.push(`${months[currentMonth]} 1-${currentDate} ${currentYear}`);
    for (let i = 0; i < 12; i++) {
      const date = new Date(today);
      date.setMonth(currentMonth - i - 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      result.push(`${months[month]} ${year}`);
    }
  } else if (type === 2) {
    let weekNumber = 1;
    const getMonthWeeks = (year: number, month: number) => {
      const weeks = [];
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      const startOfWeek = new Date(firstDayOfMonth);
      while (startOfWeek <= lastDayOfMonth) {
        let endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        if (endOfWeek > lastDayOfMonth) {
          endOfWeek = lastDayOfMonth;
        }
        weeks.push(`Week ${weekNumber}`);
        weekNumber++;
        startOfWeek.setDate(startOfWeek.getDate() + 7);
      }
      return weeks;
    }
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth();
      const weeks = getMonthWeeks(year, month);
      result.push(...weeks);
    }
  } else if (type === 3) {
    for (let i = 0; i < 31; i++) {
      const date = new Date(today);
      date.setDate(currentDate - i);
      result.push(`${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`);
    }
  } else { /* empty */ }
  return result;
}

export const TrendComponent = () => {
  const [trendData, setTrendDdata] = useState<number[][]>([]);
  const [trendPeriod, setTrendPeriod] = useState<string>('1');
  const [searchTrendProducts, setSearchTrendProducts] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isAllChecked, setIsAllChecked] = useState<boolean>(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const scrollRef = useRef<HTMLUListElement | null>(null);
  const [mappingCompleted, setMappingCompleted] = useState<boolean>(false);
  const [field, setField] = useState<string>('sales');
  const [categories, setCategories] = useState<string[]>(getCategories(1));
  const [checkedProducts, setCheckedProducts] = useState<number[]>([]);

  const handleTrendFilter = () => {
    setCategories(getCategories(parseInt(trendPeriod)));
    const inputs = scrollRef.current?.querySelectorAll('li input[type="checkbox"]') as unknown as HTMLInputElement[];
    const productIds = [];
    if (inputs) for (const input of inputs) {
      if (input.checked) productIds.push(input.value);
    }
    setCheckedProducts(productIds.map(id => parseInt(id)));
    getTrendInfo(parseInt(trendPeriod), field, productIds.join(','))
      .then(res => setTrendDdata(res.data.trends_data))
      .catch(e => console.error(e));
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
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    if (mappingCompleted) {
      checkSelected();
      handleTrendFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappingCompleted]);
  useEffect(() => {
    getTrendInfo(parseInt(trendPeriod), field, checkedProducts.join(','))
      .then(res => setTrendDdata(res.data.trends_data))
      .catch(e => console.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field])

  return (
    <div className="tab-pane fade" id="dashboard-trends" role="tabpanel">
      <div className="row">
        <div className="col-md-7">
          <div className="dropdown">
            <div className="input-group" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
              <span className="input-group-text" id="products"><i className="bi bi-search"></i></span>
              <input type="text" className="form-control" onChange={(e) => setSearchTrendProducts(e.target.value)} name='products' autoComplete='false' placeholder="Search products by name, tag, SKU, ASIN" />
              {selectedProducts.length === 0 && <></>}
              {selectedProducts.length === 1 && <div className='d-absolute bg-white' style={{ top: '2px', right: '2px', bottom: '2px', width: '200px' }}>
                <div className="d-flex align-items-center h-100 w-100">
                  <span className='d-flex'>
                    <img src={products[parseInt(selectedProducts[0])].image_link} alt="" width={30} height={30} />
                  </span>
                  <span className='overflow-hidden text-nowrap ps-2' style={{ textOverflow: 'ellipsis', maxWidth: 'calc(100% - 36px - 22px)' }}>{products.find(product => parseInt(selectedProducts[0]) === product.id)?.product_name}</span>
                  <span onClick={clearSelection} className="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#999' }}>
                      <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </span>
                </div>
              </div>}
              {selectedProducts.length > 1 && <div className='d-absolute bg-white' style={{ top: '2px', right: '2px', bottom: '2px', width: '200px' }}>
                <div className="d-flex align-items-center h-100 w-100">
                  <span className='d-flex ps-2'>
                    Selected: {selectedProducts.length} products
                  </span>
                  <span onClick={clearSelection} className="cursor-pointer">
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
                {products.map((product, index) => {
                  if (index === products.length - 1 && !mappingCompleted) setTimeout(() => setMappingCompleted(true), 0);
                  return (
                    <li className="list-group-item" key={`product${index}`} style={{ display: ([product.model_name, product.product_name].join('').toLowerCase().indexOf(searchTrendProducts.toLowerCase()) < 0) ? 'hidden' : 'block' }}>
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
            onChange={(e) => setTrendPeriod(e?.value ?? '')}
            options={periods}
            defaultValue={{ value: '1', label: 'Last 12 months, by month' }}
            isSearchable={false}
          />
        </div>
        <div className="col-md-2">
          <button type='button' className='btn btn-primary' onClick={handleTrendFilter}>
            <i className="bi bi-funnel"></i>
            Filter
          </button>
        </div>
      </div>
      <div className="row my-3 mx-3">
        <div className="col-md-12 border border-1">
          <button className={`btn btn-light-primary py-1 px-2 m-3${field === 'sales' ? ' active' : ''}`} onClick={() => setField('sales')}>Sales</button>
          <button className={`btn btn-light-primary py-1 px-2 m-3${field === 'units' ? ' active' : ''}`} onClick={() => setField('units')}>Units</button>
          <button className={`btn btn-light-primary py-1 px-2 m-3${field === 'refund' ? ' active' : ''}`} onClick={() => setField('refund')}>Refund</button>
          <button className={`btn btn-light-primary py-1 px-2 m-3${field === 'gross_profit' ? ' active' : ''}`} onClick={() => setField('gross_profit')}>Gross Profit</button>
          <button className={`btn btn-light-primary py-1 px-2 m-3${field === 'net_profit' ? ' active' : ''}`} onClick={() => setField('net_profit')}>Net Profit</button>
        </div>
      </div>
      <div className="card-body table-responsive">
        <table className="table table-bordered table-hover cursor-pointer">
          <thead>
            <tr>
              <th className="start-0 position-sticky bg-white">Product</th>
              {categories.map((cat, index) => <th key={`trendheader${index}`} className="text-nowrap">{cat}</th>)}
            </tr>
          </thead>
          <tbody>
            {!!trendData.length && !!trendData[0].length &&
              trendData[0].map((_, i) => (
                <tr key={`trend${i}`}>
                  <td className="start-0 position-sticky bg-white"><img src={products.find(product => product.id === checkedProducts[i])?.image_link ?? ''} alt={`product${checkedProducts[i]}`} width={50} /></td>
                  {trendData.map((trend, index) => <td key={`trend(${i})(${index})`} className="align-content-center text-end">{parseFloat(trend[i].toString()).toFixed(3)}</td>)}
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}