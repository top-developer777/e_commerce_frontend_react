
import { useEffect, useRef, FC, useState } from 'react'
import Select from 'react-select';
import ApexCharts, { ApexOptions } from 'apexcharts'
import { getCSS, getCSSVariableValue } from '../../../../_metronic/assets/ts/_utils'
import { useThemeMode } from '../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'
import { Product } from '../../models/product'
import { getSalesInfo } from '../../dashboard/components/_request';

type Props = {
  className: string,
  series: string,
  categories: string,
  product: Product,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SalesInformation: FC<Props> = ({ className, series, categories, product }) => {
  const [seriesSales, setSeriesSales] = useState<string>(series);
  const [categories1, setCategories] = useState<string>(categories);
  const [salesPeriod, setSalesPeriod] = useState<number>(1);
  const salesPeriodOptions = [
    { value: 1, label: 'Last 12 months by month' },
    { value: 2, label: 'Last 3 months by week' },
    { value: 3, label: 'Last month by day' },
  ];

  const chartRef = useRef<HTMLDivElement | null>(null)
  const { mode } = useThemeMode()
  const refreshChart = () => {
    if (!chartRef.current) {
      return;
    }
    const height = parseInt(getCSS(chartRef.current, 'height'));
    const chart = new ApexCharts(chartRef.current, getChartOptions(height, seriesSales, categories1));
    if (chart) {
      chart.render();
    }
    return chart;
  }

  useEffect(() => {
    getSalesInfo(product.id ?? 0, salesPeriod)
      .then(res => {
        if (res.data !== '') {
          const data = res.data as [{ date_string: string, sales: number }];
          const catigories: string[] = [];
          const series: number[] = [];
          data.forEach(datum => {
            catigories.push(datum.date_string);
            series.push(datum.sales);
          });
          setSeriesSales(JSON.stringify([{ name: 'Sales', data: series }]));
          setCategories(JSON.stringify(catigories));
        }
      })
      .catch(e => console.error(e));
  }, [product.id, salesPeriod])
  useEffect(() => {
    const chart = refreshChart()
    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, mode, seriesSales, categories1]);

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
            <Select
              className='react-select-styled react-select-solid react-select-sm flex-grow-1'
              options={salesPeriodOptions}
              defaultValue={salesPeriodOptions[0]}
              onChange={value => setSalesPeriod(value?.value ?? 1)}
              isClearable={false}
              isSearchable={false}
            />
          </div>
          <div className='col-xl-4'></div>
          <div className='col-xl-4 align-content-center' style={{ fontSize: 18, fontWeight: 600 }}>
            Total orders: {JSON.parse(seriesSales).length > 0 && JSON.parse(seriesSales)[0].data.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0)}
          </div>
        </div>
        {/* <div className='row'>
          <div className="col-md-12">
            <button type="button" className="btn btn-sm btn-light btn-light-primary fs-6 w-60px p-1">
              Sales
            </button>
            <button type="button" className="btn btn-sm btn-light btn-light-primary fs-6 w-60px p-1">
              Units
            </button>
          </div>
        </div> */}
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
