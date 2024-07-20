import { Content } from '../../../../_metronic/layout/components/content'
import React, { useState, useCallback, useEffect } from 'react'
import Select from 'react-select'
import { useDropzone } from 'react-dropzone'
import { createMarketplace, editMarketplace, getAllMarketplaces, removeMarketplace, uploadImage } from "./_request";

const flags = {
  "ro": "romania",
  "bg": "bulgaria",
  "hu": "hungary"
}
const API_URL = import.meta.env.VITE_APP_API_URL

const DragDropFileUpload: React.FC<{
  isShow: boolean,
  setImg: React.Dispatch<React.SetStateAction<string>>
}> = (props) => {
  const onDrop = useCallback(async (acceptedFile: File[]) => {
    const formData = new FormData();
    formData.append('file', acceptedFile[0]);

    let res;
    try {
      res = await uploadImage(formData)
      console.log('File uploaded successfully:', res);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    props.setImg(res.filepath.replace('uploads/', 'upload/'))
    console.log(acceptedFile);
  }, [props]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} h-100 align-content-center`} style={{ display: props.isShow ? 'block' : 'none' }}>
      <input {...getInputProps()} accept='image/*' />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  );
};

interface interCred {
  type: string, firstKey: string, secondKey: string
}
interface interProdCrud {
  endpoint: string, create: string, read: string, update: string, delete: string, count: string
}
interface interOrderCrud {
  endpoint: string, create: string, read: string, update: string, delete: string, count: string
}
export interface interMKP {
  id?: number;
  country: 'bg' | 'ro' | 'hu';
  credentials: interCred;
  products_crud: interProdCrud;
  orders_crud: interOrderCrud;
  title: string;
  baseURL: string;
  baseAPIURL: string;
  marketplaceDomain: string;
  owner: string;
  image_url?: string;
  vat: number;
  proxy?: string;
}

export function Integrations() {
  const [editID, setEditID] = useState(-2);
  const [editImg, setEditImg] = useState('');
  const [addCredWay, setAddCredentials] = useState('user_pass');
  const [addcredentials, setCredentials] = useState<interCred>({ type: 'user_pass', firstKey: '', secondKey: '' });
  const [addproductsCURD, setProductsCURD] = useState<interProdCrud>({ endpoint: '/product_offer', create: '/create', read: '/read', update: '/update', delete: '/delete', count: '/count' });
  const [addordersCRUD, setOrdersCRUD] = useState<interOrderCrud>({ endpoint: '/order', create: '/create', read: '/read', update: '/update', delete: '/delete', count: '/count' });
  const [addMarketplace, setAddMarketPlace] = useState<interMKP>({
    country: 'ro',
    credentials: addcredentials,
    products_crud: addproductsCURD,
    orders_crud: addordersCRUD,
    title: 'eMAG Marketplace (Romania)',
    baseURL: 'https://marketplace.emag.ro',
    baseAPIURL: 'https://marketplace-api.emag.ro/api-3',
    marketplaceDomain: 'eMAG.ro',
    owner: '',
    vat: 20,
    proxy: '',
  });
  const [allMarketplaces, setAllMarketPlaces] = useState<interMKP[]>([]);

  const optionsCred = [
    { value: 'user_pass', label: 'Username (email) / Password' },
    { value: 'pub_priv', label: 'Public Key / Private Key' },
  ];
  const optionsCountry = [
    { value: 'ro', label: 'Romania' },
    { value: 'bg', label: 'Bulgaria' },
    { value: 'hu', label: 'Hungary' },
  ];
  const optionsMKP = [
    { value: 'eMAG.ro', label: 'eMAG.ro' },
    { value: 'eMAG.bg', label: 'eMAG.bg' },
    { value: 'eMAG.hu', label: 'eMAG.hu' },
    { value: 'altex.ro', label: 'altex.ro' },
    { value: 'woocommerce.com', label: 'woocommerce.com' },
  ]

  useEffect(() => {
    getAllMarketplaces()
      .then(res => {
        setAllMarketPlaces(res.data)
      })
      .catch(e => console.error(e));
  }, [editID]);

  const onEdit = (index: number) => {
    setEditID(allMarketplaces[index].id ?? -1);
    setEditImg(allMarketplaces[index].image_url ?? '')
    setAddMarketPlace(allMarketplaces[index]);
    setCredentials(allMarketplaces[index].credentials);
    setProductsCURD(allMarketplaces[index].products_crud);
    setOrdersCRUD(allMarketplaces[index].orders_crud);
    setAddCredentials(allMarketplaces[index].credentials.type);
  }

  const onRemove = (index: number) => {
    removeMarketplace(allMarketplaces[index].id ?? -1)
      .then(res => {
        if (res.data.msg)
          setAllMarketPlaces(allMarketplaces.filter((_, idx) => idx != index))
      })
  }

  const onSubmit = async () => {
    setCredentials({ ...addcredentials, type: addCredWay })
    setAddMarketPlace({ ...addMarketplace, products_crud: addproductsCURD, orders_crud: addordersCRUD, credentials: addcredentials })
    const data = {
      ...addMarketplace,
      image_url: editImg,
      credentials: addcredentials
    }
    if ((
      data.baseAPIURL
      && data.baseURL
      && data.marketplaceDomain
      && data.title
      && data.credentials.firstKey
      && data.credentials.secondKey
      && data.orders_crud.create
      && data.orders_crud.count
      && data.orders_crud.delete
      && data.orders_crud.endpoint
      && data.orders_crud.delete
      && data.orders_crud.read
      && data.orders_crud.update
      && data.products_crud.create
      && data.products_crud.count
      && data.products_crud.delete
      && data.products_crud.endpoint
      && data.products_crud.delete
      && data.products_crud.read
      && data.products_crud.update
    ) === '') return;
    if (editID === -1) {
      const res = await createMarketplace(data)
      if (res.msg === 'success') setEditID(-2);
    } else {
      const res = await editMarketplace(editID, data);
      if (res.status === 200) setEditID(-2);
    }
  }
  const changeImage = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput.click();
  }
  return (
    <Content>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3>
          Marketplace Integration
        </h3>
        <div>
          {editID === -2 && <button type='button' className='btn btn-light btn-light-primary' onClick={() => { setEditID(-1); setEditImg('') }}>Add</button>}
        </div>
      </div>
      {
        editID === -2 ?
          <div className="row g-5 mb-4">
            {
              allMarketplaces.map((marketplace: interMKP, index) =>
                <div className='col-lg-3' key={index}>
                  <div className="card card-custom card-flush">
                    <div className="card-header px-6">
                      <h4 className="card-title">{marketplace.title}</h4>
                      <div className="card-toolbar">
                        <button type="button" onClick={() => onEdit(index)} className="btn btn-sm btn-light mx-3">
                          Edit
                        </button>
                        <button type="button" onClick={() => onRemove(index)} className="btn btn-sm btn-light btn-light-danger">
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="card-body py-5 mb-2">
                      <div className="row">
                        <div className="d-flex flex-center overflow-hidden" style={{ height: '100px' }}>
                          <img className="rounded" style={{ width: '75%' }} alt={marketplace.marketplaceDomain} src={`${API_URL}/utils/${marketplace.image_url ?? ''}`} />
                        </div>
                      </div>
                    </div>
                    <div className="card-footer p-4">
                      <img className="w-15px h-15px rounded-1 ms-2" src={`/media/flags/${flags[marketplace.country]}.svg`} alt={marketplace.country} />
                      &nbsp;&nbsp;{marketplace.marketplaceDomain}
                    </div>
                  </div>
                </div>
              )
            }
          </div>
          :
          <div className="card card-custom card-flush">
            <div className="card-header">
              <h3 className="card-title">{addMarketplace.title ? `Edit marketplace - ${addMarketplace.title}` : 'Create marketplace'}</h3>
            </div>
            <div className="card-body py-5">
              <div className='row'>
                <div className='d-flex col-lg-4 p-2'>
                  <DragDropFileUpload setImg={setEditImg} isShow={editImg === ''} />
                  <div className='align-content-center w-100 h-100 flex-column' style={{ display: editImg === '' ? 'none' : 'flex' }}>
                    <img className='d-flex mh-100 mw-100 m-auto' src={`${API_URL}/utils/${editImg}`} />
                    <div className="d-flex m-auto mb-0">
                      <button className="btn btn-sm btn-primary me-2" onClick={changeImage}>Change</button>
                      <button className="btn btn-sm btn-danger" onClick={() => setEditImg('')}>Remove</button>
                    </div>
                  </div>
                </div>
                <div className='col-lg-8'>
                  <div className="row mb-8">
                    <div className="col-md-6">
                      <label className="form-label">Marketplace Domain</label>
                      <Select
                        className='react-select-styled'
                        options={optionsMKP}
                        placeholder='Select Domain'
                        value={optionsMKP.filter(optionsMKP => optionsMKP.value === addMarketplace.marketplaceDomain)}
                        isSearchable={false}
                        onChange={e => {
                          if (e && e.value === 'eMAG.ro') {
                            setAddMarketPlace({
                              ...addMarketplace,
                              marketplaceDomain: 'eMAG.ro',
                              country: 'ro',
                              baseAPIURL: 'https://marketplace-api.emag.ro/api-3',
                              baseURL: 'https://marketplace.emag.ro/',
                              title: 'eMAG Marketplace (Romania)'
                            });
                          }
                          if (e && e.value === 'eMAG.bg') {
                            setAddMarketPlace({
                              ...addMarketplace,
                              marketplaceDomain: 'eMAG.bg',
                              country: 'bg',
                              baseAPIURL: 'https://marketplace-api.emag.bg/api-3',
                              baseURL: 'https://marketplace.emag.bg/',
                              title: 'eMAG Marketplace (Bulgaria)'
                            });
                          }
                          if (e && e.value === 'eMAG.hu') {
                            setAddMarketPlace({
                              ...addMarketplace,
                              marketplaceDomain: 'eMAG.hu',
                              country: 'hu',
                              baseAPIURL: 'https://marketplace-api.emag.hu/api-3',
                              baseURL: 'https://marketplace.emag.hu/',
                              title: 'eMAG Marketplace (Hungary)'
                            });
                          }
                          if (e && e.value === 'altex.ro') {
                            setAddMarketPlace({
                              ...addMarketplace,
                              marketplaceDomain: 'altex.ro',
                              country: 'ro',
                              baseAPIURL: '',
                              baseURL: '',
                              title: 'Altex Marketplace (Romania)'
                            });
                          }
                          if (e && e.value === 'woocommerce.com') {
                            setAddMarketPlace({
                              ...addMarketplace,
                              marketplaceDomain: 'woocommerce.com',
                              baseAPIURL: '',
                              baseURL: '',
                              title: 'Woocommerce Marketplace'
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Country</label>
                      <Select
                        className='react-select-styled'
                        options={optionsCountry}
                        placeholder='Select Country'
                        isSearchable={false}
                        value={optionsCountry.filter(country => country.value === addMarketplace.country)}
                        onChange={e => setAddMarketPlace({ ...addMarketplace, country: (e?.value ?? 'ro') as 'ro' | 'bg' | 'hu' })}
                      />
                    </div>
                  </div>
                  <div className="row mb-8">
                    <div className="col-md-6">
                      <label className="form-label">Marketplace Title</label>
                      <input
                        type="text"
                        className="form-control form-control-solid"
                        placeholder="eMAG Marketplace"
                        value={addMarketplace.title}
                        onChange={e => setAddMarketPlace({ ...addMarketplace, title: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Base URL</label>
                      <input
                        type="text"
                        className="form-control form-control-solid"
                        placeholder="https://marketplace.emag.ro/"
                        value={addMarketplace.baseURL}
                        onChange={e => setAddMarketPlace({ ...addMarketplace, baseURL: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label">Base API URL</label>
                      <input
                        type="text"
                        className="form-control form-control-solid"
                        placeholder="https://marketplace-api.emag.ro/api-3"
                        onChange={e => setAddMarketPlace({ ...addMarketplace, baseAPIURL: e.target.value })}
                        value={addMarketplace.baseAPIURL}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">VAT (%)</label>
                      <input
                        type="number"
                        className="form-control form-control-solid"
                        onChange={e => setAddMarketPlace({ ...addMarketplace, vat: parseFloat(e.target.value) })}
                        value={addMarketplace.vat}
                      />
                    </div>
                  </div>
                </div>
                {/* <div className='col-lg-4'>
                  <div className="mb-8">
                    <label className="form-label">Owner</label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      placeholder="admin@admin.com"
                      onChange={e => setAddMarketPlace({ ...addMarketplace, "owner": e.target.value })}
                      defaultValue={addMarketplace.owner}
                    />
                  </div>
                  <div className="mb-8">
                    <label className="form-label">Proxy</label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      placeholder="http://username:password@ipadress:port"
                      onChange={e => setAddMarketPlace({ ...addMarketplace, "owner": e.target.value })}
                      defaultValue={addMarketplace.owner}
                    />
                  </div>
                </div> */}
              </div>
              <div className="row my-10">
                <div className="col-md-3 text-end align-content-center fw-bold">
                  Proxy
                </div>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="http://username:password@hostname:port"
                    onChange={e => setAddMarketPlace({ ...addMarketplace, proxy: e.target.value })}
                    value={addMarketplace.proxy}
                  />
                </div>
              </div>
              <div className="row my-10">
                <div className='col-lg-2'>
                  <label className="form-label">Credential Method</label>
                  <Select
                    className='react-select-styled'
                    options={optionsCred}
                    placeholder='Select Credential Method'
                    onChange={e => setAddCredentials(e?.value ?? '')}
                    defaultValue={optionsCred.filter(cred => cred.value === addcredentials.type)}
                    isSearchable={false}
                    isClearable={false}
                  />
                </div>
                <div className='col-lg-5'>
                  <label className="form-label">{addCredWay === 'user_pass' ? 'Username or Email' : 'Public Key'}</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder={addCredWay === 'user_pass' ? 'Username or Email' : 'Public Key'}
                    onChange={e => setCredentials({ ...addcredentials, firstKey: e.target.value })}
                    defaultValue={addcredentials.firstKey}
                  />
                </div>
                <div className='col-lg-5'>
                  <label className="form-label">{addCredWay === 'user_pass' ? 'Password' : 'Private Key'}</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder={addCredWay === 'user_pass' ? 'Password for marketplace' : 'Private Key'}
                    onChange={e => setCredentials({ ...addcredentials, secondKey: e.target.value })}
                    defaultValue={addcredentials.secondKey}
                  />
                </div>
              </div>
              <div className='row mb-10'>
                <div className='col-md-2'>
                  <label className="form-label">Products CRUD Endpoint</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/product_offer"
                    onChange={e => setProductsCURD({ ...addproductsCURD, endpoint: e.target.value })}
                    defaultValue={addproductsCURD.endpoint}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Products Create</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/create"
                    onChange={e => setProductsCURD({ ...addproductsCURD, create: e.target.value })}
                    defaultValue={addproductsCURD.create}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Products Read</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/read"
                    onChange={e => setProductsCURD({ ...addproductsCURD, read: e.target.value })}
                    defaultValue={addproductsCURD.read}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Products Update</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/update"
                    onChange={e => setProductsCURD({ ...addproductsCURD, update: e.target.value })}
                    defaultValue={addproductsCURD.update}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Products Delete</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/delete"
                    onChange={e => setProductsCURD({ ...addproductsCURD, delete: e.target.value })}
                    defaultValue={addproductsCURD.delete}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Products Count</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/count"
                    onChange={e => setProductsCURD({ ...addproductsCURD, count: e.target.value })}
                    defaultValue={addproductsCURD.count}
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col-md-2'>
                  <label className="form-label">Orders CRUD Endpoint</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/product_offer"
                    onChange={e => setOrdersCRUD({ ...addordersCRUD, endpoint: e.target.value })}
                    defaultValue={addordersCRUD.endpoint}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Orders Create</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/create"
                    onChange={e => setOrdersCRUD({ ...addordersCRUD, create: e.target.value })}
                    defaultValue={addordersCRUD.create}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Orders Read</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/read"
                    onChange={e => setOrdersCRUD({ ...addordersCRUD, read: e.target.value })}
                    defaultValue={addordersCRUD.read}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Orders Update</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/update"
                    onChange={e => setOrdersCRUD({ ...addordersCRUD, update: e.target.value })}
                    defaultValue={addordersCRUD.update}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Orders Delete</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/delete"
                    onChange={e => setOrdersCRUD({ ...addordersCRUD, delete: e.target.value })}
                    defaultValue={addordersCRUD.delete}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Orders Count</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/count"
                    onChange={e => setOrdersCRUD({ ...addordersCRUD, count: e.target.value })}
                    defaultValue={addordersCRUD.count}
                  />
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="card-toolbar">
                <button type="button" onClick={() => onSubmit()} className="btn btn-sm btn-light btn-light-primary mx-4">
                  Save
                </button>
                <button type="button" onClick={() => setEditID(-2)} className="btn btn-sm btn-light btn-light-danger">
                  Discard
                </button>
              </div>
            </div>
          </div>
      }
    </Content>
  )
}
