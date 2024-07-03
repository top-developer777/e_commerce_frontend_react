import { useEffect, useState } from 'react'
import { Content } from '../../../../_metronic/layout/components/content'

const fakeWarehouses = [
  {
    "name": "warehouse1",
    "company_name": "Amazon Headquarters",
    "company_address": "410 Terry Ave N, Seattle, WA 98109, USA",
    "email": "amazon@amazon.com",
    "phone": "206-266-1000",
    "zip_code": "98109"
  },
  {
      "name": "warehouse2",
      "company_name": "Google Inc.",
      "company_address": "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
      "email": "contact@google.com",
      "phone": "650-253-0000",
      "zip_code": "94043"
  },
  {
      "name": "warehouse3",
      "company_name": "Microsoft Corporation",
      "company_address": "One Microsoft Way, Redmond, WA 98052, USA",
      "email": "contact@microsoft.com",
      "phone": "425-882-8080",
      "zip_code": "98052"
  },
  {
      "name": "warehouse4",
      "company_name": "Facebook, Inc.",
      "company_address": "1 Hacker Way, Menlo Park, CA 94025, USA",
      "email": "info@facebook.com",
      "phone": "650-543-4800",
      "zip_code": "94025"
  }
]

interface Warehouse {
  name: string,
  company_name: string,
  company_address: string,
  email: string,
  phone: string,
  zip_code: string
}

const WarehouseTable:React.FC<{
  warehouses: Warehouse[],
  setEditID: React.Dispatch<React.SetStateAction<number>>,
  setRemoveID: React.Dispatch<React.SetStateAction<number>>,
}> = props => (
  <table className="table table-rounded table-row-bordered border gy-7 gs-7">
    <thead>
        <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
          <th className='col-md-1'>Warehouse Name</th>
          <th className='col-md-2'>Company Name</th>
          <th className='col-md-2'>Company Address</th>
          <th className='col-md-2'>Email</th>
          <th className='text-center col-md-1'>Phone Number</th>
          <th className='text-center col-md-1'>Zip Code</th>
          <th className='text-center col-md-1'>Action</th>
        </tr>
    </thead>
    <tbody>
      {
        props.warehouses.map((warehouse, index) => 
          <tr key={index}>
            <td className='align-content-center'>
              {
                warehouse.name
              }
            </td>
            <td className='align-content-center'>
              {
                warehouse.company_name
              }
            </td>
            <td className='align-content-center'>
              {
                warehouse.company_address
              }
            </td>
            <td className='align-content-center'>
              {
                warehouse.email
              }
            </td>
            <td className='text-center align-content-center'>
              {
                warehouse.phone
              }
            </td>
            <td className='text-center align-content-center'>
              {
                warehouse.zip_code
              }
            </td>
            <td className='text-center align-content-center'>
              <a className='btn btn-white btn-active-light-primary btn-sm p-2' onClick={() => props.setEditID(index)}>
                <i className="bi bi-pencil-square fs-3 p-1"></i>
              </a>
              <a className='btn btn-white btn-active-light-danger btn-sm p-2' onClick={() => props.setRemoveID(index)}>
                <i className="bi text-danger bi-slash-circle fs-3 p-1"></i>
              </a>
            </td>
          </tr>
        )
      }
    </tbody>
  </table>
)

