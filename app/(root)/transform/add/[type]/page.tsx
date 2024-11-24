import React from 'react'
import { transformationTypes } from '@/constants'
import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/TransformationForm';
import { auth } from '@clerk/nextjs/server';
import { getUserById } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

const AddTransformationTypePage = async ({ params: { type } }: SearchParamProps) => {
  const { userId } = auth();
  let transform = transformationTypes[type];

  if (!userId) redirect('/sign-in')
  let user = await getUserById(userId);
  return (
    <>
      <Header title={transform.title} subtitle={transform.subTitle} />

      <section className='mt-10'>
        <TransformationForm
          action='Add'
          userId={user._id}
          type={transform.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />

      </section>

    </>
  )
}

export default AddTransformationTypePage