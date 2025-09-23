'use client'

interface AppTemplateProps {
  children?: React.ReactNode
}

export default function AppTemplate({ children }: AppTemplateProps) {
  return (
    <div className="h-full w-full">
      {children}
    </div>
  )
}