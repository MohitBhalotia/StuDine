import React from 'react'
import { IssueForm } from '../issueForm'

const NewIssuePage = () => {
  return (
    <div className="max-w-2xl mx-auto w-full mt-4 ">
      <h1 className="text-3xl font-bold ">Raise Issue</h1>
      <div className="mt-10 p-4 rounded-md border">
        <IssueForm />
      </div>
    </div>
  )
}

export default NewIssuePage