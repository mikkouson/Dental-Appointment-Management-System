import { ServiceFormValues } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Field from "../formField";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";

interface ServicesFieldsProps {
  form: UseFormReturn<ServiceFormValues>;
  onSubmit: (data: ServiceFormValues) => void;
}

const ServicesFields = ({ form, onSubmit }: ServicesFieldsProps) => {
  const { isSubmitting } = form.formState;
  const [preview, setPreview] = useState<string | null>(null);
  const [isLocalImage, setIsLocalImage] = useState(false);

  // Add effect to handle initial image value
  useEffect(() => {
    const imageValue = form.getValues("image");
    if (imageValue && typeof imageValue === "string") {
      setPreview(imageValue);
      setIsLocalImage(false);
    }
  }, [form]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: { onChange: (file: File) => void }
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        form.setError("image", {
          type: "manual",
          message: "File size must be less than 2MB",
        });
        return;
      }

      if (
        !["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
          file.type
        )
      ) {
        form.setError("image", {
          type: "manual",
          message: "Only .jpg, .jpeg, .png and .gif formats are supported",
        });
        return;
      }

      form.clearErrors("image");
      field.onChange(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setIsLocalImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (field: { onChange: (file: null) => void }) => {
    field.onChange(null);
    setPreview(null);
    setIsLocalImage(false);
    form.clearErrors("image");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Field form={form} name="name" label="Name" />
          <Field form={form} name="price" label="Price" num={true} />
          <Field
            form={form}
            name="description"
            label="Description"
            textarea={true}
          />

          {/* Image Upload Field */}
          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Service Image</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {preview ? (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden group">
                        {isLocalImage ? (
                          // For local file preview (data URL)
                          <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          // For remote URLs (Supabase)
                          <div className="relative w-full h-full">
                            <Image
                              src={preview}
                              alt="Preview"
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeImage({ onChange })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            JPG, PNG or GIF (MAX. 2MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/jpg,image/png,image/gif"
                          onChange={(e) => handleImageChange(e, { onChange })}
                          {...field}
                        />
                      </label>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ServicesFields;
