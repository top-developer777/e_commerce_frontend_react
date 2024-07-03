import { Content } from '../../../../_metronic/layout/components/content'
import React, { useState, useCallback, useEffect } from 'react'
import Select from 'react-select'
import { useDropzone } from 'react-dropzone'
import { createMarketplace, getAllMarketplaces, removeMarketplace, uploadImage } from "./_request";

const flags = {
  "ro": "romania",
  "bg": "bulgaria",
  "hu": "hungary"
}

const DragDropFileUpload: React.FC<{
  setImg: React.Dispatch<React.SetStateAction<string>>
}> = (props) => {
  const onDrop = useCallback(async (acceptedFile: File[]) => {
    // Handle the dropped files
    const formData = new FormData();
    formData.append('file', acceptedFile[0]);

    let res;
    try {
      res = await uploadImage(formData)
      console.log('File uploaded successfully:', res);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    props.setImg(res.filepath)
    console.log(acceptedFile);
  }, [props]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  );
};

export function Integrations() {
  const [editID, setEditID] = useState(-1);
  const [editImg, setEditImg] = useState('');
  const [addCountry, setAddCountry] = useState('');
  const [addCredWay, setAddCredentials] = useState('');
  const [addMarketplace, setAddMarketPlace] = useState({});
  const [addcredentials, setCredentials] = useState({});
  const [addproductsCURD, setProductsCURD] = useState({});
  const [addordersCRUD, setOrdersCRUD] = useState({});
  const [allMarketplaces, setAllMarketPlaces] = useState([]);
  const options_cred = [
    { value: 'user_pass', label: 'Username (email) / Password' },
    { value: 'pub_priv', label: 'Public Key / Private Key' },
  ]
  const options_country = [
    { value: 'ro', label: 'Romania' },
    { value: 'bg', label: 'Bulgaria' },
    { value: 'hu', label: 'hungary' },
  ]

  useEffect(() => {
    getAllMarketplaces()
      .then(res => {
        setAllMarketPlaces(res.data)
        console.log(res)
      })
  }, [])

  const onEdit = (index: number) => {
    setEditID(index);
    setAddMarketPlace(allMarketplaces[index]);
    setCredentials(allMarketplaces[index]["credentials"]);
    setProductsCURD(allMarketplaces[index]["products_crud"]);
    setOrdersCRUD(allMarketplaces[index]["orders_crud"]);
    setAddCountry(allMarketplaces[index]["country"]);
    setAddCredentials(allMarketplaces[index]["credentials"]["type"]);
  }

  const onRemove = (index: number) => {
    removeMarketplace(allMarketplaces[index]["id"])
      .then(res => {
        if (res.data.msg)
          setAllMarketPlaces(allMarketplaces.filter((marketplace, idx) => idx != index))
      })
  }

  const onSubmit = async () => {
    setCredentials({ ...addcredentials, "type": addCredWay })
    setAddMarketPlace({ ...addMarketplace, "country": addCountry, "products_crud": addproductsCURD, "orders_crud": addordersCRUD })
    const data = {
      "image_url": editImg,
      ...addMarketplace,
      "country": addCountry,
      "products_crud": addproductsCURD,
      "orders_crud": addordersCRUD,
      "credentials": {
        ...addcredentials,
        "type": addCredWay
      },
    }
    const res = await createMarketplace(data)
    if (res.msg == "success") {
      setEditID(-1);
    }
  }
  return (
    <Content>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3>
          Marketplace Integration
        </h3>
        <div>
          <button type='button' className='btn btn-light btn-light-primary' onClick={() => setEditID(999)}>Add</button>
        </div>
      </div>
      {
        editID == -1 ?
          <div className="row g-5 mb-4">
            {
              allMarketplaces.map((marketplace: {
                title: string;
                image_url: string;
                country: 'ro' | 'bg' | 'hu';
                marketplaceDomain: string;
                owner: string;
              }, index) =>
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
                    <div className="card-body py-10 mb-2">
                      <div className="row">
                        <div className="d-flex flex-center">
                          <img className="rounded" height={45} alt='eMag image' src={marketplace.image_url} />
                        </div>
                      </div>
                    </div>
                    <div className="card-footer p-4">
                      <img className="w-15px h-15px rounded-1 ms-2" src={`/media/flags/${flags[marketplace.country]}.svg`} alt="metronic" />
                      &nbsp;&nbsp;{marketplace.marketplaceDomain} : {marketplace.owner}
                    </div>
                  </div>
                </div>
              )
            }
          </div>
          :
          <div className="card card-custom card-flush">
            <div className="card-header">
              <h3 className="card-title">Marketplace API Integration</h3>
            </div>
            <div className="card-body py-5">
              <div className='row'>
                <div className='col-lg-4'>
                  {editImg == '' ?
                    <DragDropFileUpload setImg={setEditImg} />
                    :
                    <img className='w-100' src={editImg} />
                  }
                </div>
                <div className='col-lg-4'>
                  <div className="mb-8">
                    <label className="form-label">Marketplace Title</label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      placeholder="eMAG Marketplace"
                      onChange={e => setAddMarketPlace({ ...addMarketplace, "title": e.target.value })}
                    />
                  </div>
                  <div className="mb-8">
                    <label className="form-label">Base URL</label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      placeholder="https://marketplace.emag.ro/"
                      onChange={e => setAddMarketPlace({ ...addMarketplace, "baseURL": e.target.value })}
                    />
                  </div>
                  <div className="mb-8">
                    <label className="form-label">Base API URL</label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      placeholder="https://marketplace-api.emag.ro/api-3"
                      onChange={e => setAddMarketPlace({ ...addMarketplace, "baseAPIURL": e.target.value })}
                    />
                  </div>
                </div>
                <div className='col-lg-4'>
                  <div className='row mb-8'>
                    <div className='col-md-6'>
                      <label className="form-label">Marketplace Domain</label>
                      <input
                        type="text"
                        className="form-control form-control-solid"
                        placeholder="eMAG.ro"
                        onChange={e => setAddMarketPlace({ ...addMarketplace, "marketplaceDomain": e.target.value })}
                      />
                    </div>
                    <div className='col-md-6'>
                      <label className="form-label">Country</label>
                      <Select
                        className='react-select-styled'
                        classNamePrefix='react-select'
                        options={options_country}
                        placeholder='Select Country'
                        onChange={e => setAddCountry(e ? e.value : '')}
                      />
                    </div>
                  </div>
                  <div className="mb-8">
                    <label className="form-label">Owner</label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      placeholder="admin@admin.com"
                      onChange={e => setAddMarketPlace({ ...addMarketplace, "owner": e.target.value })}
                    />
                  </div>
                  <div className="mb-8">
                    <label className="form-label">Proxy</label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      placeholder="http://username:password@ipadress:port"
                      onChange={e => setAddMarketPlace({ ...addMarketplace, "owner": e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="row mb-10">
                <div className='col-lg-2'>
                  <label className="form-label">Credential Method</label>
                  <Select
                    className='react-select-styled'
                    classNamePrefix='react-select'
                    options={options_cred}
                    placeholder='Select Credential Method'
                    onChange={e => setAddCredentials(e ? e.value : '')}
                  />
                </div>
                <div className='col-lg-5'>
                  <label className="form-label">Username or Email</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="Username or Email"
                    onChange={e => setCredentials({ ...addcredentials, "firstKey": e.target.value })}
                  />
                </div>
                <div className='col-lg-5'>
                  <label className="form-label">Password</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="Password for marketplace"
                    onChange={e => setCredentials({ ...addcredentials, "secondKey": e.target.value })}
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
                    onChange={e => setProductsCURD({ ...addproductsCURD, "endpoint": e.target.value })}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Products Create</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/create"
                    onChange={e => setProductsCURD({ ...addproductsCURD, "create": e.target.value })}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Products Read</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/read"
                    onChange={e => setProductsCURD({ ...addproductsCURD, "read": e.target.value })}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Products Update</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/update"
                    onChange={e => setProductsCURD({ ...addproductsCURD, "update": e.target.value })}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Products Delete</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/delete"
                    onChange={e => setProductsCURD({ ...addproductsCURD, "delete": e.target.value })}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Products Count</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/count"
                    onChange={e => setProductsCURD({ ...addproductsCURD, "count": e.target.value })}
                  />
                </div>
              </div>
              <div className='row mb-10'>
                <div className='col-md-2'>
                  <label className="form-label">Orders CRUD Endpoint</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/product_offer"
                    onChange={e => setOrdersCRUD({ ...addordersCRUD, "endpoint": e.target.value })}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Orders Create</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/create"
                    onChange={e => setOrdersCRUD({ ...addordersCRUD, "create": e.target.value })}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Orders Read</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/read"
                    onChange={e => setOrdersCRUD({ ...addordersCRUD, "read": e.target.value })}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Orders Update</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/update"
                    onChange={e => setOrdersCRUD({ ...addordersCRUD, "update": e.target.value })}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Orders Delete</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/delete"
                    onChange={e => setOrdersCRUD({ ...addordersCRUD, "delete": e.target.value })}
                  />
                </div>
                <div className='col-md-2'>
                  <label className="form-label">Orders Count</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="/count"
                    onChange={e => setOrdersCRUD({ ...addordersCRUD, "count": e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="card-toolbar">
                <button type="button" onClick={() => onSubmit()} className="btn btn-sm btn-light btn-light-primary mx-4">
                  Save
                </button>
                <button type="button" onClick={() => setEditID(-1)} className="btn btn-sm btn-light btn-light-danger">
                  Discard
                </button>
              </div>
            </div>
          </div>
      }
    </Content>
  )
}
