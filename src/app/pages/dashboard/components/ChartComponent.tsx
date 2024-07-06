
import { useEffect, useRef, FC } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { getCSS, getCSSVariableValue } from '../../../../_metronic/assets/ts/_utils'
import { useThemeMode } from '../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

type Props = {
  className: string,
  series: string,
  categories: string
}

const ChartComponent: FC<Props> = ({ className, series, categories }) => {
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
  }, [chartRef, mode, series, categories])

  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Recent Orders</span>
          <span className='text-muted fw-semibold fs-7'>More than 500+ new orders</span>
        </h3>
        <div className='card-toolbar' data-kt-buttons='true'>
          <a
            className='btn btn-sm btn-color-muted btn-active btn-active-primary active px-4 me-1'
            id='kt_charts_widget_6_sales_btn'
          >
            Sales
          </a>
          <a
            className='btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1'
            id='kt_charts_widget_6_expenses_btn'
          >
            Expenses
          </a>
        </div>
      </div>
      <div className='card-body'>
        <div ref={chartRef} id='kt_charts_widget_6_chart' style={{ height: '350px' }}></div>
      </div>
    </div>
  )
}

export { ChartComponent }

function getChartOptions(height: number, series: string, categories: string): ApexOptions {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')

  return {
    series: JSON.parse(series),
    chart: {
      fontFamily: 'inherit',
      stacked: false,
      height: height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 3,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 5,
      hover: {
        size: 5,
      }
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: [2, 0, 2, 0],
      colors: ['#4e91ff', '#fff', '#f00', '#fff'],
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
    colors: ['rgba(137,80,252,1)', 'rgba(27,197,189,1)', 'rgba(246,78,96,1)', 'rgba(105,147,255,1)'],
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
