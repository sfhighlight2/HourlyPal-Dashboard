'use client'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const TEAL = '#00C4A7'
const NAVY = '#0b1629'

const subColors = {
  trialing: '#3b82f6',
  active:   '#00C4A7',
  past_due: '#f59e0b',
  canceled: '#6b7280',
  none:     '#374151',
}

const bookingColors: Record<string, string> = {
  pending:     '#f59e0b',
  accepted:    '#10b981',
  declined:    '#ef4444',
  cancelled:   '#6b7280',
  in_progress: '#3b82f6',
  completed:   '#00C4A7',
}

interface Props {
  subBreakdown: Record<string, number>
  bookingBreakdown: Record<string, number>
}

export function OverviewCharts({ subBreakdown, bookingBreakdown }: Props) {
  const subLabels  = Object.keys(subBreakdown)
  const subValues  = Object.values(subBreakdown)
  const subBgColors = subLabels.map(k => subColors[k as keyof typeof subColors] ?? '#374151')

  const bookLabels = Object.keys(bookingBreakdown)
  const bookValues = Object.values(bookingBreakdown)
  const bookBgColors = bookLabels.map(k => bookingColors[k] ?? '#374151')

  const doughnutData = {
    labels: subLabels,
    datasets: [{
      data: subValues,
      backgroundColor: subBgColors,
      borderColor: '#ffffff',
      borderWidth: 3,
      hoverBorderWidth: 0,
    }],
  }

  const barData = {
    labels: bookLabels,
    datasets: [{
      label: 'Bookings',
      data: bookValues,
      backgroundColor: bookBgColors,
      borderRadius: 6,
      borderSkipped: false,
    }],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#4A6080',
          boxWidth: 10,
          boxHeight: 10,
          padding: 14,
          font: { size: 11, family: 'Inter' },
        },
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#0B1629',
        bodyColor: '#4A6080',
        borderColor: 'rgba(0,196,167,0.3)',
        borderWidth: 1,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      },
    },
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#0B1629',
        bodyColor: '#4A6080',
        borderColor: 'rgba(0,196,167,0.3)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { color: '#8FA3BC', font: { size: 11, family: 'Inter' } },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.06)' },
        ticks: { color: '#8FA3BC', font: { size: 11, family: 'Inter' }, stepSize: 1 },
      },
    },
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Subscription Status</div>
            <div className="card-subtitle">Users by subscription tier</div>
          </div>
        </div>
        <div className="card-body" style={{ height: 260 }}>
          {subValues.every(v => v === 0)
            ? <div className="empty-state"><div className="empty-icon">📊</div><div className="empty-text">No data</div></div>
            : <Doughnut data={doughnutData} options={doughnutOptions} />
          }
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Booking Funnel</div>
            <div className="card-subtitle">Bookings by current status</div>
          </div>
        </div>
        <div className="card-body" style={{ height: 260 }}>
          {bookValues.length === 0
            ? <div className="empty-state"><div className="empty-icon">📅</div><div className="empty-text">No bookings yet</div></div>
            : <Bar data={barData} options={barOptions} />
          }
        </div>
      </div>
    </>
  )
}
