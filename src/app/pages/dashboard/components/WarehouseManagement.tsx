import { useEffect, useState } from 'react';
import { Content } from '../../../../_metronic/layout/components/content';
import { WarehouseType } from '../../models/warehouse';
import { createWarehouse, deleteWarehouse, getWarehouses, updateWarehouse } from './_request';

const WarehouseTable: React.FC<{
  warehouses: WarehouseType[],
  setEditID: React.Dispatch<React.SetStateAction<number>>,
  setRemoveID: React.Dispatch<React.SetStateAction<number>>,
}> = props => (
  <table className="table table-rounded table-bordered border gy-7 gs-7">
    <thead>
      <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
        <th></th>
        <th className='text-center'>Warehouse Name</th>
        <th className='text-center'>Sender Name</th>
        <th className='text-center'>Sender Contact</th>
        <th className='text-center'>Phone Number</th>
        <th className='text-center'>Legal Entity</th>
        <th className='text-center'>Locality ID</th>
        <th className='text-center'>Street</th>
        <th className='text-center'>Zip Code</th>
        <th className='text-center'>Action</th>
      </tr>
    </thead>
    <tbody>
      {
        props.warehouses.map((warehouse, index) =>
          <tr key={index}>
            <td className="text-end align-content-center">{index + 1}</td>
            <td className='align-content-center'>{warehouse.name}</td>
            <td className='align-content-center'>{warehouse.sender_name}</td>
            <td className='align-content-center'>{warehouse.sender_contact}</td>
            <td className='align-content-center'>{warehouse.phone1}{!!warehouse.phone2 && <><br />{warehouse.phone2}</>}</td>
            <td className='text-center align-content-center'>
              <div className="col-md-6">
                <div className="form-check form-switch form-check-custom form-check-solid m-auto" style={{ width: 'fit-content' }}>
                  <input className="form-check-input" type="checkbox" checked={warehouse.legal_entity} onChange={() => { }} />
                </div>
              </div>
            </td>
            <td className="text-center align-content-center">{warehouse.locality_id}</td>
            <td className='text-center align-content-center'>{warehouse.street}</td>
            <td className='text-center align-content-center'>{warehouse.zipcode}</td>
            <td className='text-center align-content-center'>
              <a className='btn btn-white btn-active-light-primary btn-sm p-2' onClick={() => props.setEditID(index)} title='Edit warehouse'>
                <i className="bi bi-pencil-square fs-3 p-1"></i>
              </a>
              <a className='btn btn-white btn-active-light-danger btn-sm p-2' onClick={() => props.setRemoveID(warehouse.id ?? -1)} title='Delete warehouse'>
                <i className="bi text-danger bi-slash-circle fs-3 p-1"></i>
              </a>
            </td>
          </tr>
        )
      }
    </tbody>
  </table>
)

