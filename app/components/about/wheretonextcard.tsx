"use client"
import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface WhereToNextCardProps {
  title: string
}

const WhereToNextCard: React.FC<WhereToNextCardProps> = ({ title }) => {
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)

  return (
    <div className="max-w-sm mx-auto mb-8 border border-gray-300 p-6">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-700 mb-5">There&apos;s a wide world waiting for you</p>
      <div className="flex flex-col space-y-5">
        <input
          type="text"
          placeholder="Destination name"
          className="w-full bg-transparent border-0 border-b border-gray-400 focus:border-blue-600 focus:outline-none pb-2 text-sm text-gray-900"
        />
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date)}
          placeholderText="Check-in date"
          className="w-full bg-transparent border-0 border-b border-gray-400 focus:border-blue-600 focus:outline-none pb-2 text-sm text-gray-900"
          dateFormat="yyyy-MM-dd"
        />
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date)}
          placeholderText="Check-out date"
          className="w-full bg-transparent border-0 border-b border-gray-400 focus:border-blue-600 focus:outline-none pb-2 text-sm text-gray-900"
          dateFormat="yyyy-MM-dd"
        />
        <button className="text-black-800 underline text-sm self-start hover:text-blue-900 transition-colors duration-150">
          Read more
        </button>
      </div>
    </div>
  )
}

export default WhereToNextCard
