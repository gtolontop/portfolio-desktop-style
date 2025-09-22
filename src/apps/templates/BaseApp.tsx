'use client'

interface BaseAppProps {
  title?: string
  children: React.ReactNode
}

export default function BaseApp({ title, children }: BaseAppProps) {
  return (
    <div className="h-full w-full flex flex-col">
      {title && (
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
          <h2 className="text-white font-medium">{title}</h2>
        </div>
      )}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}