const AddNewWarehouse: React.FC<{
  edit: boolean;
  product?: WarehouseType;
  setCurWarehouse: React.Dispatch<React.SetStateAction<WarehouseType>>;
  setEditID: React.Dispatch<React.SetStateAction<number>>;
  save?: boolean;
  setSave?: React.Dispatch<React.SetStateAction<boolean>>;
}> = props => {
  const [currentWarehouse, setCurrentWarehouse] = useState<WarehouseType>({
    name: '',
    sender_name: '',
    sender_contact: '',
    legal_entity: false,
    locality_id: 0,
    phone1: '',
    phone2: '',
    street: '',
    zipcode: '',
  });

  useEffect(() => {
    if (props.edit === true && props.product) {
      setCurrentWarehouse(props.product);
    }
  }, [props.edit, props.product])

  const confirm = () => {
    props.setCurWarehouse(currentWarehouse);
    if (props.edit === false) {
      props.setEditID(-3);
      createWarehouse(currentWarehouse)
        .catch(e => console.error(e));
    } else {
      updateWarehouse(currentWarehouse.id ?? 0, currentWarehouse)
        .catch(e => console.error(e));
      if (props.setSave) {
        props.setSave(true);
      }
    }
  }

  const discard = () => {
    props.setEditID(-1)
  }

  return (
    <div className='w-50 align-content-center m-auto'>
      <div className="card card-custom card-flush">
        <div className="card-header">
          <h3 className="card-title">Add New Warehouse</h3>
        </div>
        <div className="card-body py-2">
          <div className="row mb-8">
            <div className="col-md-6 form-label align-content-center">Warehouse Name</div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="Warehouse Name"
                value={currentWarehouse.name}
                onChange={e => setCurrentWarehouse({ ...currentWarehouse, "name": e.target.value })}
              />
            </div>
          </div>
          <div className="row mb-8">
            <div className="col-md-6 form-label align-content-center">Sender Name</div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="Sender Name"
                value={currentWarehouse.sender_name}
                onChange={e => setCurrentWarehouse({ ...currentWarehouse, sender_name: e.target.value })}
              />
            </div>
          </div>
          <div className="row mb-8">
            <div className="col-md-6 form-label align-content-center">Sender Contact</div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="Sender Contact"
                value={currentWarehouse.sender_contact}
                onChange={e => setCurrentWarehouse({ ...currentWarehouse, sender_contact: e.target.value })}
              />
            </div>
          </div>
          <div className="row mb-8">
            <div className="col-md-6 form-label align-content-center">Phone Number 1</div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="Phone Number 1"
                value={currentWarehouse.phone1}
                onChange={e => setCurrentWarehouse({ ...currentWarehouse, phone1: e.target.value })}
              />
            </div>
          </div>
          <div className="row mb-8">
            <div className="col-md-6 form-label align-content-center">Phone Number 2</div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="Phone Number 2 (Optional)"
                value={currentWarehouse.phone2}
                onChange={e => setCurrentWarehouse({ ...currentWarehouse, phone2: e.target.value })}
              />
            </div>
          </div>
          <div className="row mb-8">
            <div className="col-md-6 form-label align-content-center">Legal Entity</div>
            <div className="col-md-6">
              <div className="form-check form-switch form-check-custom form-check-solid m-auto" style={{ width: 'fit-content' }}>
                <input className="form-check-input" type="checkbox" checked={currentWarehouse.legal_entity} onChange={(e) => setCurrentWarehouse({ ...currentWarehouse, legal_entity: e.target.checked })} />
              </div>
            </div>
          </div>
          <div className="row mb-8">
            <div className="col-md-6 form-label align-content-center">Locality ID</div>
            <div className="col-md-6">
              <input
                type="number"
                className="form-control form-control-solid"
                placeholder="Locality ID"
                value={currentWarehouse.locality_id}
                min={0}
                max={4294967295}
                onChange={e => setCurrentWarehouse({ ...currentWarehouse, locality_id: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="row mb-8">
            <div className="col-md-6 form-label align-content-center">Street</div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="Street"
                value={currentWarehouse.street}
                onChange={e => setCurrentWarehouse({ ...currentWarehouse, street: e.target.value })}
              />
            </div>
          </div>
          <div className="row mb-8">
            <div className="col-md-6 form-label align-content-center">Zip Code</div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="Zip Code"
                value={currentWarehouse.zipcode}
                onChange={e => setCurrentWarehouse({ ...currentWarehouse, zipcode: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="card-footer pt-2">
          <div className="card-toolbar align-content-center text-center">
            <button type="button" onClick={() => confirm()} className="btn btn-sm btn-light btn-light-primary mx-4">
              {
                props.edit == false ?
                  <><i className="bi bi-database-fill-add"></i> Add</>
                  :
                  <><i className="bi bi-save"></i> Edit</>
              }
            </button>
            <button type="button" onClick={() => discard()} className="btn btn-sm btn-light btn-light-danger">
              <i className="bi bi-x"></i> Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function WarehouseManagement() {
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([])
  const [editId, setEditID] = useState<number>(-1);
  const [removeId, setRemoveID] = useState<number>(-1);
  const [curWarehouse, setCurWarehouse] = useState<WarehouseType>({
    name: '',
    sender_name: '',
    sender_contact: '',
    legal_entity: false,
    locality_id: 0,
    phone1: '',
    phone2: '',
    street: '',
    zipcode: '',
  });
  const [save, setSave] = useState<boolean>(false);

  useEffect(() => {
    getWarehouses()
      .then(res => res.data)
      .then(res => setWarehouses(res))
      .catch(e => console.error(e));
  }, [])

  useEffect(() => {
    if (editId === -3) {
      setEditID(-1);
      setWarehouses([...warehouses, curWarehouse]);
    }
  }, [curWarehouse, editId, warehouses])

  useEffect(() => {
    if (removeId > -1) {
      deleteWarehouse(removeId)
        .then(() => setWarehouses(warehouses.filter((warehouse) => warehouse.id !== removeId)))
      setRemoveID(-1);
    }
  }, [removeId, warehouses])

  useEffect(() => {
    if (save === true) {
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
              <i className="bi bi-database-fill-add"></i> Add
            </button>
          </div>
          : <></>
      }
      {
        editId == -1 ?
          <WarehouseTable setEditID={setEditID} warehouses={warehouses} setRemoveID={setRemoveID} />
          : editId == -2 ?
            <AddNewWarehouse edit={false} setEditID={setEditID} setCurWarehouse={setCurWarehouse} />
            : <AddNewWarehouse edit={true} setEditID={setEditID} setCurWarehouse={setCurWarehouse} product={warehouses[editId]} save={save} setSave={setSave} />
      }
    </Content>
  )
}