const AddNewWarehouse:React.FC<{
  edit: boolean;
  setCurWarehouse: React.Dispatch<React.SetStateAction<Warehouse>>;
  setEditID: React.Dispatch<React.SetStateAction<number>>;
  product?: Warehouse;
  save?: (state: boolean) => void;
}> = props => {
  const [currentWarehouse, setCurrentWarehouse] = useState({
    "name": "",
    "company_name": "",
    "company_address": "",
    "email": "",
    "phone": "",
    "zip_code": ""
  });

  useEffect(() => {
    if(props.edit === true && props.product){
      setCurrentWarehouse(props.product);
    }
  }, [props.edit, props.product])

  const confirm = () => {
    props.setCurWarehouse(currentWarehouse);
    if(props.edit === false){
      props.setEditID(-3);
    } else {
      if (props.save) props.save(true);
    }
  }

  const discard = () => {
    props.setEditID(-1)
  }
  
  return (
    <div className='col-xl-4 align-content-center'>
      <div className="card card-custom card-flush">
        <div className="card-header">
            <h3 className="card-title">Add New Warehouse</h3>
        </div>
        <div className="card-body py-2">
          <div className='row'>
            <div>
              <div className="mb-8">
                <label className="form-label">Warehouse Name</label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Warehouse Name"
                  value={currentWarehouse["name"]}
                  onChange={e => setCurrentWarehouse({...currentWarehouse, "name": e.target.value})}
                />
              </div>
              <div className="mb-8">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Company Name"
                  value={currentWarehouse["company_name"]}
                  onChange={e => setCurrentWarehouse({...currentWarehouse, "company_name": e.target.value})}
                />
              </div>
              <div className="mb-8">
                <label className="form-label">Company Address</label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Company Address"
                  value={currentWarehouse["company_address"]}
                  onChange={e => setCurrentWarehouse({...currentWarehouse, "company_address": e.target.value})}
                />
              </div>
              <div className="mb-8">
                <label className="form-label">Email</label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Email"
                  value={currentWarehouse["email"]}
                  onChange={e => setCurrentWarehouse({...currentWarehouse, "email": e.target.value})}
                />
              </div>
              <div className='row'>
                <div className="col-xl-6 mb-8">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="Phone Number"
                    value={currentWarehouse["phone"]}
                    onChange={e => setCurrentWarehouse({...currentWarehouse, "phone": e.target.value})}
                  />
                </div>
                <div className="col-xl-6 mb-8">
                  <label className="form-label">Zip Code</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="Zip Code"
                    value={currentWarehouse["zip_code"]}
                    onChange={e => setCurrentWarehouse({...currentWarehouse, "zip_code": e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer pt-2">
          <div className="card-toolbar align-content-center text-center">
            <button type="button" onClick={() => confirm()} className="btn btn-sm btn-light btn-light-primary mx-4 w-90px">
              {
                props.edit == false ?
                  <>Add</>
                :
                  <>Edit</>
              }
            </button>
            <button type="button" onClick={() => discard()} className="btn btn-sm btn-light btn-light-danger w-90px">
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function WarehouseManagement() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [editId, setEditID] = useState<number>(-1);
  const [removeId, setRemoveID] = useState<number>(-1);
  const [curWarehouse, setCurWarehouse] = useState<Warehouse>({
    name: "",
    company_name: "",
    company_address: "",
    email: "",
    phone: "",
    zip_code: ""
  });
  const [save, setSave] = useState<boolean>(false);

  useEffect(() => {
    setWarehouses(fakeWarehouses)
  }, [])

  useEffect(() => {
    if(editId === -3){
      setEditID(-1);
      setWarehouses([...warehouses, curWarehouse]);
    }
  }, [curWarehouse, editId, warehouses])

  useEffect(() => {
    if(removeId > -1){
      setWarehouses(warehouses.filter((warehouse, index) => index != removeId))
      setRemoveID(-1);
    }
  }, [removeId, warehouses])

  useEffect(() => {
    if(save == true){
      const objs = warehouses;
      objs[editId] = curWarehouse;
      setWarehouses(objs)
      setEditID(-1);
      setSave(false);
    }
  }, [curWarehouse, editId, save, warehouses])

  return (
    <Content>
      {
        editId == -1 ?
          <div className='d-flex flex-wrap flex-stack mb-6'>
            <button type='button' className='btn btn-light btn-light-primary' onClick={() => setEditID(-2)}>
              Add
            </button>
          </div>
        : <></>
      }
      {
        editId == -1 ?
          <WarehouseTable setEditID={setEditID} warehouses={warehouses} setRemoveID={setRemoveID} />
        : editId == -2 ?
          <AddNewWarehouse edit={false} setEditID={setEditID} setCurWarehouse={setCurWarehouse}/>
        : <AddNewWarehouse edit={true} setEditID={setEditID} setCurWarehouse={setCurWarehouse} product={warehouses[editId]} save={setSave}/>
      }
    </Content>
  )
}