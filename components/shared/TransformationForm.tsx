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
import { startTransition, useState, useTransition } from "react"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"
import { updateCredits } from "@/lib/actions/user.actions"

export const formSchema = z.object({
  // username: z.string().min(2).max(50),
  title: z.string(),
  aspactRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
})
// TransformationForm
const TransformationForm = ({ action, data = null, userId, type, creditBalance, config = null }: TransformationFormProps) => {


  const transformationType = transformationTypes[type];
  const [image, setimage] = useState(data);
  const [newTranformation, setnewTranformation] = useState<Transformations | null>(null);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [isTransforming, setisTransforming] = useState(false)
  const [transfiormationConfig, settransfiormationConfig] = useState(config)
  const [isPending, starttransition] = useTransition();

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
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  const onSelectFieldHandler = (value: string, onchangeField: (value: string) => void) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey]

    setimage((prevState: any) => ({
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

// Returns app credit
  const onTransformHandler = async () => {
    setisTransforming(true);
    settransfiormationConfig(
      deepMergeObjects(newTranformation,transfiormationConfig)
    )
    setnewTranformation(null)

    startTransition(async()=>{
      // await updateCredits(userId, creditFee)
    })
  }

  return (
    <>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CustomField
            control={form.control}
            name="title"
            formLabel="Image Title"
            className="w-fujll"
            render={({ field }) => <Input {...field} className="input-field" />}
          />

          {type === 'fill' && (
            <CustomField
              control={form.control}
              name="aspactRatio"
              formLabel="Aspect Ratio"
              className="w-full"
              render={({ field }) => (
                <Select onValueChange={(value) =>
                  onSelectFieldHandler(value, field.onchange)
                }>
                  <SelectTrigger className
                    ="select-field">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      Object.keys(aspectRatioOptions).map((key) => (
                        <SelectItem
                          key={key}
                          value={key}
                          className="select-item"
                        >
                          {aspectRatioOptions[key as AspectRatioKey].label}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>

              )}
            />
          )
          }


          {(type === 'remove' || type === 'recolor') && (
            <div className="prompt-field">
              <CustomField
                control={form.control}
                name="prompt"
                formLabel={
                  type === "remove" ? 'Remove Object' : 'Recolor Object'
                }
                className="w-full"
                render={(({ field }) => (
                  <Input
                    value={field.value}
                    className="input-field"
                    onChange={(e) => onInputChnageHandler(
                      'prompt',
                      e.target.value,
                      type,
                      field.onChange,
                    )}
                  />
                ))}
              />
            </div>
          )}


          {type === 'recolor' && (
            <CustomField
              control={form.control}
              name="color"
              formLabel="Replacement-Color"
              className="w-full"
              render={(({ field }) => (
                <Input
                  value={field.value}
                  className="input-field"
                  onChange={(e) => onInputChnageHandler(
                    'color',
                    e.target.value,
                    'recolor',
                    field.onChange,
                  )}
                />
              ))}
            />
          )}


          <div className="flex flex-col gap-4">

            <Button
              type="submit"
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
            >Submit</Button>
          </div>


        </form>
      </Form>

    </>
  )
}

export default TransformationForm