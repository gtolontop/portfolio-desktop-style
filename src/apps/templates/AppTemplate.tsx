'use client'

interface AppTemplateProps {
  children?: React.ReactNode
}

export default function AppTemplate({ children }: AppTemplateProps) {
  return (
    <div className="h-full w-full flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
      <div className="text-center space-y-6">
        <div className="inline-block p-6 rounded-2xl"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
          {children || (
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2">App Content</h1>
              <p className="text-lg opacity-90">Your content here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}