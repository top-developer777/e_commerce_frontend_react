import { useEffect, useState } from 'react';
import { Content } from '../../../../_metronic/layout/components/content'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Product } from '../../models/product';
import { getAllProducts } from '../../dashboard/components/_request';
import { formatCurrency } from '../../dashboard/components/_function';
import { interMKP } from '../../config/components/Integrations';
import { getAllMarketplaces } from '../../config/components/_request';
import { Return } from '../../models/returns';
import { getAllReturns } from './_request';

export const NeridicateComponent = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [codeType, setCodeType] = useState<string>();
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number, height: number }>({ width: 500, height: 400 });
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [marketplaces, setMarketplaces] = useState<interMKP[]>([]);
  const [returns, setReturns] = useState<Return[]>([]);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader", {
      formatsToSupport: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.CODE_93,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
      ],
      verbose: false,
    });
    setHtml5QrCode(html5QrCode);
    getAllProducts(1, 1000)
      .then((res) => setProducts(res.data))
      .catch((e) => console.error(e));
    getAllMarketplaces()
      .then(res => setMarketplaces(res.data))
      .catch(e => console.error(e));
    getAllReturns()
      .then(res => setReturns(res.data))
      .catch(e => console.error(e));
  }, []);
  useEffect(() => {
    if (codeType === 'bar') setSelectedProduct(products.find(product => parseInt(product.ean) === parseInt(result ?? '')));
  }, [result, codeType]);

  const startScanning = async () => {
    if (html5QrCode) {
      try {
        const videoConstraints = {
          facingMode: "environment",
        };

        const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

        setDimensions({
          width: capabilities.width?.max || 500,
          height: capabilities.height?.max || 400,
        });

        let errorCount = 0;

        html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 0,
            qrbox: { width: 400, height: 250 },
          },
          (decodedText, decodedResult) => {
            const codeType = decodedResult.result.format?.formatName === 'QR_CODE' ? 'qr' : 'bar';
            setCodeType(codeType);
            // if (codeType === 'qr') {
            //   // const newWnd = window.open(decodedText);
            //   // setResult(null);
            //   // if (!newWnd) {
            //     navigator.clipboard.writeText(decodedText);
            //     prompt('Please copy this url.', decodedText);
            //   // }
            // } else {
              setResult(decodedText);
            // }
            setScanning(false);
            html5QrCode.stop().then(() => {
              stream.getTracks().forEach(track => track.stop());
            });
          },
          (err) => {
            errorCount++;
            if (errorCount > 1000) {
              errorCount = 0;
              setError(err);
            }
          }
        );
        setScanning(true);
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setError("Error accessing camera: " + err);
      }
    }
  };
  const stopScanning = () => {
    if (html5QrCode) {
      html5QrCode.stop().then(() => {
        setScanning(false);
      });
    }
  };
  const flags = {
    "ro": "romania",
    "bg": "bulgaria",
    "hu": "hungary"
  }
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const status = ['', 'Incomplete', 'New', 'Acknowledged', 'Refused', 'Canceled', 'Received', 'Finalized'];

  return (
    <Content>
      {result === null &&
        <>
          <div
            id="reader"
            className='mx-auto bg-dark mw-100 mh-100'
            style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
          ></div>
          <div className="row">
            <div className="col-md-12 text-center pt-3">
              {scanning ? (
                <button className='btn btn-danger' onClick={stopScanning}>
                  <i className="bi bi-stop-circle" style={{ marginTop: '-3px' }}></i>
                  Stop Scanning
                </button>
              ) : (
                <button className='btn btn-primary' onClick={startScanning}>
                  <i className="bi bi-play-circle" style={{ marginTop: '-3px' }}></i>
                  Start Scanning
                </button>
              )}
            </div>
          </div>
          {error && <div className='text-center text-danger fs-8'>Error: {error}</div>}
        </>
      }
      {!!result && codeType === 'bar' && <>
        <div className="row">
          <div className="col-md-12">
            {!selectedProduct && <div className='w-100 text-center'>
              <h1 className='text-danger'>Can&apos;t find this product.</h1>
              <h4>EAN: {result}</h4>
              <button className='btn btn-danger' onClick={() => setResult(null)}>
                <i className="bi bi-repeat" style={{ marginTop: '-3px' }}></i>
                Restart Scanning
              </button>
            </div>}
            {!!selectedProduct && <div className='w-100 text-center my-10'>
              <h2>{selectedProduct.product_name}</h2>
              <div className="row">
                <div className="col-md-3">
                  {
                    selectedProduct.image_link
                      ? <img className='rounded-2' width={200} src={selectedProduct.image_link} alt={selectedProduct.product_name} />
                      : <div> No Image </div>
                  }
                </div>
                <div className="col-md-9 fs-4 pt-5">
                  <div className="row">
                    <div className="col-md-3 fw-bold">Part Number Key</div>
                    <div className="col-md-3">{selectedProduct.part_number_key ?? 'None'}</div>
                    <div className="col-md-3 fw-bold">Model Name</div>
                    <div className="col-md-3">{selectedProduct.model_name ?? 'None'}</div>
                  </div>
                  <div className="row">
                    <div className="col-md-3 fw-bold">Price</div>
                    <div className="col-md-3">{formatCurrency(parseFloat(selectedProduct.price ?? '0'))}</div>
                    <div className="col-md-3 fw-bold">Sale Price</div>
                    <div className="col-md-3">{formatCurrency(parseFloat(selectedProduct.sale_price ?? '0'))}</div>
                  </div>
                  <div className="row">
                    <div className="col-md-3 fw-bold">EAN</div>
                    <div className="col-md-3">{selectedProduct.ean}</div>
                    <div className="col-md-3 fw-bold">Weight</div>
                    <div className="col-md-3">{parseFloat(selectedProduct.weight ?? '0')} kg</div>
                  </div>
                  <div className="row">
                    <div className="col-md-3 fw-bold">Stock</div>
                    <div className="col-md-3">{selectedProduct.stock ?? 0}</div>
                    <div className="col-md-3 fw-bold">Day Left in Stock</div>
                    <div className="col-md-3">{selectedProduct.day_stock ?? 0}</div>
                  </div>
                  <div className="row">
                    <div className="col-md-3 fw-bold">Barcode Title</div>
                    <div className="col-md-3">{selectedProduct.barcode_title}</div>
                    <div className="col-md-3 fw-bold">Masterbox Title</div>
                    <div className="col-md-3">{selectedProduct.masterbox_title}</div>
                  </div>
                  <div className="row">
                    <div className="col-md-3 fw-bold">1688 Link</div>
                    <div className="col-md-3">{!!selectedProduct.link_address_1688 ? <a href={selectedProduct.link_address_1688}>{selectedProduct.link_address_1688}</a> : 'None'}</div>
                    <div className="col-md-3 fw-bold">Variation Name</div>
                    <div className="col-md-3">{selectedProduct.variation_name_1688}</div>
                  </div>
                  <div className="row">
                    <div className="col-md-3 fw-bold">1688 Price</div>
                    <div className="col-md-3">{formatCurrency(parseFloat(selectedProduct.price_1688 ?? '0'))}</div>
                    <div className="col-md-3 fw-bold">PCS / STN</div>
                    <div className="col-md-3">{selectedProduct.pcs_ctn}</div>
                  </div>
                </div>
                <div className="row my-5 row-cols-4">
                  {
                    marketplaces.filter(marketplace => (selectedProduct.market_place?.findIndex(mkp => mkp === marketplace.marketplaceDomain) as number) >= 0).map((marketplace: interMKP, index) =>
                      <div className='col' key={`MKP${index}`}>
                        <div className="card card-custom card-flush">
                          <div className="card-header px-6">
                            <h4 className="card-title">{marketplace.title}</h4>
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
                <div className="row my-5">
                  <div className="col-md-12 table-responsive">
                    {(() => {
                      const filteredReturns = returns.filter(_return => _return.products.findIndex(product => selectedProduct.id === product) >= 0);
                      if (filteredReturns.length === 0) return <h2 className='text-center text-danger'>This product hasn&apos;t yet returned.</h2>
                      return (
                        <table className="table table-bordered table-rounded table-hover table-striped">
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Quantity</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Customer Name</th>
                              <th>Reason</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredReturns.map(_return => {
                              const index = _return.products.findIndex(product => selectedProduct.id === product);
                              return (
                                <tr key={`return${_return.order_id}`}>
                                  <td>{_return.order_id}</td>
                                  <td>{_return.quantity[index]}</td>
                                  <td>{(new Date(_return.date)).toLocaleString()}</td>
                                  <td>{status[_return.request_status ?? 0]}</td>
                                  <td>{_return.customer_name}</td>
                                  <td>{_return.return_reason}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )
                    })()}
                  </div>
                </div>
                <div className="row my-5">
                  <div className="col-md-12 align-items-center">
                    <button className='btn btn-danger'>
                      <i className="bi bi-check-circle" style={{ marginTop: '-3px' }}></i>
                      Defective
                    </button>
                    <button className='btn btn-success ms-3' onClick={() => setResult(null)}>
                      <i className="bi bi-skip-end-fill" style={{ marginTop: '-3px' }}></i>
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>}
          </div>
        </div>
      </>}
      {!!result && codeType === 'qr' && <>
        AWB: {result}
      </>}
    </Content>
  )
}
