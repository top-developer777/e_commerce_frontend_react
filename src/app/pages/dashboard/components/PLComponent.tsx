import { useEffect, useRef, useState } from "react";
import Select from 'react-select'
import { getPLInfo } from "./_request";
import { Product } from "../../models/product";
import { getAllProducts } from "./_request";

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

export const PLComponent = () => {
  const [PLData, setPLDdata] = useState<{ [key: string]: [] }[]>([]);
  const [PLPeriod, setPLPeriod] = useState<string>('1');
  const [searchPLProducts, setSearchPLProducts] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isAllChecked, setIsAllChecked] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [mappingCompleted, setMappingCompleted] = useState<boolean>(false);
  const scrollRef = useRef<HTMLUListElement | null>(null);

  const handlePLFilter = () => {
    const inputs = scrollRef.current?.querySelectorAll('li input[type="checkbox"]') as unknown as HTMLInputElement[];
    const productIds = [];
    if (inputs) for (const input of inputs) {
      if (input.checked) productIds.push(input.value);
    }
    getPLInfo(parseInt(PLPeriod), productIds.join(','))
      .then(res => {
        if (res.status === 200) {
          const data = res.data.PL_data;
          setPLDdata(data);
        }
      })
      .catch(res => console.error(res));
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
      input.checked = !isAllChecked;
      setIsAllChecked(!isAllChecked);
      checkSelected();
    }
  }

  useEffect(() => {
    getAllProducts(1, 1000)
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.log(err));
  }, []);
  useEffect(() => {
    if (mappingCompleted) handlePLFilter();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappingCompleted]);

  return (
    <div className="tab-pane fade" id="dashboard-pl" role="tabpanel">
      <div className="row">
        <div className="col-md-7">
          <div className="dropdown">
            <div className="input-group" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
              <span className="input-group-text" id="products"><i className="bi bi-search"></i></span>
              <input type="text" className="form-control" onChange={(e) => setSearchPLProducts(e.target.value)} name='products' autoComplete='false' placeholder="Search products by name, tag, SKU, ASIN" />
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
                    <li className="list-group-item" key={`product${index}`} style={{ display: ([product.model_name, product.product_name].join('').toLowerCase().indexOf(searchPLProducts.toLowerCase()) < 0) ? 'hidden' : 'block' }}>
                      <label className='d-flex align-items-center flex-row'>
                        <div className="d-flex pe-3">
                          <input type="checkbox" value={product.id} onClick={checkSelected} defaultChecked={true} />
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
            onChange={(e) => setPLPeriod(e?.value ?? '')}
            options={periods}
            defaultValue={{ value: '1', label: 'Last 12 months, by month' }}
            isSearchable={false}
          />
        </div>
        <div className="col-md-2">
          <button type='button' className='btn btn-primary' onClick={handlePLFilter}>
            <i className="bi bi-funnel"></i>
            Filter
          </button>
        </div>
      </div>
      <div className="card-body table-responsive">
        <table className="table table-bordered table-hover cursor-pointer">
          <thead>
            <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th className="bg-white" style={{ position: 'sticky', left: '0' }}>Parameter</th>
              {PLData.map((datum, index) => <th key={`param${index}`} className='text-end'>{datum.date_string}</th>)}
            </tr>
          </thead>
          <tbody className="table-group-divider">
            <tr>
              <td className="bg-white" style={{ position: 'sticky', left: '0' }}>Sales</td>
              {PLData.map((datum, index) => <td key={`sales${index}`} className='text-end'>{datum.total_sales}</td>)}
            </tr>
            <tr>
              <td className="bg-white" style={{ position: 'sticky', left: '0' }}>Units</td>
              {PLData.map((datum, index) => <td key={`units${index}`} className='text-end'>{datum.total_units}</td>)}
            </tr>
            <tr>
              <td className="bg-white" style={{ position: 'sticky', left: '0' }}>Refund</td>
              {PLData.map((datum, index) => <td key={`refund${index}`} className='text-end'>{datum.total_refund}</td>)}
            </tr>
            <tr>
              <td className="bg-white" style={{ position: 'sticky', left: '0' }}>Gross Profit</td>
              {PLData.map((datum, index) => <td key={`gross${index}`} className='text-end'>{datum.total_gross_profit}</td>)}
            </tr>
            <tr>
              <td className="bg-white" style={{ position: 'sticky', left: '0' }}>Net Profit</td>
              {PLData.map((datum, index) => <td key={`profit${index}`} className='text-end'>{datum.total_net_profit}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}