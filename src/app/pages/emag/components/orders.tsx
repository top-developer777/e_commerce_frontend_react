import { useEffect, useState } from "react"
import Select from 'react-select';
import { Content } from "../../../../_metronic/layout/components/content"
import { generateAWB, getEmagOrders } from "./_request"
import { EmagOrder } from "../../models/emagOrder";
import { darkModeStyles } from "../../../../_metronic/partials";

const observations = [
  { value: 'EAN', label: 'EAN' },
  { value: 'SKU', label: 'SKU' },
];

export const EmagOrders = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [emagOrders, setEmagOrders] = useState<EmagOrder[]>([]);
  const [orderID, setOrderID] = useState<number>(0);
  const [observation, setObservation] = useState<string[]>(['EAN']);

  setInterval(() => {
    if (localStorage.getItem('kt_theme_mode_value') === 'dark') setIsDarkMode(true);
    else setIsDarkMode(false);
  }, 100);
  useEffect(() => {
    getEmagOrders()
      .then(res => setEmagOrders(res.data))
      .catch(e => console.error(e));
    setEmagOrders([{
      id: "This is fake Order"
    }])
  }, []);

  const handleFilter = () => {

  }
  const handleGenerate = () => {
    generateAWB(orderID, observation.join(','))
      .then()
      .catch(e => console.error(e))
  }

  return (
    <Content>
      <div className="row">
        <div className="col-md-6"></div>
        <div className="col-md-6 text-end">
          <button className="btn btn-primary" onClick={handleFilter}>Filter</button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 table-responsive">
          <table className="table table-rounded table-hover table-striped table-row-bordered border gy-7 gs-7" id='table-shipment'>
            <thead>
              <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                <th className='align-content-center'>Order ID</th>
                <th className='align-content-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                emagOrders.map((order, index) => {
                  return (
                    <tr key={`emagOrder${index}`}>
                      <td>{order.id}</td>
                      <td>
                        <a href="#" data-bs-toggle="modal" data-bs-target="#generateModal" onClick={() => setOrderID(parseInt(order.id))}>
                          Generate AWB
                        </a>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
      <div className="modal fade" id='generateModal' tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Generate Observation</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form action="" method='post'>
                {/* <label className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Shipment ID:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='shipment_id' placeholder="Shipment ID" />
                    </div>
                  </div>
                </label> */}
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Observation:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <Select
                      name='observation'
                      className='react-select-styled react-select-solid react-select-sm w-100'
                      theme={isDarkMode ? darkModeStyles : undefined}
                      options={observations}
                      placeholder='Select observations'
                      isSearchable={false}
                      isMulti
                      noOptionsMessage={e => `No more observations${e.inputValue}`}
                      defaultValue={[observations[0]]}
                      onChange={values => setObservation(values.map(value => value.value))}
                    />
                  </div>
                </div>
                <div className="d-flex my-10"></div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { setObservation(['EAN']); setOrderID(-1) }}><i className="bi bi-x"></i>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleGenerate}><i className="bi bi-hammer"></i>Create AWB</button>
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
}