import React from 'react'
import { useParams } from 'react-router-dom'

function GroupDetails() {
  const params = useParams();

  return (
    <div>{params.id}</div>
  )
}

export default GroupDetails