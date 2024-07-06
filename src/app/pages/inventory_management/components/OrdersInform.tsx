
import { useEffect, useRef, FC } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { getCSS, getCSSVariableValue } from '../../../../_metronic/assets/ts/_utils'
import { useThemeMode } from '../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'
import Select from 'react-select';
import { Product } from './Products';

type Props = {
  className: string,
  series: string,
  categories: string,
  product: Product,
}

const OrdersInformation: FC<Props> = ({ className, series, categories, product }) => {
  console.log(product);
  const options = [
    { value: 'ncx_rate', label: 'NCX rate' },
    { value: 'total_orders', label: 'Total Orders' },
    { value: 'ncx_orders', label: 'NCX Orders' },
  ]
  const chartRef = useRef<HTMLDivElement | null>(null)
  const { mode } = useThemeMode()
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

  useEffect(() => {
    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, mode])

  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Orders Information</span>
        </h3>
      </div>
      <div className='card-body'>
        <div className='row'>
          <h4>
            Mini Umidificator de aer cu difuzor aromaterapie si lumini LED, portabil, USB, rezervor 220 ml, 2 moduri de functionare, lumini de noapte, umidificator camera si masina auto, Alb
          </h4>
        </div>
        <div className='row align-content-center'>
          <div className='col-xl-2'>
            <a href={product.url}>
              <img src={JSON.parse(product.images)[0]} alt={product.name} className='w-150px h-150px' />
            </a>
          </div>
          <div className='col-xl-10'>
            <div className='row'>
              <div className='col-md-4'>
                <span>ASIN</span><br />
                <span>{product.part_number_key}</span>
              </div>
              <div className='col-md-4'>
                <span>FnSku</span><br />
                <span>X001RQWRPZ</span>
              </div>
              <div className='col-md-4'>
                <span>SKU</span><br />
                <span>90-E7WH-FROG</span>
              </div>
            </div>
            <div className="separator my-10"></div>
            <div className='row'>
              <div className='col-md-1'>
                <span>Total orders</span><br />
                <span>417</span>
              </div>
              <div className='col-md-3'>
                <span>Negative Customer Experience (NCX) orders</span><br />
                <span>3</span>
              </div>
              <div className='col-md-1'>
                <span>NCX rate</span><br />
                <span>0.72%</span>
              </div>
              <div className='col-md-2'>
                <span>NCX Review Rate</span><br />
                <span>0%</span>
              </div>
              <div className='col-md-1'>
                <span>NCX Return Rate</span><br />
                <span>0.48%</span>
              </div>
              <div className='col-md-1'>
                <span>Last updated</span><br />
                <span>2024-06-17</span>
              </div>
              <div className='col-md-3'>
                <span>Customer Experience (CX) Health</span><br />
                <span className='badge badge-light-success fw-bold fs-7 p-2'>Good</span>
              </div>
            </div>
          </div>
        </div>
        <div className='d-flex'>
          <span className='align-content-center fw-bold text-gray-800 fs-5 px-2'>Parameter</span>
          <Select
            className='react-select-styled react-select-solid'
            classNamePrefix='react-select'
            options={options}
            placeholder='Select an option'
          />
        </div>
        <div ref={chartRef} id='kt_charts_widget_6_chart' style={{ height: '350px' }}></div>
      </div>
    </div>
  )
}

export { OrdersInformation }

function getChartOptions(height: number, series: string, categories: string): ApexOptions {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')

  const baseColor = getCSSVariableValue('--bs-primary')
  const baseLightColor = getCSSVariableValue('--bs-primary-light')
  const secondaryColor = getCSSVariableValue('--bs-info')

  return {
    series: JSON.parse(series),
    chart: {
      fontFamily: 'inherit',
      stacked: true,
      height: height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        columnWidth: '12%',
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
      show: true,
      width: 2,
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
      max: 3,
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      opacity: 1,
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
      y: {
        formatter: function (val) {
          return '$' + val + ' thousands'
        },
      },
    },
    colors: [baseColor, secondaryColor, baseLightColor],
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
