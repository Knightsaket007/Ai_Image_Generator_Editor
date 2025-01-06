"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants"
import { CustomField } from "./CustomField"
import { startTransition, useEffect, useState, useTransition } from "react"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"
import { updateCredits } from "@/lib/actions/user.actions"
import MediaUploader from "./MediaUploader"
import TransformedImage from "./TransformedImage"
import { getCldImageUrl } from "next-cloudinary"
import { addImage, updateImage } from "@/lib/actions/image.actions"
// import { useRouter } from "next/router"
import { useRouter } from 'next/navigation';

export const formSchema = z.object({
  // username: z.string().min(2).max(50),
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
})
// TransformationForm
const TransformationForm = ({ action, data = null, userId, type, creditBalance, config = null }: TransformationFormProps) => {

  console.log({ action, data, userId, type, creditBalance, config });


  const transformationType = transformationTypes[type];
  const [image, setImage] = useState(data);
  const [newTranformation, setnewTranformation] = useState<Transformations | null>(null);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [isTransforming, setisTransforming] = useState(false)
  const [transfiormationConfig, settransfiormationConfig] = useState(config)
  const [isPending, starttransition] = useTransition();


  console.log("State Values:", { image, newTranformation, transfiormationConfig });

  const router = useRouter();

  const initialvalues = data && action === 'Update' ? {
    title: data?.title,
    aspectRatio: data?.aspectRatio,
    color: data?.color,
    prompt: data?.prompt,
    publicId: data?.publicId,
  } : defaultValues

  //1. define your form..
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialvalues,
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setisSubmitting(true);
    console.log('at 1')
    if (data || image) {
      console.log('at 2')

      const transformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transfiormationConfig
      })

      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        transformationType: type,
        width: image?.width,
        height: image?.height,
        config: transfiormationConfig,
        secureURL: image?.secureURL,
        transformationURL: transformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,
      }

      if (action === 'Add') {
        console.log('at 3')

        try {
          const newImage = await addImage({
            image: imageData,
            userId,
            path: '/'
          })

          if (newImage) {
            form.reset();
            setImage(data);
            router.push(`/transform/${newImage._id}`)
          }

        }
        catch (error) {
          console.log(error)
        }
      }


      //============ Update ==============//
      //============ Update ==============//
      if(action==='Update'){
        console.log('at 4')

        try {
          const updatedImage = await updateImage({
            image: {
              ...imageData,
              _id:data._id
            },
            userId,
            path: `/transform/${data._id}`
          })

          if (updatedImage) {
            router.push(`/transform/ ${updatedImage._id}`)
          }

        }
        catch (error) {
          console.log(error)
        }
      }
      

    }
    setisSubmitting(false)
  }

  const onSelectFieldHandler = (value: string, onchangeField: (value: string) => void) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey]

    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }))
    setnewTranformation(transformationType.config);
    return onchangeField(value);

  }

  const onInputChnageHandler = (fieldName: string, value: string, type: string, onchangeField: (value: string) => void) => {
    debounce(() => {
      setnewTranformation((prevState: any) => ({
        ...prevState,
        [type]: {
          ...prevState?.[type],
          [fieldName === 'prompt' ? 'prompt' : 'to']: value

        }
      }))
      return onchangeField(value)
    }, 1000);
  }

  // Update creditFee
  const onTransformHandler = async () => {
    setisTransforming(true);
    const mergedConfig = deepMergeObjects(newTranformation, transfiormationConfig);
    settransfiormationConfig(
      // deepMergeObjects(newTranformation, transfiormationConfig)
      mergedConfig
    )
    console.log("Merged Transformation Config:", mergedConfig);
    setnewTranformation(null)

    startTransition(async () => {
      await updateCredits(userId, -1)
    })
  }


  useEffect(()=>{

    if(image && (type==='restore' || type==='removeBackground')){
      setnewTranformation(transformationType.config)
    }

  },[image,transformationType.config,type])


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />} */}
        {/* {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />} */}
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full"
          render={({ field }) => <Input {...field} className="input-field" />}
        />

        {type === 'fill' && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect Ratio"
            className="w-full"
            render={({ field }) => (
              <Select
                onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                value={field.value}
              >
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key} className="select-item">
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {(type === 'remove' || type === 'recolor') && (
          <div className="prompt-field">
            <CustomField
              control={form.control}
              name="prompt"
              formLabel={
                type === 'remove' ? 'Object to remove' : 'Object to recolor'
              }
              className="w-full"
              render={({ field }) => (
                <Input
                  value={field.value}
                  className="input-field"
                  onChange={(e) => onInputChnageHandler(
                    'prompt',
                    e.target.value,
                    type,
                    field.onChange
                  )}
                />
              )}
            />

            {type === 'recolor' && (
              <CustomField
                control={form.control}
                name="color"
                formLabel="Replacement Color"
                className="w-full"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    className="input-field"
                    onChange={(e) => onInputChnageHandler(
                      'color',
                      e.target.value,
                      'recolor',
                      field.onChange
                    )}
                  />
                )}
              />
            )}
          </div>
        )}

        <div className="media-uploader-field">
          <CustomField
            control={form.control}
            name="publicId"
            className="flex size-full flex-col"
            render={({ field }) => (
              <MediaUploader
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}
              />
            )}
          />

          <TransformedImage
            image={image}
            type={type}
            title={form.getValues().title}
            isTransforming={isTransforming}
            setIsTransforming={setisTransforming}
            transformationConfig={transfiormationConfig}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="button"
            className="submit-button capitalize"
            disabled={isTransforming || newTranformation === null}
            onClick={onTransformHandler}
          >
            {isTransforming ? 'Transforming...' : 'Apply Transformation'}
          </Button>
          <Button
            type="submit"
            className="submit-button capitalize"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Save Image'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default TransformationForm