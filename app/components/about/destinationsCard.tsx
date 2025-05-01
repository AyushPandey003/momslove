import React from 'react'

interface DestinationsCardProps {
  title: string
  items: string[]
}

const DestinationsCard: React.FC<DestinationsCardProps> = ({ title, items }) => (
  <div className="max-w-sm mx-auto mb-8">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="space-y-4">
      {items.map((dest, idx) => (
        <div key={idx} className="bg-black text-white h-24 relative flex items-center justify-center">
          {/* Line ABOVE text */}
          <div className="absolute top-[40%] left-0 w-full h-px bg-white opacity-50 z-0"></div>

          {/* City name */}
          <span className="relative z-10 px-4 bg-black text-white">{dest}</span>
        </div>
      ))}
    </div>
    <button className="w-full bg-black text-white py-3 mt-2">Read more</button>
  </div>
)

export default DestinationsCard
