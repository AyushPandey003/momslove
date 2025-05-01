import React from 'react'

interface WhereToNextCardProps {
  title: string
}

const WhereToNextCard: React.FC<WhereToNextCardProps> = ({ title }) => (
  <div className="max-w-sm mx-auto mb-8 border border-gray-300 rounded-lg p-6">
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    <p className="text-gray-600 mb-4">There&apos;s a wide world waiting for you</p>
    <div className="flex flex-col space-y-4">
      <input
        type="text"
        placeholder="Destination name"
        className="w-full border-b border-gray-400 pb-2 focus:outline-none"
      />
      <input
        type="date"
        className="w-full border-b border-gray-400 pb-2 focus:outline-none"
      />
      <input
        type="date"
        className="w-full border-b border-gray-400 pb-2 focus:outline-none"
      />
      <button className="mt-4 w-full bg-black text-white py-2 rounded">Read more</button>
    </div>
  </div>
)

export default WhereToNextCard
