import React from 'react'
import {  NoticeForm } from '../noticeForm'

const NewNoticePage = () => {
  return (
    <div className="max-w-2xl mx-auto w-full mt-4 ">
      <h1 className="text-3xl font-bold ">Post Notice</h1>
      <div className="mt-10 p-4 rounded-md border">
        <NoticeForm />
      </div>
    </div>
  )
}

export default NewNoticePage