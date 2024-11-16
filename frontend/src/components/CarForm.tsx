import { CarFormData, CarFormProps } from "@/types";
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export const CarForm: React.FC<CarFormProps> = ({ onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CarFormData>({
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          tags: initialData.tags.join(", "),
        }
      : undefined,
  });

  const onFormSubmit = async (data: CarFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append(
      "tags",
      JSON.stringify(data.tags.split(",").map((t) => t.trim()))
    );

    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <Input
          {...register("title", { required: "Title is required" })}
          placeholder="Car Title"
          defaultValue={initialData?.title}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Textarea
          {...register("description", { required: "Description is required" })}
          placeholder="Car Description(min 10 characters)"
          defaultValue={initialData?.description}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <Input
          {...register("tags", { required: "Tags are required" })}
          placeholder="Tags (comma separated)"
          defaultValue={initialData?.tags.join(", ")}
        />
        {errors.tags && (
          <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
        )}
      </div>

      <div>
        <Input
          type="file"
          multiple
          accept="image/*"
          {...register("images")}
          className="file:bg-gray-100 file:rounded-sm file:text-black hover:file:bg-gray-200"
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Update Car" : "Create Car"}
      </Button>
    </form>
  );
};

export default CarForm;
