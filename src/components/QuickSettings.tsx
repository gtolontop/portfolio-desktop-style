'use client'

import { useState, useRef, useEffect } from 'react'
import { Wifi, WifiOff, Volume2, VolumeX, Battery, BatteryFull, BatteryLow, BatteryMedium, Bluetooth, Plane, Moon, Sun, Monitor, Cast, Accessibility, Settings, ChevronRight } from 'lucide-react'

interface QuickSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export default function QuickSettings({ isOpen, onClose }: QuickSettingsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Quick settings state
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false)
  const [airplaneMode, setAirplaneMode] = useState(false)
  const [nightLight, setNightLight] = useState(false)
  const [focusAssist, setFocusAssist] = useState(false)
  const [volume, setVolume] = useState(75)
  const [brightness, setBrightness] = useState(80)
  const [batteryPercent] = useState(85)

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

  const getBatteryIcon = () => {
    if (batteryPercent > 70) return <BatteryFull className="w-5 h-5" />
    if (batteryPercent > 30) return <BatteryMedium className="w-5 h-5" />
    return <BatteryLow className="w-5 h-5 text-red-500" />
  }

  if (!isVisible) return null

  const quickActions = [
    {
      id: 'wifi',
      icon: wifiEnabled ? Wifi : WifiOff,
      label: 'Wi-Fi',
      sublabel: wifiEnabled ? 'Connected' : 'Off',
      active: wifiEnabled,
      onClick: () => setWifiEnabled(!wifiEnabled)
    },
    {
      id: 'bluetooth',
      icon: Bluetooth,
      label: 'Bluetooth',
      sublabel: bluetoothEnabled ? 'On' : 'Off',
      active: bluetoothEnabled,
      onClick: () => setBluetoothEnabled(!bluetoothEnabled)
    },
    {
      id: 'airplane',
      icon: Plane,
      label: 'Airplane mode',
      sublabel: airplaneMode ? 'On' : 'Off',
      active: airplaneMode,
      onClick: () => setAirplaneMode(!airplaneMode)
    },
    {
      id: 'nightlight',
      icon: nightLight ? Moon : Sun,
      label: 'Night light',
      sublabel: nightLight ? 'On' : 'Off',
      active: nightLight,
      onClick: () => setNightLight(!nightLight)
    },
    {
      id: 'focus',
      icon: Moon,
      label: 'Focus assist',
      sublabel: focusAssist ? 'On' : 'Off',
      active: focusAssist,
      onClick: () => setFocusAssist(!focusAssist)
    },
    {
      id: 'cast',
      icon: Cast,
      label: 'Cast',
      sublabel: 'Off',
      active: false,
      onClick: () => {}
    },
  ]

  return (
    <div
      ref={panelRef}
      className="fixed"
      style={{
        bottom: '62px',
        right: '8px',
        width: '360px',
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
      {/* Quick Actions Grid */}
      <div className="p-3">
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map(action => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`
                  flex flex-col items-start p-3 rounded-lg transition-all duration-150
                  ${action.active
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/50 hover:bg-white/80 text-gray-700'
                  }
                `}
              >
                <Icon className="w-5 h-5 mb-2" />
                <span className="text-xs font-medium truncate w-full">{action.label}</span>
                <span className={`text-[10px] ${action.active ? 'text-white/80' : 'text-gray-500'}`}>
                  {action.sublabel}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sliders */}
      <div className="px-4 pb-3 space-y-4">
        {/* Brightness Slider */}
        <div className="flex items-center gap-3">
          <Sun className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value))}
            className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                     [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <Monitor className="w-5 h-5 text-gray-600 flex-shrink-0" />
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-3">
          <button onClick={() => setVolume(volume > 0 ? 0 : 75)}>
            {volume > 0 ? (
              <Volume2 className="w-5 h-5 text-gray-600 flex-shrink-0" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-600 flex-shrink-0" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                     [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <span className="text-xs text-gray-600 w-8 text-right">{volume}%</span>
        </div>
      </div>

      {/* Battery & Footer */}
      <div className="border-t border-gray-200/50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getBatteryIcon()}
            <span className="text-sm text-gray-700">{batteryPercent}%</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-black/5 rounded-lg transition-colors">
              <Accessibility className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-black/5 rounded-lg transition-colors flex items-center gap-1">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
