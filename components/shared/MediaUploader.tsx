"use client"

import { useToast } from '@/hooks/use-toast'
import React from 'react'
import { CldImage, CldUploadWidget } from "next-cloudinary"
import Image from 'next/image';
import { dataUrl, getImageSize } from '@/lib/utils';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';

type mediaUploadType = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>
  publicId: string;
  image: any;
  type: string;
}

const MediaUploader = ({ onValueChange, setImage, publicId, image, type }: mediaUploadType) => {
  const { toast } = useToast();


  const onUploadSuccessHandler = (result: any) => {

    setImage((prevState: any) => ({
      ...prevState,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureUrl: result?.info?.secure_url
    }))

    onValueChange(result?.info?.public_id)

    toast({
      title: 'Image upload successfully',
      duration: 5000,
      description: '1 credit was deducted from your account',
      className: 'success-toast'
    })
  }

  const onUploadErrorHandler = () => {
    toast({
      title: 'something wrong while uploading',
      duration: 5000,
      description: 'please try again',
      className: 'error-toast'
    })
  }

  return (
    <>

      <CldUploadWidget
        uploadPreset='knight_picfer'
        options={{
          multiple: false,
          resourceType: 'image'
        }}
        onSuccess={onUploadSuccessHandler}
        onError={onUploadErrorHandler}
      >
        {({ open }) => (
          <div className='flex flex-col gap-4'>
            <h3 className='h3-bold text-dark-600'>
              original
            </h3>

            {publicId ? (
              <>
                <CldImage
                  alt="image"
                  width={getImageSize(type, image, 'width')}
                  height={getImageSize(type, image, 'height')}
                  src={publicId}
                  sizes={"(max-width:767px) 100vw, 50vw"}
                  placeholder={dataUrl as PlaceholderValue}
                />
              </>
            ) : (
              // If image is not there means public id is empty
              <div className='media-uploader_cta' onClick={() => open()}>
                <div className='media-uploader_cta-image'>
                  <Image
                    src="/assets/icons/add.svg"
                    alt="add_image"
                    width={25}
                    height={25}
                  />
                </div>
              </div>
            )}

          </div>
        )}
      </CldUploadWidget>

    </>
  )
}

export default MediaUploader