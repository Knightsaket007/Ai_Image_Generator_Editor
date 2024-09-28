import React from 'react'
import {transformationTypes} from '@/constants'
import Header from '@/components/shared/Header'

const AddTransformationTypePage = ({params:{type}}:SearchParamProps) => {
  let transform=transformationTypes[type];
  return (
    <>
    <Header title={transform.title} subtitle={transform.subTitle}/>
    
    </>
  )
}

export default AddTransformationTypePage