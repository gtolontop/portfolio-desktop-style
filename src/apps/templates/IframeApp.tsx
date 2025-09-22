'use client'

interface IframeAppProps {
  url: string
  title?: string
}

export default function IframeApp({ url, title }: IframeAppProps) {
  return (
    <div className="h-full w-full flex flex-col">
      {title && (
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
          <h2 className="text-white font-medium">{title}</h2>
        </div>
      )}
      <iframe
        src={url}
        className="flex-1 w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}