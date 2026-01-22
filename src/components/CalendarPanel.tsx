'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useSystemStore } from '@/store/systemStore'

interface CalendarPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function CalendarPanel({ isOpen, onClose }: CalendarPanelProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const panelRef = useRef<HTMLDivElement>(null)

  const { calendarEvents } = useSystemStore()

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days = []

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      })
    }

    return days
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString()
  }

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(e => {
      const eventDate = new Date(e.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const hasEvents = (date: Date) => getEventsForDate(date).length > 0

  const days = getDaysInMonth(currentDate)
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const selectedEvents = getEventsForDate(selectedDate)

  if (!isVisible) return null

  return (
    <div
      ref={panelRef}
      className="fixed"
      style={{
        bottom: '62px',
        right: '8px',
        width: '340px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        background: `
          linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.85) 0%,
            rgba(255, 255, 255, 0.75) 50%,
            rgba(245, 245, 250, 0.8) 100%
          )
        `,
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.25),
          0 0 0 1px rgba(255, 255, 255, 0.1) inset,
          0 1px 0 rgba(255, 255, 255, 0.5) inset
        `,
        zIndex: 9999,
        transform: isAnimating
          ? 'translateY(0) scale(1)'
          : 'translateY(20px) scale(0.95)',
        opacity: isAnimating ? 1 : 0,
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-out',
        transformOrigin: 'bottom right',
        overflow: 'hidden'
      }}
    >
      {/* Current Time */}
      <div className="p-4 text-center border-b border-gray-200/50">
        <div className="text-4xl font-light text-gray-800">
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Calendar Header */}
      <div className="px-4 py-2 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="p-1.5 hover:bg-black/5 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <span className="text-sm font-semibold text-gray-800">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button
          onClick={nextMonth}
          className="p-1.5 hover:bg-black/5 rounded-lg transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Week Days */}
      <div className="px-3 grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="px-3 pb-3 grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => setSelectedDate(day.date)}
            className={`
              relative w-full aspect-square flex items-center justify-center text-xs rounded-full
              transition-all duration-150
              ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
              ${isToday(day.date) ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
              ${isSelected(day.date) && !isToday(day.date) ? 'bg-blue-100 text-blue-700' : ''}
              ${!isToday(day.date) && !isSelected(day.date) ? 'hover:bg-black/5' : ''}
            `}
          >
            {day.day}
            {hasEvents(day.date) && (
              <span className={`absolute bottom-0.5 w-1 h-1 rounded-full ${isToday(day.date) ? 'bg-white' : 'bg-blue-500'}`} />
            )}
          </button>
        ))}
      </div>

      {/* Events for Selected Date */}
      <div className="border-t border-gray-200/50 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-700">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <button className="p-1 hover:bg-black/5 rounded transition-colors">
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {selectedEvents.length > 0 ? (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {selectedEvents.map(event => (
              <div
                key={event.id}
                className="flex gap-2 p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
              >
                <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: event.color }} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-gray-800 truncate">{event.title}</div>
                  <div className="text-[10px] text-gray-500">{event.time}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-500 text-center py-2">
            No events for this day
          </div>
        )}
      </div>
    </div>
  )
}
