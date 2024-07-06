
import { useEffect, useRef, FC } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { getCSS, getCSSVariableValue } from '../../../../_metronic/assets/ts/_utils'
import { useThemeMode } from '../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'
import { Product } from './Products'

type Props = {
  className: string,
  series: string,
  categories: string,
  product: Product,
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SalesInformation: FC<Props> = ({ className, series, categories, product }) => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, mode])

  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Sales Information</span>
        </h3>
      </div>
      <div className='card-body py-0'>
        <div className='row'>
          <div className='col-xl-4'>
            <div className='mb-2 text-gray-800 fw-bold'>
              View sales data for:
            </div>
            <div className='mb-2'>
              <button type="button" className="btn btn-sm btn-light btn-light-primary fs-6 w-60px p-1">
                SKU
              </button>
              <button type="button" className="btn btn-sm btn-light btn-light-primary fs-6 w-60px p-1">
                ASIN
              </button>
            </div>
            <div className='row mb-2'>
              <div className='col-md-6 text-gray-800 fw-bold'>
                Sales rank
              </div>
              <div className='col-md-6 text-gray-800 fw-bold'>
                Category
              </div>
            </div>
            <div className='row mb-4'>
              <div className='col-md-6 fw-bold'>
                4,349
              </div>
              <div className='col-md-6 fw-bold'>
                Home & Kitcken
              </div>
            </div>
          </div>
          <div className='col-xl-8'>
            <div className='row mb-2'>
              <div className='col-md-3'>

              </div>
              <div className='col-md-3 text-gray-800 fw-bold'>
                Last 7 days
              </div>
              <div className='col-md-3 text-gray-800 fw-bold'>
                Last 30 days
              </div>
              <div className='col-md-3 text-gray-800 fw-bold'>
                Last 90 days
              </div>
            </div>
            <div className='row mb-2'>
              <div className='col-md-3 text-end text-gray-800 fw-bold align-content-center'>
                Units ordered
              </div>
              <div className='col-md-3 fw-bold fs-5'>
                4
              </div>
              <div className='col-md-3 fw-bold fs-5'>
                17
              </div>
              <div className='col-md-3 fw-bold fs-5'>
                17
              </div>
            </div>
            <div className='row mb-2'>
              <div className='col-md-3 text-end text-gray-800 fw-bold align-content-center'>
                Avg units per order
              </div>
              <div className='col-md-3 fw-bold fs-5'>
                1.00
              </div>
              <div className='col-md-3 fw-bold fs-5'>
                1.00
              </div>
              <div className='col-md-3 fw-bold fs-5'>
                1.00
              </div>
            </div>
            <div className='row mb-2'>
              <div className='col-md-3 text-end text-gray-800 fw-bold align-content-center'>
                Avg selling price
              </div>
              <div className='col-md-3 fw-bold fs-5'>
                {formatCurrency(27.33)}
              </div>
              <div className='col-md-3 fw-bold fs-5'>
                {formatCurrency(27.03)}
              </div>
              <div className='col-md-3 fw-bold fs-5'>
                {formatCurrency(27.03)}
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className="col-md-12">
            <button type="button" className="btn btn-sm btn-light btn-light-primary fs-6 w-60px p-1">
              Sales
            </button>
            <button type="button" className="btn btn-sm btn-light btn-light-primary fs-6 w-60px p-1">
              Units
            </button>
          </div>
          
        </div>
        <div ref={chartRef} id='kt_charts_widget_6_chart' style={{ height: '350px' }}></div>
      </div>
    </div>
  )
}

export { SalesInformation }

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
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'solid',
      opacity: 1,
    },
    stroke: {
      curve: 'straight',
      show: true,
      width: 3,
      colors: [baseColor],
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
      max: 120,
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
